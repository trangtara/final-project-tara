import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { qrCodeEmailTemplate } from './emailTemplate'
import { userSchema } from './schema/userSchema'
import { attendantSchema } from './schema/attendantSchema'
import { eventSchema } from './schema/eventSchema'

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
require('dotenv').config()


app.use(cors())
app.use(bodyParser.json())

const SERVICE_UNAVAILABLE = 'Can not connect to database'

// Error message in case database is down
app.use((req, res, next) => {
  console.log('mongoose.connection', mongoose.connection);
  if (mongoose.connection.readyState === 1) {
    next() // To execute next get response
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
  // console.log(`PRE- password before hash: ${user.password}`)
  user.password = bcrypt.hashSync(user.password, salt)
  // console.log(`PRE- password after  hash: ${user.password}`)
  next()
})

const User = mongoose.model('User', userSchema )
const Attendant = mongoose.model('Attendant', attendantSchema)
const Event = mongoose.model('Event', eventSchema)

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
  //what is the difference btw putting this const inside the try{}
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

// attendant registration form
app.post('/api/registration', authenticateUser)
app.post('/api/registration', async (req, res) => {
  const { attendantName, attendantEmail, department } = req.body
  
  try {
    const newAttendant = await new Attendant({
      attendantName,
      attendantEmail,
      department,
      created: {createdBy: req.user._id}
    }).save(newAttendant)

    if (newAttendant) {
      const url = `http://icheckin.netlify.app/checkin/${newAttendant._id}`

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
    //this catch err is for: missing input, or input does not meet the validation
    res.status(400).json({ errorMessage: err.message })
  }
})


// app.get('api/attendants', authenticateUser)
app.get('/api/attendants', async (req, res) => {
  try {
    const allAttendants = await Attendant.find().sort({'created.createdAt': 'desc'})
    res.status(200).json(allAttendants)

  } catch (err) {
    //Test again the senario that errors can happen
    res.status(400).json({ errorMessage: err.errors})
  }
  
})

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
      //What does the err.message come from???
      errorMessage: err.message
    })
  }
})

// app.post('api/checkin/:attendantId', authenticateUser)
app.post('/api/checkin', async (req, res) => {
  const { attendantId } = req.body
  console.log(req.body, "req.body")

  try {
    //is there a better way to avoid duplicate the "find" function???
    const attendant = await Attendant.findById(attendantId)
    const checkinStatus = attendant.checkin.checkinStatus

    if(checkinStatus) {
      throw new Error('Attendant already checkin')
    }
    const updatedCheckin = await Attendant.findByIdAndUpdate(attendantId, 
      {
        checkin: {
          checkinStatus: true,
          checkinTime: Date.now()
        }
      }, 
      {new: true}, (err) => {
      if(err) {
        console.log(err, "What error is here")
        //either attendantId does not follow moongose format or attendantId is wrong, the error is the same. How to differentiate different error

        //replace res.status(404).json({errorMessage: err.message}) with "throw" to test stream reading
        throw new Error('Could not checkin. Make sure attendantId is correct')
      }
      res.status(200).json(updatedCheckin)
    })
  } catch (err) {
    console.log('/api/checkin', err)
    res.status(400).json({ errorMessage: err.message})
  }
})

// app.post('/api/sendqrcode', authenticateUser)
app.post('/api/sendqrcode', async(req, res) => {
  const { attendantId } = req.body

  try {
    const attendant = await Attendant.findById(attendantId)
    const alreadySentQrcode = attendant.isEmailSent.emailSent

    if (alreadySentQrcode) {
      throw new Error('Email already sent to this attendant')
    }

    const inviteeEmail = attendant.attendantEmail
    const inviteeName = attendant.attendantName
    const inviteeQrcode = attendant.qrCode
  
    const emailResults = await emailQrcode({ inviteeEmail, inviteeName, inviteeQrcode })

    if(!emailResults) {
      throw new Error('Could not send email')
    }

    const updateSendQrCode = await Attendant.findByIdAndUpdate(attendantId, 
      { isEmailSent: {
        emailSent: true,
        sentTime: Date.now()
      }
    },
      {new: true}, (err, results) => {
        if(err) {
          return res.status(404).json({ errorMessage: 'Could not update emailSent status'})
        } else {
          res.status(200).json(results)
        }
      })

  } catch (err) {
    res.status(400).json({
      errorMessage: err.message
    })
  }
})

function emailQrcode({ inviteeEmail, inviteeName, inviteeQrcode }) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SER,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS,
    }
  })

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: inviteeEmail,
    subject: 'testing email',
    text: 'hello developer',
    html: qrCodeEmailTemplate({ inviteeName, inviteeQrcode }),
    attachments: [{
      filename: 'image.png',
      height: '200px',
      width: '200px',
      path: inviteeQrcode,
      cid: inviteeQrcode //same cid value as in the html img src
    }]
  }
  return transporter.sendMail(mailOptions)
}

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
