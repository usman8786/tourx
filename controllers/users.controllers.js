const usersController = {};
const Users = require("../models/users.model");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

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
    const body = req.body;
    const email = body.email;
    // lets check if email exists
    const result = await Users.findOne({ email: email });
    if (!result) {
      // this means result is null
      res.status(401).send({
        message: "This user does not exists. Please signup first",
      });
    } else {
      // email did exist
      // so lets match password
      if (bcrypt.compareSync(body.password, result.password)) {
        // great, allow this user access
        result.password = undefined;
        const token = jsonwebtoken.sign(
          {
            data: result,
            role: "User",
          },
          "supersecretToken",
          { expiresIn: "7d" }
        );
        res.send({ message: "Successfully Logged in", token: token });
      } else {
        res.status(401).send({ message: "Wrong email or Password" });
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
    {
      if (result.nModified == 1) {
        res.status(200).send({
          code: 200,
          message: "Updated Successfully",
        });
      }
    }
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = usersController;
