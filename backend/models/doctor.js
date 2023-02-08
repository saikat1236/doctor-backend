import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const doctorSchema = mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      min: 2,
      max: 50,
    },

    email: {
      type: String,
      max: 50,
      index: true,
    },

    picturePath: {
      type: String,
      default: "",
    },

    isDoctor: {
      type: Boolean,
      default: true,
    },

    Reviews: {
      type: Array,
      comments: [
        {
          type: String,
          default: [],
        },
      ],
      ratings: [
        {
          type: Number,
          min: 1,
          max: 5,
        },
      ],
      default: [],
    },

    Specialist: {
      type: String,
      default: "",
    },

    stats: {
      type: Array,
      default: [],
    },

    Booking: {
      type: Array,
      userId: {
        type: String,
      },
      name: {
        type: String,
      },
      time: {
        type: String,
      },
      price: {
        type: String,
      },
    },

    TodayBooking: {
      type: Array,
      userId: {
        type: String,
      },
      name: {
        type: String,
      },
      time: {
        type: String,
      },
      price: {
        type: String,
      },
    },

    BookHistory: {
      type: Array,
      name: {
        type: String,
      },
      time: {
        type: String,
      },
    },

    online: {
      type: Boolean,
      default: true,
    },

    gender: {
      type: String,
      default: "male",
    },

    location: String,
  },

  { timestamps: true }
);

doctorSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isDoctor: this.isDoctor,
    },
    process.env.JWT_SCRET_KEY,
    { expiresIn: "365d" }
  );
  return token;
};

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
