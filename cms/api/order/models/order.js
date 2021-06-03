'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    // Called before an entry is created
    beforeCreate(data) {
        data.invoiceId = 'RE-Time-2020-10-10-01'; // Placeholder until legal issues are solved
    },
  },
};
