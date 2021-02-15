import mongoose from 'mongoose'

export const attendantSchema = new mongoose.Schema ({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
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
  },
  created: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
		  ref: 'User'
    }
  },
  qrCode: {
    type: String
  },
  isEmailSent: {
    emailSent: {
      type: Boolean,
      default: false
    },
    sentTime: {
      type: Date,
      default: 0
    }
  },
  isComing: {
    isComing: {
      type: Boolean,
      default: false
    },
    confirmingTime: {
      type: Date,
      default: 0
    }
  },
  checkin: {
    checkinStatus:{
      type: Boolean,
      default: false
    },
    checkinOrCheckoutTime: {
      type: Date,
      default: 0
    }
  }
})