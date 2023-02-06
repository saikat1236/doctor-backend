// const mongoose = require("mongoose");
import mongoose from "mongoose";
import User from "../models/user.js";
import Doctor from "../models/doctor.js";
const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    productId: {
      type: String,
    },
    doctorId: {
      type: String,
    },
    date: {
      type: String,
    },

    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
