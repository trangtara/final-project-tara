import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';


const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/finalProject';
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
mongoose.Promise = Promise;

const userSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 40
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    // minlength: 5
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex')
  }
})

userSchema.pre('save', async function (next) {
  const user = this;
  
  if (!user.isModified('password')) {
    return next();
  }
  const salt = bcrypt.genSaltSync();
  // console.log(`PRE- password before hash: ${user.password}`);
  user.password = bcrypt.hashSync(user.password, salt);
  // console.log(`PRE- password after  hash: ${user.password}`);
  next();
})

const authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.header('Authorization');
    const user = await User.findOne({ accessToken });
    if (!user) {
      throw 'User not found';
    }
    req.user = user;
    next();
  } catch (err) {
    const errorMessage = 'Please try loggin in again'
    console.log(errorMessage)
    res.status(401).json({ error: errorMessage })
  }
};

const User = mongoose.model('User', userSchema );

// const CheckinSchema = mongoose.Schema ({
//   checkin: {
//     type: Boolean,
//   },
//   checkinTime: {
//     type: Date,
//     default: Date.now
//   }
// })
const Attendant = mongoose.model('Attendant', {
  attendantName: {
    type: String,
    required: true
  },
  attendantEmail: {
    type: String,
    required: true,
    // unique: true
  },
  department: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  qrCode: {
    type: String
  },
  checkinStatus:{
    type: Boolean,
    default: false
  },
  checkinTime: {
    type: Date,
    default: 0
  }
  
  // checkin: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'CheckinSchema'
  // }
})
// console.log(mongoose.Schema.Types.ObjectId, "mongoose.Schema.Types.ObjectId")

//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const endPointList = require('express-list-endpoints');
const QRCode = require('qrcode')

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  if (!res) {
    res
      .status(404)
      .send({ error: 'Oops! Something goes wrong. Try again later!' });
  }
  res.send(endPointList(app));
});

// Const's for error messages instead of text in error handling
const SERVICE_UNAVAILABLE = 'Service unavailable.';

// Error message in case database is down
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next(); // To execute next get response
  } else {
    res.status(503).send({ error: SERVICE_UNAVAILABLE });
  }
});

// Signup a user
app.post('/api/signup', async (req, res) => {
  //what is the difference btw putting this const inside the try{}
  const { name, email, password } = req.body;
  console.log("REQBody", req.body)
  try {  
    const user = await new User({
      name,
      email,
      password
    }).save()
    console.log("newUser", user)
    res.status(201)
    .json({ userId: user._id, accessToken: user.accessToken })
  } catch (err) {
    console.log("ERROR", err)
    res
      .status(400)
      .json({ message: 'Could not create user', errors: err.errors });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({ userId: user._id, accessToken: user.accessToken })
    } else {
      res.status(404).json({
        notFound: true,
        message: 'Username and/or password is not correct'
      });
    }
  } catch (err) {
    res.status(404).json({
      notFound: true,
      message: 'Oops! Something goes wrong. Try again later!'
    });
  }
});

// attendant registration form
app.post('/api/users/:id/registration', authenticateUser);
app.post('/api/users/:id/registration', async (req, res) => {
  const { attendantName, attendantEmail, department } = req.body
try {
  const newAttendant = await new Attendant({
    attendantName,
    attendantEmail,
    department
  }).save(newAttendant)
  res.status(201).json(newAttendant)
  } catch (err) {
    res.status(400).json({message: 'Could not save new attendant', error: err.errors})
  }
})

app.get('/api/:attendantId/qrcode', async (req, res) => {
  const { attendantId } = req.params
  
  try {
    const attendant = await Attendant.findById(attendantId)

    if (attendant.errors) {
      res.status(404).json({message: 'Could not find any attendant that matches the information', error: error.message})
    }
    const url = `https://checkinapp.netlify.app/checkin/${attendantId}`
    // const url = `http://localhost://3000/checkin/${attendantId}`
    const qrCode = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H'
    })
    
    if(!qrCode) {
      throw new Error ('Could not generate qr code')
    }

    const updatedAttendant = await Attendant.updateOne({ _id: attendantId}, {$set: {qrCode: qrCode}})
    console.log("updatedAttendant", updatedAttendant)

    if (!updatedAttendant) {
      throw new Error ('Could not save qr code to the database')
    }
    res.status(201).json(qrCode)

    // if (!qrCode) {
    //   throw new Error('Could not generate qr');
    //   //res.status(404).json({message: 'Could not find any attendant that matches the information', error: err. errors})
    // }
      
    // console.log("qrCode", qrCode)
    
    // res.json(qrCode)
  } catch (err) {
    console.log(err, "ERROR")
    res.status(400).json({ message: err.message })
  }
})

app.get('/api/attendant/:attendantId', async (req, res) => {
  const { attendantId } = req.params
  const attendant = await Attendant.findById(attendantId);
  res.status(201).json(attendant);
})


app.post('/api/checkin/:attendantId', async (req, res) => {
  const { attendantId } = req.params
  console.log(attendantId, "attendantId")
  try {
    const checkin = await Attendant.findByIdAndUpdate({_id: attendantId }, 
      {
      checkinStatus: true,
      checkinTime: Date.now()
      },
      {upsert: true}, (err, results) => {
        if(err) {
          res.json ({ errorMessage: err})
        } else {
          res.json(results)
        }
      }
    )
  } catch (err) {
    res.json({ errorMessage: err.errors})
  }
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
