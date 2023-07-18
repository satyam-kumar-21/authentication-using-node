const userModel = require("../model/userSchema");
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

const signup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log(name, email, password, confirmPassword);

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Every feild must required'
    })
  }

  const validEmail = emailValidator.validate(email);
  if (!validEmail) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email'
    })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Password and confirm password does not match'
    })
  }

  try {
    const userInfo = new userModel.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.email,
      confirm_password: req.body.confirm_password
    });

    console.log(userInfo);
    const result = await userInfo.save();

    return res.status(200).redirect("login",{
      success: true,
      data: result
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Account already created'
      })
    }
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Every feild must required"
    })
  }

  try {
    const user = await userModel
      .findOne({
        email
      })
      .select('+password')

    if (!email || !(await bcrypt.compare(password,user.password))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid details'
      })
    }
    const token = user.jwtToken();
    user.password = undefined;
    cookieOption = {
      maxAge: 24 * 60 * 60 * 100,
      httpOnly: true
    };
    res.cookie("token", token, cookieOption);
    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

const getUser = async (req, res, next) =>{
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId);

    return res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    return res.status(200).json({
      success: false,
      data: error.message
    })
  }
}

const logout = (req,res)=>{
  try {
    const cookieOption = {
      expires : new Date(),
      httpOnly:true
    };
    res.cookie("token",null,cookieOption);
    res.status(200).json({
      success:true,
      message:"user logout"
    })
  } catch (error) {
    res.status(400).json({
      success:false,
      message: error.message
    })
  }
}

module.exports = {
  signup,
  signin,
  getUser,
  logout
};
