'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

 const { sanitizeEntity } = require('strapi-utils');
 const unparsed = require('koa-body/unparsed.js'); // Used to extract Stripe request authentification
 const stripe = require('stripe')(strapi.config.get('server.stripePrivateKey'));
 const endpointSecret = strapi.config.get('server.stripeEndpointSecret');
 const humanizeDuration = require('humanize-duration'); // 

 module.exports = {
  // Retrieve an order by its key (secret url slug) instead of numerical id
  async findOne(ctx) {
    const { key } = ctx.params;

    const entity = await strapi.services.order.findOne({ key });
    return sanitizeEntity(entity, { model: strapi.models.order });
  },

  // Update progress field of an order
  async update(ctx) {
    const { key } = ctx.params;

    let entity = await strapi.services.order.findOne({ key });
    entity = await strapi.services.order.update({ id: entity.id }, {
      progress: ctx.request.body.progress
    });

    return sanitizeEntity(entity, { model: strapi.models.order });
  },

  // Create order
  // Triggered as a webhook when Stripe payment is completed
  async create(ctx) {
    // Verify that post event comes from Stripe
    const signature = ctx.request.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(ctx.request.body[unparsed], signature, endpointSecret);
    } catch (error) {
      console.log(error);
    }

    // Handle the checkout.session.completed event
    // checkout.session.completed: The customer has successfully authorized the debit payment by submitting the Checkout form.
    if (event.type === 'checkout.session.completed') {

      // Create database entry
      try {
        const session = event.data.object; // Get data from Stripe session
        
        const order = {
          name: session.metadata.name,
          email: session.customer_details.email,
          price: parseInt(session.amount_total),
          time: parseInt(session.metadata.time),
          description: session.metadata.description,
          stripePaymentID: session.payment_intent,
          key: session.id
        }

        const entity = await strapi.services.order.create(order);
        const entry = sanitizeEntity(entity, { model: strapi.models.order });
        
        // Create extra fields for the success E-Mail
        entity.timeString = `${humanizeDuration(1000 * session.metadata.time)} of time for – ${session.metadata.description}`;
        entity.successUrl = session.success_url.replace('{CHECKOUT_SESSION_ID}', entity.key)

        // Send invoice per E-mail
        if (entity.email) {
          const email = await strapi.plugins['email'].services.email.renderMail(entity, 'time-purchased');

          strapi.plugins['email'].services.email.send({
            to: entity.email,
            from: 'hello@timesales.ltd',
            bcc: 'hello@timesales.ltd', // Send a blindcopy to keep track of orders
            subject: 'Thank you for ordering time',
            text: email.text
          })
        }

        return entry;
      } catch (error) {
        console.log(error);
      }
    }
  },

  // Create Checkout Session in Stripe and return ID
  // Reference: https://stripe.com/docs/api/checkout/sessions/object
  async createCheckoutSession(ctx) {
    const payload = ctx.request.body;
    // convert seconds from payload.time to ms and make it human readable
    const timeString = `${humanizeDuration(1000 * payload.time)} of time for – ${payload.description}`;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'sepa_debit', 'sofort'],
        locale: 'en',
        line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: timeString
            },
            unit_amount: payload.price // price is in cents
          },
          quantity: 1,
        },
        ],
        metadata: {
          name: payload.name,
          time: payload.time, // in seconds
          description: payload.description, // original user input
        },
        mode: 'payment',
        // TODO: Check wether URLs are either localhost:3000 or timesales.ltd to prevent fraud
        success_url: payload.successUrl + '?key={CHECKOUT_SESSION_ID}',
        cancel_url: payload.cancelUrl
      });

      // Return session id for the link to the Stripe checkout page
      return { id: session.id };
    } catch (err) {
      console.log(err)
    }
  },
};
