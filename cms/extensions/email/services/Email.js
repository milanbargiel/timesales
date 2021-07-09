const Email = require('email-templates'); // For PDF creation
const pug = require('pug'); // template engine
const dayjs = require('dayjs');
const timestring = require('timestring');

const toEur = (cents) => {
  return (cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
};

const renderMail = (order, response, templateFolder) => {
  const email = new Email();
  // Create extra fields for the success E-Mail
  const timeString = `${strapi.services.response.time(response.timeAmount, response.timeUnit)} of time for – ${response.timePurpose}`;
  return email.renderAll(`../templates/${templateFolder}`, { order, timeString });
};

const createInvoice = async (order, response, templateFolder) => {
    // Create invoice html from variables
    const compiledFunction = pug.compileFile(`templates/${templateFolder}/html.pug`);

    const html = compiledFunction({
      createdAt: dayjs(order.created_at).format('DD MMMM, YYYY'), // Format creation date
      duration: strapi.services.response.time(response.timeAmount, response.timeUnit), // e.g. 1 second
      price: toEur(response.timePrice),
      tax: toEur(response.timePrice * (7 / 100)), // always 7% tax vat
      priceTotal: toEur(response.timePrice + (response.timePrice * (7 / 100))), // price + tax
      order,
      response
    });

    return html;
};

module.exports = {
  renderMail,
  createInvoice
};