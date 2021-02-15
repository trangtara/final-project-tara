// //using mailgun
  // const auth = {
  //   auth: {
  //     api_key: process.env.api_key,
  //     domain: process.env.domain
  //   }
  // }
  // const nodemailerMailgun = nodemailer.createTransport(mg(auth))

  // const mailOptions = {
  //   from: process.env.SENDER_EMAIL,
  //   to: inviteeEmail,
  //   subject: 'testing email',
  //   text: 'hello developer',
  //   html: qrCodeEmailTemplate({ inviteeName, inviteeQrcode }),
  //   attachments: [{
  //     filename: 'image.png',
  //     path: inviteeQrcode,
  //     cid: inviteeQrcode
  //   }]
  // }
  // return nodemailerMailgun.sendMail(mailOptions)

  // //USING GMAIL
  // const transport = nodemailer.createTransport({
  //   service: process.env.SERVICE,
  //   auth: {
  //     user: process.env.SENDER_EMAIL_GMAIL,
  //     pass: process.env.SENDER_PASS
  //   }
  // })

  // const mailOptions = {
  //   from: process.env.SENDER_EMAIL_GMAIL,
  //   to: inviteeEmail,
  //   subject: 'testing email',
  //   text: 'hello developer',
  //   html: qrCodeEmailTemplate({ inviteeName, inviteeQrcode }),
  //   attachments: [{
  //     filename: 'image.png',
  //     path: inviteeQrcode,
  //     cid: inviteeQrcode
  //   }]
  // }
  // return transport.sendMail(mailOptions)