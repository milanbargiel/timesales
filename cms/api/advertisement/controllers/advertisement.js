'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');
// Use chance module to generate fake names for reviews
const Chance = require('chance-de');
const chance = new Chance();

module.exports = {
  // Save a customer review for an order
  async createReview(ctx) {
    // Find order specified with key
    const { key } = ctx.params;

    try {
      const order = await strapi.services.order.findOne({ key });
      // Get the advertisement single-content type
      let advertisement = await strapi.services.advertisement.find();

      // Add a review to the advertisement single-content typ
      advertisement = await strapi.services.advertisement.createOrUpdate({
        reviews: [
          ...advertisement.reviews,
          {
            order: order.id,
            opinion: ctx.request.body.opinion,
            fakeAuthor: chance.first({ nationality: 'de' })
          }
        ]
      });

      return sanitizeEntity(advertisement, {
        model: strapi.models.advertisement
      });
    } catch (error) {
      console.log(error);
    }
  }
};
