const Email = require('email-templates');
// For PDF creation
const pug = require('pug'); // template engine
// For human readable dates and times
const dayjs = require('dayjs');
const humanizeDuration = require('humanize-duration');

const toEur = (cents) => {
  return (cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
};

const renderMail = (entry, templateFolder) => {
  const email = new Email();
  // Create extra fields for the success E-Mail
  const timeString = `${humanizeDuration(1000 * entry.time)} of time for – ${entry.description}`;
  return email.renderAll(`../templates/${templateFolder}`, { entry, timeString });
};

const createInvoice = async (entry, templateFolder) => {
    // Create invoice html from variables
    const compiledFunction = pug.compileFile(`templates/${templateFolder}/html.pug`);

    const html = compiledFunction({
      createdAt: dayjs(entry.created_at).format('DD MMMM, YYYY'), // Format creation date
      duration: humanizeDuration(1000 * entry.time),
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