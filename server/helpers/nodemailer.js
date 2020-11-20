const nodemailer = require("nodemailer");

module.exports = {
  sendNodeMail: async function (code, email) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "superdupertester2020@gmail.com", // generated ethereal user
        pass: "A2RgBaV25uMd6q5", // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"War Project" <superdupertester2020@gmail.com>', // sender address
      to: `${email}`, // list of receivers
      subject: "Verification Code", // Subject line
      text: "Your verification code", // plain text body
      html: `<p>Your warproject code: ${code}. Use this code to verify your account.</p>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  },
};
