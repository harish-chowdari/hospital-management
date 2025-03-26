const AdminSchema = require("../Models/AdminAuthModel.js.js");
const UserSchema = require("../Models/UserAuthModel.jsx");

async function AdminSigUp(req, res) {
  try {
    const { name, doctorType, email, password } = req.body;

    const isUserExist = await AdminSchema.findOne({ email: email });

    if (isUserExist) { 
      return res.status(200).json({ AlreadyExist: "Account already exists" });
    }

    if (!name || !doctorType || !email || !password) {
      return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
    }

    const data = new AdminSchema({
      name,
      doctorType,
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


const getAdminDetails = async (req, res) => {
  try {
    const data = await AdminSchema.find({}, { doctorType: 1, _id: 1 });
    const adminDetails = data.map(item => ({
      adminId: item._id,
      doctorType: item.doctorType
    }));
    return res.json(adminDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch admin details" });
  }
};


const getAdminDetailsById = async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = await AdminSchema.findById(adminId).lean();
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};


const getAdminsByDoctorType = async (req, res) => {
  try {
    const { doctorType } = req.params;
    const admins = await AdminSchema.find({ doctorType }).lean();
    res.json(admins);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};



async function updateAvailability(req, res) {
  try {
    const { adminId } = req.params;
    const {  weeklyAvailability } = req.body;
    // if (!adminId || !weeklyAvailability) {
    //   return res.status(400).json({ error: "Missing adminId or weeklyAvailability" });
    // }
    const admin = await AdminSchema.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    admin.weeklyAvailability = weeklyAvailability;
    await admin.save();
    return res.json({ success: true, admin });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
}



// -------------------------------------------------- user --------------------------------------------


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
  getAdminDetails,
  getAdminDetailsById,
  getAdminsByDoctorType,
  updateAvailability,
  UserSigUp,
  UserLogin
};
