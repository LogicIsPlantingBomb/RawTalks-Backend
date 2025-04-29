const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
	fullname:{
		firstname:{
			type: String,
			required: true,
			minlength:[2,'First name must be atleast 3 letters']},
		lastname:{
			type: String,
			minlength:[2,'Last name must be atleast 3 letters']},
	},
	email:{
		type:String,
		required:true,
		unique:true,
		minlength:[5,"Email must me more than 5 characters"]
	},
	password:{
		type: String,
		required: true,
		select: false
	},
	socketId:{
		type:String
	}
});
userSchema.methods.generateAuthToken = function() {
	const token = jwt.sign(
		{ _id: this._id },
		process.env.JWT_SECRET,
		{ expiresIn: '24h' }
	);
	return token;
};

userSchema.statics.hashPassword = async function (password){
	return await bcrypt.hash(password, 10);
};
userSchema.methods.comparePassword= async function(password){
	return await bcrypt.compare(password,this.password);
};


const User = mongoose.model('User',userSchema);
module.exports = User;
