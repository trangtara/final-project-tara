import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { Base64 } from 'js-base64'

import { qrCodeEmailTemplate } from './emailTemplate'
import { userSchema } from './schema/userSchema'
import { attendantSchema } from './schema/attendantSchema'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/finalProject'
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
mongoose.Promise = Promise

//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const endPointList = require('express-list-endpoints')
const QRCode = require('qrcode')
const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')
const sgMail = require('@sendgrid/mail')
require('dotenv').config()


app.use(cors())
app.use(bodyParser.json())

const SERVICE_UNAVAILABLE = 'Can not connect to database'

// Error message in case database is down
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next() 
  } else {
    res.status(503).send({ error: SERVICE_UNAVAILABLE })
  }
})

const authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.header('Authorization')
    const user = await User.findOne({ accessToken })
    if (!user) {
      throw 'User not found'
    }
    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ message: 'Please try loggin again', errors: err.errors })
  }
}
userSchema.pre('save', async function (next) {
  const user = this
  if (!user.isModified('password')) {
    return next()
  }
  const salt = bcrypt.genSaltSync()
  user.password = bcrypt.hashSync(user.password, salt)
  next()
})

const User = mongoose.model('User', userSchema )
const Attendant = mongoose.model('Attendant', attendantSchema)

//display all the endpoints
app.get('/', (req, res) => {
  if (!res) {
    res
      .status(404)
      .send({ error: 'Oops! Something goes wrong. Try again later!' })
  }
  res.send(endPointList(app))
})

// Signup a user
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body
  try {  
    const user = await new User({
      name,
      email,
      password
    }).save()
    res.status(201)
    .json({ userId: user._id, accessToken: user.accessToken })
  } catch (err) {
    res
      .status(400)
      .json({ errorMessage: 'Could not create user', errors: err.errors })
  }
})

// Login user
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({ userId: user._id, accessToken: user.accessToken })
    } else {
      res.status(400).json({
        notFound: true,
        message: 'Username and/or password is not correct'
      })
    }
  } catch (err) {
    res.status(404).json({
      notFound: true,
      errorMessage: 'Oops! Something goes wrong. Try again later!'
    })
  }
})

// register new attendant and generate qrcode
app.post('/api/registration', authenticateUser)
app.post('/api/registration', async (req, res) => {
  const { attendantName, attendantEmail, department } = req.body
  try {
    const attendant = await Attendant.findOne({ attendantEmail })
    if (attendant) {
      throw new Error('Could not save attendant. Email already exists')
    }

    const newAttendant = await new Attendant({
      attendantName,
      attendantEmail,
      department,
      created: {createdBy: req.user._id}
    }).save(newAttendant)

    if (!newAttendant) {
      throw new Error ('Could not save attendants')
    } else {
      const url = `https://icheckin.netlify.app/checkin/${newAttendant._id}`
      // const url = `http://localhost:8080/api/checkin/${newAttendant._id}`

      const qrCode = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H'
      })

      if(!qrCode) {
        throw new Error('Could not generate qr code')
      }

      const updatedAttendant = await Attendant.findByIdAndUpdate(
        newAttendant._id,
        { qrCode: qrCode },
        { new: true }
      )

      if (!updatedAttendant) {
        throw new Error ('Could not save qr code to the database')
      }

      res.status(201).json(updatedAttendant)
    }
  } catch (err) {
    res.status(400).json({ errorMessage: err.message })
  }
})

//get all attendants created by one logged in user
app.get('/api/attendants', authenticateUser)
app.get('/api/attendants', async (req, res) => {

  try {
    const allAttendants = await Attendant.find({'created.createdBy': req.user._id}).sort({'created.createdAt': 'desc'})
    res.status(200).json(allAttendants)

  } catch (err) {
    res.status(400).json({ errorMessage: err.errors})
  }
  
})

//fetch one attendant
// app.get('/api/attendant/:attendantId', authenticateUser)
app.get('/api/attendant/:attendantId', async (req, res) => {
  const { attendantId } = req.params
  try {
    const attendant = await Attendant.findById(attendantId, (err) => {
      if (err) {
        res.status(404).json({
          errorMessage: 'Please make sure attendantId has 12 bytes following moongoose format'
        })
      }
    })

    if (!attendant) {
      throw new Error('Could not find the attendant. Make sure attendantId is correct')
    }
    res.status(200).json(attendant)

  } catch (err) {
    res.status(404).json({ 
      errorMessage: err.message
    })
  }
})

//check in /checkout attendant
app.post('/api/checkin', authenticateUser)
app.post('/api/checkin', async (req, res) => {
  const { attendantId } = req.body

  try {
    const attendant = await Attendant.findById(attendantId)
    const checkinStatus = attendant.checkin.checkinStatus
    const checkinOrCheckOut = !checkinStatus
    const checkinOrCheckoutTime = Date.now()

    if(!attendant) {
      throw new Error('Could not find the attendant')
    }

    attendant.checkin.checkinStatus = checkinOrCheckOut
    attendant.checkin.checkinOrCheckoutTime = checkinOrCheckoutTime

    await attendant.save().then((savedAttendant) => savedAttendant === attendant)
    
    res.status(200).json(attendant)

  } catch (err) {
    res.status(400).json({ errorMessage: err.message})
  }
})

//send qrcode to attendant's email
app.post('/api/sendqrcode', authenticateUser)
app.post('/api/sendqrcode', async(req, res) => {
  const { attendantId } = req.body
  try {
    const attendant = await Attendant.findById(attendantId)

    const inviteeEmail = attendant.attendantEmail
    const inviteeName = attendant.attendantName
    const inviteeQrcode = attendant.qrCode
    const inviteeId = attendant._id

    await emailQrcode({ inviteeEmail, inviteeName, inviteeQrcode, inviteeId })

    const updateSendQrCode = await Attendant.findByIdAndUpdate(attendantId, 
      {isEmailSent: {
            emailSent: true,
            sentTime: Date.now()
          }
      }, 
      {new: true}, (err) => {
        if(err) {
          throw new Error ('Could not update emailSent status')
      }}
    )
    
    res.status(200).json(updateSendQrCode)

  } catch (err) {
    res.status(400).json({
      errorMessage: err.message
    })
  }
})

//Email qrcode to attendant using Sendgrid
function emailQrcode({ inviteeEmail, inviteeName, inviteeQrcode, inviteeId }) {

  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  const theQrCode = inviteeQrcode.replace('data:image/png;base64,', '');

  const mailOptions = {
    from: { 'email': process.env.SENDGRID_SENDER_EMAIL, 'name': 'tara' },
    to: inviteeEmail,
    subject: 'testing email',
    text: 'hello developer',
    html: qrCodeEmailTemplate({ inviteeName, inviteeQrcode, inviteeId }),
    attachments: [{
      filename:     'image.png',          
      contentType:  'image/png',
      cid:          'theqrcode',
      content:      theQrCode
    }]
  }
  return sgMail.send(mailOptions).then(() => {}, error => {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
      throw new Error('NOPE')
    }
  });

}

//attendants to confirm their participation to the event
app.post('/api/confirmation/:attendantId', async(req, res) => {
  const {isComing } = req.body
  const { attendantId } = req.params
  try {
    const attendant = await Attendant.findByIdAndUpdate(attendantId, {
      isComing: {
        isComing: isComing,
        confirmingTime: Date.now()
      }
    }, (err) => {
      if(err) {
        throw new Error('Could not update the attendant')
      }
    })
    res.status(200).json(attendant)
  } catch(err) {
    res.status(404).json({ errorMessage: err.message})
  }
})

//remove attendants from the database
app.post('/api/delete', authenticateUser)
app.post('/api/delete', async (req, res) => {
  const { attendantId } = req.body
  try {
    const deletedAttendant = await Attendant.findByIdAndDelete( attendantId)
    if (!deletedAttendant) {
      throw new Error("Could not delete attendant")
    }
    res.status(200).json(deletedAttendant)
  } catch (err) {
    res.status(404).json({ errorMessage: err.message})
  }
})

  

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
