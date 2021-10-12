const sgMail = require("@sendgrid/mail");
async function sendMail(mailData) {
  const SENDGRID_API_KEY =
    "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";
  sgMail.setApiKey(SENDGRID_API_KEY);
  const msg = {
    to: mailData.email,
    from: "ayushtyagi@excellencetechnologies.in",
    subject: mailData.about,
    text: mailData.msg,
  };
  await sgMail.send(msg);
}
module.exports = sendMail;
