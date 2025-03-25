import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../model/user.model.js";
dotenv.config();

const Signup = async (req, res) => {
  // List  : check for empty variables , handle file upload , store all the fields in db return response
  try {
    // Getting User information from body
    let user = req.body;

    // Checking for name , email to not be empty
    if (user.name === "" || user.email === "") {
      return res.status(403).json({ message: "Empty Required Fields" });
    }

    // Checking if user email already exists
    const ExistingUser = await User.findOne({ email: user.email });
    if (ExistingUser) {
      return res.status(401).json({ message: "Email already Exists" });
    }

    // Adding image url to the user object
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Creating and saving user to database
    const userUser = await User({name : user.name, email: user.email, password: hashedPassword });
    await userUser.save();
    const newuser = {
      id: userUser.id,
      name: userUser.name,
      email: userUser.email,
    };
    const token = jwt.sign(newuser, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    res
      .status(201)
      .cookie("token", token, { maxAge: 36000000 })
      .json({
        message: "signup successful",
        userId : userUser.id,
      });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("Signup Error", error?.message);
  }
};

const Login = async (req, res) => {
  try {
    const body = req.body;

    if (!body || !body.email || !body.password) {
      return res.status(406).json({ message: "Empty required fields" });
    }

    const user = await User.findOne({ email: body.email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passCheck = await bcrypt.compare(body.password, user.password);

    if (!passCheck) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const newuser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      password: user.password,
      description: user.description,
    };
    const token = jwt.sign(newuser, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });

    res
      .status(200)
      .cookie("token", token, { maxAge: 36000000 })
      .json({
        message: "Login Successful",
        userId: user.id,
      });
  } catch (error) {
    console.log("Login Error", error?.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export { Signup, Login };
