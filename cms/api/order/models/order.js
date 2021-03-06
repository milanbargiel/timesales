'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async afterCreate(result) {
        // Fetch all orders from today to generate invoiceId
        // 1. Format date
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; // increment plus one because month starts with index 0
        const yyyy = today.getFullYear();
        
        if (dd < 10) {
            dd=`0${dd}`;
        }

        if(mm < 10) {
            mm=`0${mm}`;
        }

        today = `${yyyy}-${mm}-${dd}`;
        const dailyOrders = await strapi.services.order.find({ created_at_gt: today }); // the newly created order is included

        // 2. Save invoiceId
        // First in result, so it is immediately availabe for the invoice generation
        result.invoiceId = `RE-Time-${today}-${dailyOrders.length}`;
        
        // Then, update in database
        await strapi.services.order.update({ id: result.id }, {
            invoiceId: result.invoiceId
        });
    },
  },
};
