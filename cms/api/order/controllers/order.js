'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

 const { sanitizeEntity } = require('strapi-utils');
 const stripe = require('stripe')('sk_test_51Ig9QCHHn9ZSZEneIp03I7pkwIUj89ErFNcQ3e7GZSVc5zZzHvDRImdLz3seEJ3zCr5Rbhqoz9KwMjHG6HoyG7U200qUFctzo9');

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
  async create(ctx) {

    // Charge the customer
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: ctx.request.body.description,
            },
            unit_amount: ctx.request.body.price, // price is in cents
          },
          quantity: 1,
        },
        ],
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      });

      // Save the order in the database
      try {
        const entity = await strapi.services.order.create(ctx.request.body);

        // Return Stripe Checkout Session ID
        return { id: session.id };
      } catch (err) {
        console.log(err)
      }
    } catch (err) {
      console.log(err)
    }
  },
};
