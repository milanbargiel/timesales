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

    // Get ai configuration
    const config = await strapi.services.config.find();

    // Check wether aiConfig is set
    if (!config || !config.aiConfig) {
      return ctx.badRequest('aiConfig is not set');
    }

    // Send userInput to the GPT2 app to generate an ai comment
    const requestBody = ctx.request.body;

    // Iterate over fields from the request data and get the userInput for ai comment generation
    let fieldName, userInput;

    for (var key in requestBody) {
      if (
        requestBody.hasOwnProperty(key) &&
        requestBody[key].hasOwnProperty('userInput')
      ) {
        fieldName = key;
        userInput = requestBody[key].userInput;
        break; // only consider first userInput field
      }
    }

    console.log(fieldName, userInput);

    const entity = await strapi.services.response.update(
      { id },
      ctx.request.body
    );

    return sanitizeEntity(entity, { model: strapi.models.response });
  }
};
