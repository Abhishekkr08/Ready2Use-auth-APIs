require('../model/db/conn');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const userDB = require('../model/schema/userSchema.js');
const imageDB = require('../model/schema/imageSchema.js');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req , file , cb) => {
        cb(null, file.originalname);
    },
})
const upload = multer({
    storage : Storage
}).single('testimage')

const uploadImage = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.log(err); 
            }
            else {
                const newImage = new imageDB({
                    image: {
                        data: req.file.filename,
                        contentType:'image/png'
                   }
                }) 
                const imgUploaded = await newImage.save()
                console.log(imgUploaded)
                if (imgUploaded) {
                    res.status(200).send({
                        status: 200,
                        message: "Success",
                        img_id : imgUploaded._id
                    })
                }
            }
        })
    }
    catch {
        res.send({
            status: 501,
            message : 'failure'
        })
    }
}

const getImage = () => {
    
}

const homepage = (req, res) => {
    res.send({
        message: "Successfully Login , Welcome User"
    });
}

// mail sending process (details of sender)
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL_ID,
        pass: process.env.ADMIN_EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})
const signup = async (req, res) => {

    let { email, first_name, last_name, password, confirmPassword, age, city } = req.body;

    if (!email || !first_name || !password) {
        res.status(404).send({
            status: 404,
            message: "Empty fields",

        })
        console.log("User didnt filled imp fields")
    }

    else {
        if (password === confirmPassword) {
            const email_alreadyPresent = await userDB.findOne({ email: email }) // this will return a null if fails to find anything

            if (email_alreadyPresent && email === email_alreadyPresent.email) {
                res.status(501).send({
                    status: 501,
                    message: "Email already registered, try with new one"
                })
            }

            else {
                let newUser = new userDB({
                    email,
                    first_name,
                    last_name,
                    password,
                    age,
                    city,
                    emailToken: crypto.randomBytes(64).toString('hex'),
                    isVerified: false
                })

                let result = newUser.save()
                    .then(async (output) => {
                        console.log('Details of the Registered User --> ' + output);

                        // setting up mail content for sending verification email to user 
                        var mailOptions = {
                            from: ` "Abhishek Testing" <${process.env.ADMIN_EMAIL_ID}>`,
                            to: newUser.email,
                            cc: `${process.env.ADMIN_EMAIL_ID}`,
                            subject: 'Verify Your Email Address',
                            html: ` <h2> Hi ${newUser.first_name} 😄 <br> Thanks For Registration. </h2>
                                    <h2>Click below for verification</h2>
                                    http://${req.headers.host}/verify-email?token=${newUser.emailToken}`
                        }




                        //sending mail
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error)
                            }
                            else {
                                console.log('verification mail is sent to your gmail id');
                            }
                        })

                        const token = await newUser.generateAuthToken();
                        console.log('Token generated while register -->' + token);

                        res.cookie('jwt', token, {
                            expires: new Date(Date.now() + 600000),
                            httpOnly: true
                        })

                        // res.status(200).render('verifying-user', { msg: newUser.email })
                        res.status(200).send({
                            status: 200,
                            message: "Success",
                            token: token
                        })
                    }).catch((err) => {
                        console.log('ERROR CAUGHT WHILE SAVING USER IS --->' + err);
                        res.status(404).send({
                            status: 404,
                            message: "Something went wrong",

                        })
                    })
            }

        }

        else {
            res.status(401).send({
                status: 401,
                message: "enter same password again",
            })
        }

    }

}

const signin = async (req, res) => {
    try {
        let token = "";

        let { email, password } = req.body
        if (!email || !password) {
            res.status(401).send({ status: 401, message: "empty fields" });
        }
        else {
            const isUser_exist = await userDB.findOne({ email: email })

            if (isUser_exist.isVerified) {
                token = await isUser_exist.generateAuthToken();
                console.log('Token generated while sign in -->' + token);

                res.cookie('jwt', token, {
                    expires: new Date(Date.now() + 600000),
                    httpOnly: true
                })

                //final checking of login details
                if (email != null && email === isUser_exist.email && password === isUser_exist.password) {
                    console.log("Successfully signed in this is our genuine user");
                    res.status(200).send({
                        status: 200,
                        message: "Success",
                        token: token
                    })
                }
                else {
                    res.render('signin', { msg: "Wrong Password" });
                    console.log('wrong password forgot pw');
                }
            }
            else {
                res.status(401).send({ status: 401, message: "email id not verified" })
                console.log('users email id is not verified');
            }

        }
    }
    catch {
        res.status(401).send({
            status: 401,
            message: "Please register first"
        })
    }
}

const verifyEmail = async (req, res) => {
    try {
        const email_verif_token = req.query.token
        const email_verified_user = await userDB.findOne({ emailToken: email_verif_token })
        if (email_verified_user) {
            email_verified_user.emailToken = null
            email_verified_user.isVerified = true
            await email_verified_user.save()



            // generation of token after successfully verifying the email address
            const token = await email_verified_user.generateAuthToken();
            console.log('Token generated while register -->' + token);

            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true
            })

            res.status(200).send({ status: 200, message: "Email verified" })
        }
        else {
            res.render('signup', { msg: 'your email is not verified, Please try after again' });
            console.log('email is not verified')
        }
    }
    catch (err) {
        console.log(err);
        res.render('signin')
    }
}

const wrnURL = (req, res) => {
    res.send('<h1>This Page doesn\'t exist🚫</h1>');
}

module.exports = { uploadImage,homepage, signup, signin, verifyEmail, wrnURL };