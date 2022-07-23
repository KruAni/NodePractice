var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mailid',
    pass: 'your code'
  }
});

var mailOptions = {
  from: 'mailid',
  to: 'mailid',
  subject: 'Tried Sending Email using Node.js',
  text: 'Successfully completed! 😎'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});