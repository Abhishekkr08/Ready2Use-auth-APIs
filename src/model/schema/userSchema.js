const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    emailToken: {
        type : String
    },
    isVerified: {
        type:Boolean
    },
    age: {
        type: String,
    },
    city: {
        type: String
    }
})

// jwt web token generation 
Schema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({_id:this._id.toString()} , process.env.KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    }
    catch(err) {
        console.log(`caught error while generating token --> ${err}`);
        // res.send
    }
}




const userSchema = new mongoose.model('Users', Schema);
module.exports = userSchema;


