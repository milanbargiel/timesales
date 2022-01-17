'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');
const unparsed = require('koa-body/unparsed.js'); // Used to extract Stripe request authentification
const stripe = require('stripe')(strapi.config.get('server.stripePrivateKey'));
const endpointSecret = strapi.config.get('server.stripeEndpointSecret');
const taxRateId = strapi.config.get('server.stripeTaxRateId');
const pdf = require('html-pdf');

module.exports = {
  // Retrieve an order by its key (secret url slug) instead of numerical id
  async findOne(ctx) {
    const { key } = ctx.params;

    const orderEntity = await strapi.services.order.findOne({ key });
    return sanitizeEntity(orderEntity, { model: strapi.models.order });
  },

  // Update progress field of an order
  async update(ctx) {
    const { key } = ctx.params;

    let entity = await strapi.services.order.findOne({ key });
    entity = await strapi.services.order.update(
      { id: entity.id },
      {
        progress: ctx.request.body.progress
      }
    );

    return sanitizeEntity(entity, { model: strapi.models.order });
  },

  // Create order
  // Triggered as a webhook when Stripe payment is completed
  async create(ctx) {
    // Verify that post event comes from Stripe
    const signature = ctx.request.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        ctx.request.body[unparsed],
        signature,
        endpointSecret
      );
    } catch (error) {
      console.log(error);
    }

    // Handle the checkout.session.completed event
    // checkout.session.completed: The customer has successfully authorized the debit payment by submitting the Checkout form.
    if (event.type === 'checkout.session.completed') {
      // Create database entry
      try {
        const session = event.data.object; // Get data from Stripe session

        // Fetch customer object with Stripe API to get name field from checkout
        // https://stripe.com/docs/api/customers/retrieve?lang=node
        const customer = await stripe.customers.retrieve(session.customer);

        // Save response data
        const response = {
          id: session.metadata.responseId,
          timePrice: parseInt(session.amount_subtotal), // in cents, without tax
          timeAmount: parseInt(session.metadata.timeAmount),
          timeUnit: session.metadata.timeUnit, // 'seconds', 'minutes' etc
          timePurpose: session.metadata.timePurpose, // purpose of the time
          orderSummary: session.metadata.orderSummary // Order summary
        };

        let responseEntity;

        if (response.id) {
          // Update data when entry was already saved
          responseEntity = await strapi.services.response.update(
            { id: response.id },
            {
              ...response
            }
          );
        } else {
          // Allow recording is false
          response.allowRecording = false;
          // Create entry
          responseEntity = await strapi.services.response.create(response);
        }

        // Save order data
        const order = {
          response: responseEntity.id, // Connect order and corresponding response
          orderName: customer.name, // name from stripe checkout
          orderEmail: session.customer_details.email,
          stripePaymentId: session.payment_intent, // to identify payment in stripe dashboard
          key: session.id,
          streamUrl: session.success_url.replace(
            '{CHECKOUT_SESSION_ID}',
            session.id
          )
        };

        const orderEntity = await strapi.services.order.create(order);
        const orderEntry = sanitizeEntity(orderEntity, {
          model: strapi.models.order
        });

        // Update relation to response with id from order
        await strapi.services.response.update(
          { id: responseEntity.id },
          {
            order: orderEntity.id
          }
        );

        // Send invoice per E-mail
        if (orderEntity && responseEntity) {
          // Create email template
          const email = await strapi.plugins['email'].services.email.renderMail(
            orderEntity,
            responseEntity,
            'time-purchased-mail'
          );

          // Create invoice
          const invoiceHtml = await strapi.plugins[
            'email'
          ].services.email.createInvoice(
            orderEntity,
            responseEntity,
            'invoice'
          );

          // Send email
          pdf.create(invoiceHtml).toBuffer((err, invoicePdf) => {
            strapi.plugins['email'].services.email.send({
              to: orderEntity.orderEmail,
              from: 'hello@timesales.ltd',
              bcc: 'hello@timesales.ltd', // Send a blindcopy to keep track of orders
              subject: 'Thank you for ordering time',
              html: email.html,
              text: email.text, // text version is automatically generated by email-templates package
              attachments: [
                {
                  filename: 'invoice.pdf',
                  content: invoicePdf
                }
              ]
            });
          });
        }

        return orderEntry;
      } catch (error) {
        console.log(error);
      }
    }
  },

  // Create Checkout Session in Stripe and return ID
  // Reference: https://stripe.com/docs/api/checkout/sessions/object
  async createCheckoutSession(ctx) {
    const payload = ctx.request.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'sepa_debit', 'sofort'],
        locale: 'en',
        shipping_address_collection: {
          allowed_countries: ['DE']
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 299,
                currency: 'eur'
              },
              display_name: 'Shipping',
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 2
                },
                maximum: {
                  unit: 'business_day',
                  value: 3
                }
              }
            }
          }
        ],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: payload.orderSummary
              },
              unit_amount: payload.timePrice // price is in cents
            },
            quantity: 1,
            tax_rates: [taxRateId]
          }
        ],
        metadata: {
          responseId: payload.id, // response id if answers were already saved in cms
          name: payload.name,
          timeAmount: payload.timeAmount,
          timeUnit: payload.timeUnit,
          timePurpose: payload.timePurpose, // original user input
          orderSummary: payload.orderSummary
        },
        mode: 'payment',
        // TODO: Check wether URLs are either localhost:3000 or timesales.ltd to prevent fraud
        success_url: payload.successUrl + '?key={CHECKOUT_SESSION_ID}',
        cancel_url: payload.cancelUrl
      });

      // Return session id for the link to the Stripe checkout page
      return { id: session.id };
    } catch (err) {
      console.log(err);
    }
  },
  // For testing purpose only
  // Todo: Remove, once the application goes live
  async createInvoice(ctx) {
    const { key } = ctx.params;
    const order = await strapi.services.order.findOne({ key });
    const html = await strapi.plugins['email'].services.email.createInvoice(
      order,
      order.response,
      'invoice'
    );

    pdf.create(html).toStream((err, stream) => {
      stream.pipe(ctx.res);
    });

    ctx.res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=invoice.pdf'
    });

    // wait for stream to finish
    return new Promise((resolve) => ctx.res.on('finish', resolve));
  }
};
