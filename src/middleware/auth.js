const jwt = require('jsonwebtoken');
const Users = require('../model/schema/userSchema');


const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        const verifyUser = jwt.verify(token , process.env.KEY)
        // console.log(verifyUser);
        const UserData = await Users.findOne({ _id: verifyUser._id })
        // console.log(UserData);
        req.token = token;
        req.UserData = UserData;
        if(UserData.isVerified)
            next();
        else {
            res.send({
                message:"Please authenticate yourself before accessing homepage"
            })
        }

    }
    catch(err) {
        res.send({
            message:"Please authenticate yourself before accessing homepage"
        })
    }
}

module.exports = auth