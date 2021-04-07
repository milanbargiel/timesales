'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const { nanoid } = require('nanoid');

module.exports = {
  /**
   * Triggered before order creation.
   */
  lifecycles: {
    async beforeCreate(data) {
      data.key = nanoid(10); // create random keys programatically
    },
  },
};
