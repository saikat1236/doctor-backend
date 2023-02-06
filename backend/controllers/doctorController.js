import bcrypt from "bcrypt";
import _ from "lodash";
import otpGenerator from "otp-generator";
import dotenv from "dotenv";
import twilio from "twilio";

import Doctor from "../models/doctor.js";
import Otp from "../models/otpModel.js";
import { response } from "express";
dotenv.config();
export const signUp = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      number: req.body.number,
    });
    if (doctor) return res.status(200).send("Doctor Already Exits");
    const { number } = req.body;
    const OTP = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    // const number = req.body.number;
    console.log("This is OTP" + OTP);

    //  Sending message
    const accountSid = "ACcfd58c3afca5a02607db6a1603583a70";
    const authToken = "732b94d03dbeee86db255f9914f5355a";
    const client = twilio(accountSid, authToken);

    client.messages
      .create({
        body: `${OTP} is a one lime passord(OTP) to register into Medikas. Team Medikas`,
        from: "+13854817391",
        to: `+91${number}`,
      })
      .then((message) =>
        console.log(
          `${OTP} is a one lime passord(OTP) to register into Medikas. Team Medikas`
        )
      );

    const otp = new Otp({ number: number, otp: OTP });
    const salt = await bcrypt.genSalt(10);
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    return res.status(200).send("OTP send Successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const otpHolder = await Otp.find({
      number: req.body.number,
    });
    if (otpHolder.length === 0)
      return res.status(400).send("You use an expired OTP!");

    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validDoctor = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    if (rightOtpFind.number === req.body.number && validDoctor) {
      const doctor = new Doctor(_.pick(req.body, ["number"])); // Pick only Number.
      console.log(doctor);
      const token = doctor.generateJWT();
      const result = await doctor.save();
      const OTPDelete = await Otp.deleteMany({
        number: rightOtpFind.number,
      });
      return res.status(200).send({
        message: "Doctor Registration Successful !",
        token: token,
        data: result,
      });
    } else {
      return res.status(400).send("Your OTP was Wrong");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
