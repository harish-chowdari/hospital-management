const AdminSchema = require("../Models/AdminAuthModel.js.js");
const UserSchema = require("../Models/UserAuthModel.jsx");

async function AdminSigUp(req, res) {
  try {
    const { name, email, password } = req.body;

    const isUserExist = await AdminSchema.findOne({ email: email });

    if (isUserExist) { 
      return res.status(200).json({ AlreadyExist: "Account already exists" });
    }

    if (!name || !email || !password) {
      return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
    }

    const data = new AdminSchema({
      name,
      email,
      password,
      otp: "",
      otpExpiresAt: "",
    });

    const d = await data.save();
    return res.json(d);
  } catch (error) {
    console.log(error);
  }
}

async function AdminLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
    }

    const isUserExist = await AdminSchema.findOne({ email: email });
    if (!isUserExist) {
      return res.status(200).json({ NotExist: "User does not exist" });
    }

    if (password !== isUserExist.password) {
      return res.status(200).json({ Incorrect: "Incorrect password" });
    }

    return res.json(isUserExist);
  } catch (error) { 
    console.log(error);
  }
}


async function UserSigUp(req, res) {
  try {
    const { name, email, password } = req.body;

    const isUserExist = await UserSchema.findOne({ email: email });

    if (isUserExist) { 
      return res.status(200).json({ AlreadyExist: "Account already exists" });
    }

    if (!name || !email || !password) {
      return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
    }

    const data = new UserSchema({
      name,
      email,
      password,
      otp: "",
      otpExpiresAt: "",
    });

    const d = await data.save();
    return res.json(d);
  } catch (error) {
    console.log(error);
  }
}

async function UserLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
    }

    const isUserExist = await UserSchema.findOne({ email: email });
    if (!isUserExist) {
      return res.status(200).json({ NotExist: "User does not exist" });
    }

    if (password !== isUserExist.password) {
      return res.status(200).json({ Incorrect: "Incorrect password" });
    }

    return res.json(isUserExist);
  } catch (error) { 
    console.log(error);
  }
}

module.exports = {
  AdminSigUp,
  AdminLogin,
  UserSigUp,
  UserLogin
};
