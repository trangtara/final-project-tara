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
  console.log(`PRE-password before hash: ${user.password}`)
  user.password = bcrypt.hashSync(user.password, salt);
  console.log(`PRE-password after hash: ${user.password}`)
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

const Attendant = mongoose.model('Attendant', {
  attendantName: {
    type: String,
    required: true
  },
  attendantEmail: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String
  }
})

//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const endPointList = require('express-list-endpoints');

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
  try {
    const { name, email, password } = req.body;
    const user = await new User({
      name,
      email,
      password
    }).save();
    res.status(201)
    .json({ userId: user._id, accessToken: user.accessToken })
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Could not create user', errors: err.errors });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(201).json({ userId: user._id, accessToken: user.accessToken });
      console.log("accessToken-backend", accessToken)
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
  const { attendantName, department, attendantEmail } = req.body
  try {
    const newAttendant = await new Attendant ({
      attendantName,
      department,
      attendantEmail
    }).save()
    res.status(201).json(newAttendant)
  } catch (err) {
    res.status(400).json({message: 'Could not save new attendant', error: err.errors})
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
