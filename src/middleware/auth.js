const jwt = require('jsonwebtoken');
const Users = require('../model/schema/userSchema');


const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        console.log(req.cookies);
        const verifyUser = jwt.verify(token , process.env.KEY)
        const UserData = await Users.findOne({ _id: verifyUser._id })
        console.log(UserData);
        req.token = token;
        req.UserData = UserData;
        if (UserData.isVerified)
            next();
        else {
            res.send({ status: 501, message: "Please register yourself before accessing APIs" })
        }
    }
    catch(err) {
        res.send({
            message:"Something went wrong"
        })
    }
}

module.exports = auth