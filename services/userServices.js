const userModel = require("../models/userModel");

module.exports.createUser = ({firstname,lastname,password,email})=>{
	if(!firstname || !password || !email){
		throw new error("All fields are required");
	}
	const user = userModel.create({
		fullname:{
			firstname,
			lastname
		},
		email,
		password
	});
	return user;
}
