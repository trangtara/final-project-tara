import mongoose from 'mongoose'


export const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  startingDate: {
    type: Date,
  },
  endingDate: {
    type: Date,
  },
  place: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
})