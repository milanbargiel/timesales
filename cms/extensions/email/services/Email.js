const Email = require('email-templates');
// For PDF creation
const pug = require('pug'); // template engine
const puppeteer = require('puppeteer'); // headless chrome
// For human readable dates and times
const dayjs = require('dayjs');
const humanizeDuration = require('humanize-duration');

const renderMail = (entry, templateFolder) => {
  const email = new Email();
  return email.renderAll(`../templates/${templateFolder}`, { entry });
};

const createInvoice = async (entry, templateFolder) => {
    // Create invoice
    const compiledFunction = pug.compileFile(`templates/${templateFolder}/html.pug`);

    // Render html with variables
    const html = compiledFunction({
      createdAt: dayjs(entry.created_at).format('DD MMMM, YYYY'), // Format creation date
      duration: humanizeDuration(1000 * entry.time),
      price: (entry.price / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }),
      invoiceId: 'RE-Time-2020-10-10-01', // Placeholder until legal issues are solved
      entry
    });

    // launch a new chrome instance
    const browser = await puppeteer.launch({
      headless: true
    });

    // create a new page
    const page = await browser.newPage();
    
    await page.setContent(html, {
      waitUntil: 'domcontentloaded'
    });

    // create a pdf buffer
    const pdfBuffer = await page.pdf({
      format: 'A4'
    });

    // close the browser
    await browser.close();

    return pdfBuffer;
};

module.exports = {
  renderMail,
  createInvoice
};