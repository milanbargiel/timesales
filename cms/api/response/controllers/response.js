'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const axios = require('axios');

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

    const requestBody = ctx.request.body;

    // Iterate over fields from the request data and get the userInput for ai comment generation
    let fieldName, userInput, aiOutput, enhancedOutput;

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

    // Send userInput to the GPT2 app to generate an ai comment
    await axios
      .post(
        strapi.config.get('server.gpt2Api'),
        {
          prefix: userInput,
          length: config.aiConfig.numberOfWords, // number of words that ai responds withs
          temperature: config.aiConfig.temperature,
          top_k: config.aiConfig.topK
        },
        { timeout: config.aiConfig.milliSecondsToWait }
      )
      .then((response) => {
        aiOutput = response.data.text;

        // enhance output to make it meaningfull
        // check first 20 characters
        // if there is a point or a comma, remove everything untill there
        const firstPunctuationMark = aiOutput.search(/[.,]/g);
        // remove everything from the end untill the last punctuation mark
        const lastPunctuationMark = aiOutput.lastIndexOf('.');

        // Only apply changes when the punctuation marks are not the same
        if (lastPunctuationMark > firstPunctuationMark) {
          enhancedOutput = aiOutput
            .substring(
              firstPunctuationMark + 1, // remove punctuation mark
              lastPunctuationMark + 1 // keep last punctuation mark
            )
            .trim(); // remove whitespace from beginning
        }
        // Else use regular aiOutput
        enhancedOutput = aiOutput;
      })
      .catch((error) => {
        // When the requests runs into a timeout or when the gpt2 app is down
        console.log(error);
        aiOutput = undefined;
        enhancedOutput = undefined;
      });

    const aiComment = {
      [fieldName]: {
        userInput,
        aiOutput,
        enhancedOutput
      }
    };

    // Push aiComment to array for repeatable comments
    if (fieldName === 'isItGodComments') {
      const response = await strapi.services.response.findOne({ id });
      // Save userInput and aiOutput in the database
      await strapi.services.response.update(
        { id },
        {
          [fieldName]: [
            ...response[fieldName],
            {
              userInput,
              aiOutput,
              enhancedOutput
            }
          ]
        }
      );

      return aiComment;
    }

    // Save userInput and aiOutput in the database
    await strapi.services.response.update({ id }, aiComment);

    return aiComment;
  }
};
