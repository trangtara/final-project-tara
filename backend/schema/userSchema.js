import mongoose from 'mongoose'
import crypto from 'crypto'

export const userSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
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