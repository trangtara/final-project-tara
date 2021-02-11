import mongoose from 'mongoose'
import crypto from 'crypto'

export const userSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: true,
    minlenght: 2,
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
    minlength: 5
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex')
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})