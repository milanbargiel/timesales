const Email = require('email-templates'); // For PDF creation
const pug = require('pug'); // template engine
const QRCode = require("qrcode-svg"); // For QR-Code generation
const dayjs = require('dayjs');

const toEur = (cents) => {
  return (cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
};

const renderMail = (order, response, templateFolder) => {
  const email = new Email();
  console.log(order)
  console.log(response)
  return email.renderAll(`../templates/${templateFolder}`, { order, response });
};

const createInvoice = async (order, response, templateFolder) => {
    // Create invoice html from variables
    const compiledFunction = pug.compileFile(`templates/${templateFolder}/html.pug`);

    // Convert price to integer for calculations
    // Todo: Make sure that value is already an integer when saved into database
    const timePrice = parseInt(response.timePrice)

    const qrcode = new QRCode({
      content: order.streamUrl,
      width: 200,
      height: 200,
      color: '#000000',
      background: '#ffffff',
      ecl: 'M',
    }).svg();

    const html = compiledFunction({
      createdAt: dayjs(order.created_at).format('DD MMMM, YYYY'), // Format creation date
      duration: strapi.services.response.time(response.timeAmount, response.timeUnit), // e.g. 1 second
      price: toEur(timePrice),
      tax: toEur(Math.round(timePrice * (7/100))), // always 7% tax vat
      priceTotal: toEur(Math.round(timePrice + (timePrice * (7/100)))), // price + tax
      qrcode,
      order,
      response
    });

    return html;
};

module.exports = {
  renderMail,
  createInvoice
};