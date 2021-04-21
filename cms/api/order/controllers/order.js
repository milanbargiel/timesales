'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

 const { sanitizeEntity } = require('strapi-utils');
 const unparsed = require('koa-body/unparsed.js'); // Used to extract Stripe request authentification
 const stripe = require('stripe')('sk_test_51Ig9QCHHn9ZSZEneIp03I7pkwIUj89ErFNcQ3e7GZSVc5zZzHvDRImdLz3seEJ3zCr5Rbhqoz9KwMjHG6HoyG7U200qUFctzo9');
 const endpointSecret = 'whsec_55whyoOEPGdF3G18khK5j4tUPkqRKjwd';

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

  // A webhook that is trigger when Stripe payment is completed
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
          stripePaymentID: session.payment_intent
        }

        const entity = await strapi.services.order.create(order);

        return sanitizeEntity(entity, { model: strapi.models.order });
      } catch (error) {
        console.log(error)
      }
    }
  },

  // Create Checkout Session in Stripe and return ID
  // The Session shows data that is posted to it
  async createCheckoutSession(ctx) {
    const payload = ctx.request.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'sepa_debit', 'sofort'],
        locale: 'en',
        line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: payload.description
            },
            unit_amount: payload.price // price is in cents
          },
          quantity: 1,
        },
        ],
        metadata: {
          name: payload.name,
          time: payload.time,
          description: payload.description
        },
        mode: 'payment',
        // TODO: Check wether URLs are either localhost:3000 or timesales.ltd to prevent fraud
        success_url: payload.successUrl,
        cancel_url: payload.cancelUrl
      });

      // Return session id for the link to the Stripe checkout page
      return { id: session.id };
    } catch (err) {
      console.log(err)
    }
  },
};
