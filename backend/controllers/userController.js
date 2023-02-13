import bcrypt from "bcrypt";
import _ from "lodash";
import otpGenerator from "otp-generator";
import dotenv from "dotenv";
import twilio from "twilio";

import User from "../models/user.js";
import { response } from "express";
dotenv.config();
export const signUp = async (req, res) => {
  try {
    const user = await User({
      name: req.body.name,
      email: req.body.email,
      picturePath: req.body.picturePath,
      password: req.body.password,
      gender: req.body.gender,
    });

    // if (user) return res.status(200).send("user Exits");
    const newUser = await user.save();
    res.status(200).json(newUser);

    // const { number } = req.body;
    // const OTP = otpGenerator.generate(4, {
    //   digits: true,
    //   lowerCaseAlphabets: false,
    //   upperCaseAlphabets: false,
    //   specialChars: false,
    // });
    // // const number = req.body.number;
    // console.log("This is OTP" + OTP);

    //  Sending message
    // const accountSid = "ACcfd58c3afca5a02607db6a1603583a70";
    // const authToken = "732b94d03dbeee86db255f9914f5355a";
    // const client = twilio(accountSid, authToken);

    // client.messages
    //   .create({
    //     body: `${OTP} is a one lime passord(OTP) to register into Medikas. Team Medikas`,
    //     from: "+13854817391",
    //     to: `+91${number}`,
    //   })
    //   .then((message) =>
    //     console.log(
    //       `${OTP} is a one lime passord(OTP) to register into Medikas. Team Medikas`
    //     )
    //   );

    // const otp = new Otp({ number: number, otp: OTP });
    // const salt = await bcrypt.genSalt(10);
    // otp.otp = await bcrypt.hash(otp.otp, salt);
    // const result = await otp.save();
    // return res.status(200).send(OTP);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) res.status(200).send(user);
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    // if (otpHolder.length === 0)
    //   return res.status(400).send("You use an expired OTP!");

    // const rightOtpFind = otpHolder[otpHolder.length - 1];
    // const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    // if (rightOtpFind.number === req.body.number && validUser) {
    //   const user = new User(_.pick(req.body, ["number"])); // Pick only Number.
    //   console.log(user);
    //   const token = user.generateJWT();
    //   const result = await user.save();
    //   const OTPDelete = await Otp.deleteMany({
    //     number: rightOtpFind.number,
    //   });
    //   return res.status(200).send({
    //     message: "User Registration Successful !",
    //     token: token,
    //     data: result,
    //   });
    // } else {
    //   return res.status(400).send("Your OTP was Wrong");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
