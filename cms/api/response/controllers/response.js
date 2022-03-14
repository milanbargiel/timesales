'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const axios = require('axios');

const processAiOutput = (aiOutput) => {
  let processedOutput;

  // Check first 20 characters
  // If there is a point or a comma, remove everything untill there
  const firstPunctuationMark = aiOutput.search(/[.,]/g);
  // Remove everything from the end untill the last punctuation mark
  const lastPunctuationMark = aiOutput.lastIndexOf('.');

  // Only apply changes when the punctuation marks are not the same
  if (lastPunctuationMark > firstPunctuationMark) {
    processedOutput = aiOutput
      .substring(
        firstPunctuationMark + 1, // remove punctuation mark
        lastPunctuationMark + 1 // keep last punctuation mark
      )
      .trim(); // remove whitespace from beginning

    // Capitalize first letter
    processedOutput =
      processedOutput.charAt(0).toUpperCase() + processedOutput.slice(1);
  } else {
    // Else use regular aiOutput
    processedOutput = aiOutput;
  }

  return processedOutput;
};

module.exports = {
  /**
   * Update a record.
   *
   * @return {Object}
   */

  async generateAiComment(ctx) {
    const { id } = ctx.params; // Id of response

    // Get ai configuration
    const config = await strapi.services.config.find();

    // Check wether aiConfig is set
    if (!config || !config.aiConfig) {
      return ctx.badRequest('aiConfig is not set');
    }

    // 1. Iterate over fields from the request data and get the userInput for ai comment generation
    const requestBody = ctx.request.body;

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

    // 2. Send userInput to the GPT2 app to generate an ai comment
    await axios
      .post(
        strapi.config.get('server.gpt2Api'),
        {
          prefix: userInput,
          length: config.aiConfig.numberOfWords, // number of words that ai shall respond withs
          temperature: config.aiConfig.temperature,
          top_k: config.aiConfig.topK
        },
        { timeout: config.aiConfig.milliSecondsToWait }
      )
      .then((response) => {
        aiOutput = response.data.text;
      })
      .catch(async () => {
        // When the requests runs into a timeout or when the gpt2 app is down
        // Only save the userInput for the specific field
        try {
          const userInput = {
            [fieldName]: {
              userInput
            }
          };
          await strapi.services.response.update({ id }, userInput);
          return userInput;
        } catch (error) {
          // Throw an error when userInput could not be saved
          return ctx.badImplementation(error);
        }
      });

    // 3. Process aiOutput and make it meaningful
    enhancedOutput = processAiOutput(aiOutput);

    const aiGeneratedData = {
      userInput,
      aiOutput,
      enhancedOutput
    };

    // 4. Save data in database
    const response = await strapi.services.response.findOne({ id });

    // 4A. If field type is a repeatable component (e.g. isItGodComments), add to array
    if (Array.isArray(response[fieldName])) {
      await strapi.services.response.update(
        { id },
        {
          [fieldName]: [...response[fieldName], aiGeneratedData]
        }
      );

      return { [fieldName]: aiGeneratedData };
    }
    // 4B. If field type is a single component update response
    await strapi.services.response.update(
      { id },
      { [fieldName]: aiGeneratedData }
    );

    // Return data to display it in the bot conversation of the frontend
    return { [fieldName]: aiGeneratedData };
  }
};
