'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Update a record.
   *
   * @return {Object}
   */

  async generateAiComment(ctx) {
    const { id } = ctx.params;
    // Request to the AI for generating an comment
    // For now just paste dummy data

    const entity = await strapi.services.response.update(
      { id },
      ctx.request.body
    );

    return sanitizeEntity(entity, { model: strapi.models.response });
  }
};
