const asyncHandler = require("express-async-handler"); //It HANDLES all the errors automatically
const User = require("../modals/userModal");
const jwttoken = require("../config/jwt");

const  registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic, phone, gender, howHeard, city, state } = req.body;
  if (!name || !email ) {
    res.status(400);
    throw new Error("Please enter the required inputs !");
  }
 
  const Existing = await User.findOne({ email });
  if (Existing) {
    res.status(400);
    throw new Error("User already exists!");
  }
  const newUser = await User.create({
    name,
    email,
    password,
    pic,
    phone,
    gender,
    howHeard,
    city,
    state,
  });

  if (newUser) {
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email:newUser.email,
      password: newUser.password,
      phone: newUser.phone,
      city:newUser.city,
      state:newUser.state,
      howHeard:newUser.howHeard,
      pic: newUser.pic,
      token: jwttoken(newUser.id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create a new account");
  }
});
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter the required inputs !");
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      password: user.password,
      email: user.email,
      pic: user.pic,
      phone: user.phone,
      city:user.city,
      state:user.state,
      howHeard:user.howHeard,
      token: jwttoken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to Login account");
  }
});
const allData = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {}; //like params is for accessing the web parameters , querry is for accessing querry in the web parameters like api/user/?search = chetan

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); // Give all users excpet the current user
  res.send(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(userId);

    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
const editUser = asyncHandler(async (req, res) => {
  const userId = req.params.id; 
  const updatedUserData = req.body; 
  console.log(userId)
  try {
    // Check if the user with the given ID exists
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    existingUser.name = updatedUserData.name || existingUser.name;
    existingUser.email = updatedUserData.email || existingUser.email;
    existingUser.phone = updatedUserData.phone || existingUser.phone;
    existingUser.gender = updatedUserData.gender || existingUser.gender;
    existingUser.city = updatedUserData.city || existingUser.city;
    existingUser.state = updatedUserData.state || existingUser.state;

    
    await existingUser.save();

    // Respond with success message
    res.status(200).json({ message: 'User data updated successfully', user: existingUser });
  } catch (error) {
    console.error('Error during user update:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

module.exports = { registerUser, authUser, allData , deleteUser ,editUser};

