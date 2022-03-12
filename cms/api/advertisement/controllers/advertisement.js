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
  // Save a customer review
  async createReview(ctx) {
    try {
      let response;

      // Get the order for the review if an order key was attached to the request
      if (
        Object.prototype.hasOwnProperty.call(ctx.request.body, 'responseId')
      ) {
        response = await strapi.services.response.findOne({
          id: ctx.request.body.responseId
        });
      }

      // Get the advertisement single-content type
      let advertisement = await strapi.services.advertisement.find();

      // Add a review to the advertisement single-content typ
      advertisement = await strapi.services.advertisement.createOrUpdate({
        reviews: [
          ...advertisement.reviews,
          {
            // When an response exists, connect it to the review
            ...(response && { response: response.id }),
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
