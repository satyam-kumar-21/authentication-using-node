const mongoose = require('mongoose');
const {Schema} = mongoose;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name:{
        type: String,
        required:[true, "Name is required"],
        minLength:[5,"Name must be 5 character"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"already registred"],
        lowercase:true
    },
    password:{
        type:String,
        select:false
    },
    forgetPasswordToken:{
        type:String
    },
    forgetPasswordExpiryDate:{
        type:Date
    },
    confirm_password:{
        type:String
    }
},{
    timestamps:true
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    return next();
})


userSchema.methods.jwtToken = function() {
    const token = jwt.sign(
      { id: this._id, email: this.email },
      process.env.SECRET_KEY || "asdfghjkl",
      { expiresIn: '24h' }
    );
    return token;
  };

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;