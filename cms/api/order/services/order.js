'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  // Singularize timeunit e.g second(s)
  time: (timeAmount, timeUnit) => {
    return `${timeAmount} ${timeAmount === 1 ? timeUnit.slice(0, -1) : timeUnit}`
  }
};
