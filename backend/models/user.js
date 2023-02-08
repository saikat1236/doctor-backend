import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema(
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
    isAdmin: {
      type: Boolean,
      default: false,
    },

    familymembers: {
      type: Array,
      default: [],
    },

    notification: {
      type: Array,
      default: [],
    },

    upcomingbooking: {
      type: Array,
      doctorId: {
        type: String,
      },
      name: {
        type: String,
      },
      time: {
        type: String,
      },
      serial: {
        type: String,
      },
      price: {
        type: String,
      },
    },

    previousbooking: {
      type: Array,
      doctorId: {
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

    refer: {
      type: Number,
      default: Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000,
    },

    gender: {
      type: String,
      default: "male",
    },

    disease: {
      type: String,
      default: "",
    },

    location: String,
  },

  { timestamps: true }
);

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_SCRET_KEY,
    { expiresIn: "365d" }
  );
  return token;
};

const User = mongoose.model("User", userSchema);
export default User;
