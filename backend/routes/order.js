import Order from "../models/Order.js";
import User from "../models/user.js";
import Doctor from "../models/doctor.js";
import express from "express";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "./verifyToken.js";

const router = express.Router();

//CREATE

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();

    const user = await User.findById(savedOrder.userId);
    const doctor = await Doctor.findById(savedOrder.doctorId);

    // console.log(user);
    // console.log(doctor);
    const time = savedOrder.date;

    // let time = new Date(Date.parse(Stime, "dd-MM-yyyy"));

    let serialNo = 0;
    for (let booking of doctor.Booking) {
      if (booking.time === time) {
        serialNo++;
      }
    }

    let noti = "This is message";
    if (serialNo < 2) {
      User.findByIdAndUpdate(
        user._id,
        {
          $push: { notification: noti },
        },
        function (err, user) {
          user.notification.push(noti);
        }
      );
    }

    let Upcomingbooking = {
      doctorId: doctor._id,
      name: doctor.name,
      time: time,
      serial: 0,
    };

    if (serialNo < 2) {
      User.findByIdAndUpdate(
        user._id,
        {
          $push: { upcomingbooking: Upcomingbooking },
        },
        function (err, user) {
          user.upcomingbooking.push(Upcomingbooking);
        }
      );
    }

    let booking = {
      userId: user._id,
      name: user.name,
      time: time,
    };
    console.log("serialNo is  " + serialNo);
    if (serialNo < 2) {
      Doctor.findByIdAndUpdate(
        doctor._id,
        {
          $push: { Booking: booking },
        },
        function (err, doctor) {
          doctor.Booking.push(booking);
        }
      );
    }

    // let booking = {
    //   userId: user._id,
    //   name: user.name,
    //   date: time,
    // };

    // Doctor.findById(doctor._id, (err, doctor) => {
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     doctor.Booking.push(newBooking);
    //     doctor.save((err, updatedDoctor) => {
    //       if (err) {
    //         console.error(err);
    //       } else {
    //         console.log("New booking added to Doctor:", updatedDoctor);
    //       }
    //     });
    //   }
    // });

    // Doctor.findByIdAndUpdate(doctor._id, function (err, doctor) {
    //   if (err) {
    //     return handleError(err + " Firstline");
    //   }

    //   doctor.Booking.push(booking);

    //   doctor.validate(function (err) {
    //     if (err) {
    //       return handleError(err + " Secondline");
    //     }
    //     doctor.save(function (err) {
    //       if (err) {
    //         return handleError(err + " Thirdline");
    //       }
    //       // Handle successful booking
    //     });
    //   });
    // });

    // Doctor.findOne(
    //   doctor._id,
    //   { $push: { Booking: newBooking } },
    //   { new: true },
    //   (err, doctor) => {
    //     if (err) {
    //       console.error(err);
    //     } else {
    //       console.log("New booking added to Doctor:", doctor);
    //     }
    //   }
    // );

    if (serialNo < 2) {
      res.status(200).json(savedOrder);
    } else {
      res.status(401).json("Order not done");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
