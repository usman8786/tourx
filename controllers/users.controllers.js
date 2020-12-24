const usersController = {};
const Users = require("../models/users.model");
const Verification = require("../models/verification.model");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
var nodemailer = require("nodemailer");

usersController.registerUser = async (req, res) => {
  try {
    const body = req.body;
    const password = body.password;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    body.password = hash;
    const user = new Users(body);
    const result = await user.save();
    res.send({
      message: "Signup successful",
      userData: result,
    });
  } catch (ex) {
    if (ex.code === 11000) {
      res
        .send({
          message: "This email has been registered already",
        })
        .status(500);
    } else {
      res
        .send({
          message: "Error",
          detail: ex,
        })
        .status(500);
    }
  }
};
usersController.loginUser = async (req, res) => {
  try {
    const { userEmailPhone, password } = req.body;
    const result = await Users.findOne({
      $or: [
        {
          email: userEmailPhone,
        },
        {
          phone: userEmailPhone,
        },
        {
          userName: userEmailPhone,
        },
      ],
    }); 
    if (!result) {
      res.status(401).send({
        message: "This user does not exists. Please signup first",
      });
    }
     else if (result) {
      if (bcrypt.compareSync(password, result.password)) {
        result.password = undefined;
        const token = jsonwebtoken.sign(
          {
            data: result,
            role: "User",
          },
          "supersecretToken",
          { expiresIn: "7d" }
        );
        res.send({ 
          message: "Successfully Logged in", token: token 
        });
      } 
      else {
          res.status(401).send({ 
            message: "Wrong username or password" 
          });
      }
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};
usersController.updateUser = async (req, res) => {
  if (!req.params._id) {
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;
    let updates = req.body;
    runUpdate(_id, updates, res);
  } catch (error) {
    return res.status(500).send(error);
  }
};
async function runUpdate(_id, updates, res) {
  try {
    const result = await Users.updateOne(
      {
        _id: _id,
      },
      {
        $set: updates,
      },
      {
        upsert: true,
        runValidators: true,
      }
    );
    res.status(200).send({
      code: 200,
      message: "Updated Successfully",
    });
  } catch (error) {
    return res.status(500).send(error);
  }
}
usersController.forgetPasswordEmail = async (req, res) => {
  const userEmail = req.body.email;
  const message =
    "Please don't share this link with anyone! <br> <href>localhost:3000/users/reset_email";
  var transporter = nodemailer.createTransport({
    service: "gmail.com",
    auth: {
      user: "ebusiness.auth.verify@gmail.com",
      pass: "ebusiness@56",
    },
  });
  var mailOptions = {
    from: "ebusiness.auth.verify@gmail.com",
    to: userEmail,
    subject: "Rest Password",
    html: `${message}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send({
        message: "Email not sent",
        error: error,
      });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send({
        message: "Email sent",
        info: info,
      });
    }
  });
};
usersController.resetPassword = async (req, res) => {
  try {
    const _id = req.params._id;
    const updates = req.body;
    const updated = await Users.findOne({
      _id: _id,
    });
    const password = updates.password;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    updated.password = hash;
    const user = updated;
    const result = await user.save();

    res.status(200).send({
      code: 200,
      message: "Reset password successfully",
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
usersController.sendCodeToEmail = async (req, res) => {
  const userId = req.params._id
  const token = jsonwebtoken.sign({}, "SecretjwtKey", { expiresIn: "1d" });
  var random6DigitCode = Math.floor(100000 + Math.random() * 900000);
  const userEmail = req.body.email;
  var body = {
    token: token,
    verificationCode: random6DigitCode,
    userId: userId,
  };
  const verificationCode = new Verification(body);
    const code = await Verification.findOneAndDelete({ userId: userId });
    if (code) {
      const newCode = await verificationCode.save();
      await sendMessage(newCode.verificationCode, userEmail, userId, res);
    } else if (!code) {
      const new1Code = await verificationCode.save();
      await sendMessage(new1Code.verificationCode, userEmail, userId, res);
    };
};

async function sendMessage(random6DigitCode, userEmail, userId, res) {
  try {
    const message =
    `<h1>Please don't share this code with anyone!</h1><br><h4>${random6DigitCode}</h4><br><h1>Enter this code in your TripChala app to verify your email.</h1>`;
  var transporter = nodemailer.createTransport({
    service: "gmail.com",
    auth: {
      user: "ebusiness.auth.verify@gmail.com",
      pass: "ebusiness@56",
    },
  });
  var mailOptions = {
    from: "ebusiness.auth.verify@gmail.com",
    to: userEmail,
    subject: "Verify Your Email",
    html: `${message}`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send({
        message: "Email not sent",
        error: error,
      });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send({
        message: "Verification code has been sent to your email address.",
        id: userId,
      });
    }
  });
  } catch (error) {
    res.status(500).send({
      error: error,
    });
  }
};
module.exports = usersController;
