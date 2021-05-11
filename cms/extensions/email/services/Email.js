const Email = require('email-templates');

const renderMail = (entry, templateFolder) => {
  const email = new Email();
  return email.renderAll(`../templates/${templateFolder}`, { entry });
};

module.exports = {
  renderMail
};