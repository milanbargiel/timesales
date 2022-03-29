'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const axios = require('axios');

// Function to augment user input to increase the relevance of ai comments
const augmentUserInput = (userInput, fieldName) => {
  let augmentedInput = userInput;

  if (fieldName === 'timePurpose') {
    // Remove everything from the end untill the last punctuation mark
    augmentedInput = 'Time for ' + augmentedInput;

    // Replace personal pronouns
    augmentedInput = augmentedInput.replace(/\b(my)\b/i, 'your');
    augmentedInput = augmentedInput.replace(/\b(myself)\b/i, 'yourself');
    augmentedInput = augmentedInput.replace(/\b(me)\b/i, 'yourself');
    augmentedInput = augmentedInput.replace(/\b(you)\b/i, 'the Time Sales bot');
    augmentedInput = augmentedInput.replace(/\b(i)\b/i, 'you');
  } else if (fieldName === 'artAsInvestment') {
    augmentedInput = 'Art investment ' + augmentedInput;
  }

  return augmentedInput;
};

const processAiOutput = (aiOutput, fieldName, userInput) => {
  let processedOutput = aiOutput;
  let augmenterString;

  // Remove augmenter strings from the beginning of processed output
  if (fieldName === 'timePurpose') {
    augmenterString = 'Time for ';
    processedOutput = aiOutput.substring(
      augmenterString.length,
      processedOutput.length
    );
  } else if (fieldName === 'artAsInvestment') {
    augmenterString = 'Art investment ';
    processedOutput = aiOutput.substring(
      augmenterString.length,
      processedOutput.length
    );
  }

  // Remove user input from the beginning of the processed output
  // Only remove it, if it hasn't been changed by the AI (therefore it ends with the character space)
  // and it is not part of the timePurpose answer
  if (
    processedOutput.includes(`${userInput} `) &&
    fieldName !== 'timePurpose'
  ) {
    processedOutput = processedOutput.substring(
      userInput.length + 1,
      processedOutput.length
    );
  }

  // Remove special characters from the beginning until the first appearance of a letter
  // Remove symbols and punctuation marks at the beginning (-,; etc.)
  const firstLetterIndex = processedOutput
    .split('')
    .findIndex((c) => c.toLowerCase() != c.toUpperCase()); // test if a regular character from the alphabet is found

  if (firstLetterIndex > 1) {
    processedOutput = processedOutput.substring(
      firstLetterIndex,
      processedOutput.length
    );
  }

  // For texts with more than one punctuation marks, shorten the output from first to last punctuation mark
  const firstPunctuationMark = processedOutput.search(/[.,]/g);
  // lastIndexOf does not allow for regex, therefore use math.max to find the last occurence of '.' or ';'
  const lastPunctuationMark = Math.max(
    processedOutput.lastIndexOf('.'),
    processedOutput.lastIndexOf(';')
  );

  if (lastPunctuationMark > firstPunctuationMark) {
    processedOutput = processedOutput
      // Extract text between the first and the last punctuation mark
      .substring(
        fieldName === 'timePurpose' ? 0 : firstPunctuationMark + 1, // For timePurpose start from beginning
        lastPunctuationMark
      );
  }

  processedOutput = processedOutput.trim();

  // Return processed text and capitalize first letter
  return processedOutput.charAt(0).toUpperCase() + processedOutput.slice(1);
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

    // 2. Augment the user input for specific fields to increase the relevance of the ai comment
    const augmentedUserInput = augmentUserInput(userInput, fieldName);

    // 3. Send input to the GPT2 app to generate an ai comment
    const aiComment = await axios
      .post(
        strapi.config.get('server.gpt2Api'),
        {
          prefix: augmentedUserInput,
          length: config.aiConfig.numberOfWords, // number of words that ai shall respond withs
          temperature: config.aiConfig.temperature,
          top_k: config.aiConfig.topK
        },
        { timeout: config.aiConfig.milliSecondsToWait }
      )
      .then((response) => {
        return response.data.text;
      })
      .catch(async (error) => {
        // When the requests runs into a timeout or when the gpt2 app is down
        console.log(error);
        return undefined;
      });

    const aiGeneratedData = {
      userInput,
      aiOutput: aiComment ? aiComment : undefined,
      enhancedOutput: aiComment
        ? processAiOutput(aiComment, fieldName, userInput) // Process aiOutput and strip content
        : undefined
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
