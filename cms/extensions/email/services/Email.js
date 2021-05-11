const Email = require('email-templates');
// For PDF creation
const pug = require('pug'); // template engine
const puppeteer = require('puppeteer'); // headless chrome as npm module

const renderMail = (entry, templateFolder) => {
  const email = new Email();
  return email.renderAll(`../templates/${templateFolder}`, { entry });
};

const createInvoice = async (entry, templateFolder) => {
    // Create invoice
    const compiledFunction = pug.compileFile(`templates/${templateFolder}/html.pug`);

    // launch a new chrome instance
    const browser = await puppeteer.launch({
      headless: true
    });

    // create a new page
    const page = await browser.newPage();

    // set your html as the pages content
    const html = compiledFunction();
    
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