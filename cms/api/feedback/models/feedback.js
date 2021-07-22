'use strict';
const Chance = require('chance-de')
const chance = new Chance()

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
 lifecycles: {
    async beforeCreate(data) {
      // Generate fake name for feedback
      data.fakeAuthor = chance.first({nationality: 'de'});
      
      // Do not publish feedback immediately
      data.published_at = null;
    },
  },
};
