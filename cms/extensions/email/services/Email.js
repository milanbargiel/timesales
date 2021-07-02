const Email = require('email-templates'); // For PDF creation
const pug = require('pug'); // template engine
const dayjs = require('dayjs');
const timestring = require('timestring');

const toEur = (cents) => {
  return (cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
};

const renderMail = (entry, templateFolder) => {
  const email = new Email();
  // Create extra fields for the success E-Mail
  const timeString = `${strapi.services.order.time(entry.timeAmount, entry.timeUnit)} of time for – ${entry.description}`;
  return email.renderAll(`../templates/${templateFolder}`, { entry, timeString });
};

const createInvoice = async (entry, templateFolder) => {
    // Create invoice html from variables
    const compiledFunction = pug.compileFile(`templates/${templateFolder}/html.pug`);

    const html = compiledFunction({
      createdAt: dayjs(entry.created_at).format('DD MMMM, YYYY'), // Format creation date
      duration: strapi.services.order.time(entry.timeAmount, entry.timeUnit), // e.g. 1 second
      price: toEur(entry.price),
      tax: toEur(entry.price * (entry.tax / 100)),
      priceTotal: toEur(entry.price + (entry.price * (entry.tax / 100))), // price + tax
      entry
    });

    return html;
};

module.exports = {
  renderMail,
  createInvoice
};