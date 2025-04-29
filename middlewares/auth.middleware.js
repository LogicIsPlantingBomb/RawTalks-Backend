const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.authUser = async (req, res, next) => {
    try {
	console.log("Cookies:", req.cookies);
        console.log("Authorization Header:", req.headers.authorization);
        // Extract token from cookies or authorization header
        const token =
            req.cookies?.token || 
            (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token missing' });
        }
	const isBlacklisted = await blacklistTokenModel.findOne({token:token})
	
	if(isBlacklisted){
		return res.status(401).json({message:"Unautorized"});
	}
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
