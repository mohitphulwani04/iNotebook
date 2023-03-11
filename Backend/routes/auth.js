const express = require("express");
const User = require("../models/User");
const fetchuser = require('../middleware/fetchUser')
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'oye(lucky*2)oye';

// ROUTE 1:
// Create a user : POST "/api/auth/CreateUser", No login required
router.post(
  "/createUser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    // password must be at least 5 chars long
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // IF there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check whether the User with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ errors: "Sorry a user with this email alrady exists" });
      }
      const salt = await bcrypt.genSalt(10)
      const secPass = await bcrypt.hash(req.body.password,salt)

      // create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
         user:{
            id: user.id
         }
      }
      const authtoken = jwt.sign(data,JWT_SECRET);

      res.json({authtoken})
      

    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occurred");
    }
  }
);

// ROUTE 2:
// Authenticate a user usinng POST : "/api/auth/login", no login required all the time
router.post('/login',[
  body('email', 'Enter a valid email').isEmail(),
  body('password','password cannot be blank').exists(),
],async (req,res) => {

  // if there are errors , return bad request and the errors 
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array() });
  }

  //login user
  const {email, password} = req.body;
  try{
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({errors: ' please try to login with correct credentials' });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
      return res.status(400).json({errors: ' please try to login with correct credentials' });
    }

    const data = {
      user:{
         id: user.id
      }
   }
   const authtoken = jwt.sign(data,JWT_SECRET);

   res.json({authtoken})

  }catch (error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

// ROUTE 3:
// Get loggedin user details usig : POST "/api/auth/getuser", login required
router.post('/getuser',fetchuser, async(req, res)=>{
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error"); 
  }
})


module.exports = router;
