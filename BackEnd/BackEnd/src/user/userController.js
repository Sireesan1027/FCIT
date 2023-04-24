const User = require('../user/userModel');
const nodemailer = require("nodemailer");
const {PasswordReset} = require("../../middleware/password_reset");

const {OneTimePassword} = require("../../middleware/one_time_password");
const sgMail = require('@sendgrid/mail');
const Blind = require("./blindModel");
const Deaf = require("./deafModel");
const Other = require("./otherModel");
sgMail.setApiKey(process.env.MAIL_KEY);

let otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'gmail',

    auth: {
        user: 'shanusasanu@gmail.com',
        pass: 'Shanu123416',
    }

});


// Create new user
const create_user = async (req, res) => {
    res.header( "Access-Control-Allow-Origin" );
    try {
        const user = new User(req.body);
        console.log("user", user)
        // if (req.file) {
        //     const result = await cloudinary.uploader.upload(req.file.path);
        //     user.profile_pic = result.secure_url;
        // }
        console.log("1")
        await user.save();
        console.log("2")
        const oneTimePassword = new OneTimePassword({
            user_id: user._id
        });

        const ot = await oneTimePassword.generateOneTimePassword();
        console.log("otp",ot)
        if (!ot) {
            res.status(201).send({user, email_status: false});
            return;
        }

        // send mail with defined transport object
        // const emailData = {
        //     from: process.env.FROM,
        //     to: req.body.email,
        //     subject: "Otp for doctor registration is: ",
        //     html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + ot + "</h1> " // html body
        //
        // };
        //
        // sgMail
        //     .send(emailData)
        //     .then(async sent => {
        //         return res.status(201).send(user._id);
        //
        //     })
        //     .catch(err => {
        //         console.log(err.message)
        //         return res.status(400).json({
        //             success: false
        //         });
        //     });
         res.status(201).send(user._id);
        return

    } catch (error) {
        console.log(error.message)
        if (error.message.includes('display_name')) {
            res.status(401).send("hello");
            return
        } else if (error.message.includes('mobile')) {
            res.status(402).send("mobile");
            return
        } else if (error.message.includes('email')) {
            res.status(403).send(error.message);
            return
        }
        console.log(error.message)
        res.status(400).send(error.message);
        return
    }
}

const verify = async (req, res) => {
    console.log(req.body.otp)

    const otpPass = await OneTimePassword.find({user_id: req.params.user_id});
    if (req.body.otp == otpPass[0].password) {

        const user = await User.findById(req.params.user_id);

        if (!user) {

            res.status(404).send({message: 'user not found'});

            return;
        }

        user['account_status'] = 'active';

        await user.save();

        res.status(201).send("You has been successfully registered");

    } else {
        res.status(400).send('otp is incorrect');
    }
}


const sendPasswordResetLinkUser = async (req, res) => {
    try {

        const user = await User.findOne({email: req.body.email})
        if (!user) {
            res.status(404).send("No users");
            return;
        }

        const passwordReset = new PasswordReset({
            user_id: user._id
        });

        const password = await passwordReset.generateOneTimePassword();

        const mailOptions_user = {
            to: req.body.email,
            subject: "Password reset for your account",
            html: "<h3>Your Account Password Reset Key is</h3>" + "<h1 style='font-weight:bold;'>" + password + ":" + passwordReset._id + "</h1>  <h3>Please enter above password as your reset Key  </h3>"  // html body
        };

        transporter.sendMail(mailOptions_user, (error, info) => {
            if (error) {
                res.status(400).send(error.message);
            }
            res.render('otp');
        });

        res.status(200).send({passwordResetId: passwordReset._id})

    } catch (e) {
        res.status(500).send(e);
    }

}

const resetUserPassword = async (req, res) => {

    try {
        console.log("resetUserPassword")
        if (!req.body.password1 || !req.body.password2) {
            res.status(400).send({message: 'Please enter passwords in both fields'});
        }
        console.log(req.params.password_reset_id)
        const passwordReset = await PasswordReset.findById(req.params.password_reset_id);
        console.log(passwordReset)
        if (!passwordReset) {
            res.status(400).send({message: 'not allowed'});
            return;
        }

        if (passwordReset.password !== req.params.otp) {
            res.status(400).send({message: 'Incorrect Key'});
            return
        }

        const user = await User.findById(passwordReset.user_id);
        if (!user) {

            res.status(400).send({message: 'not allowed'});
            return;
        }
        if (req.body.password1 !== req.body.password2) {
            res.status(400).send({message: 'Please enter Same password for both fields'});
        }

        user.password = req.body.password1;
        await user.save();
        res.status(200).send({message: 'password successfully changed'});
    } catch (e) {
        console.log(e.message)
        res.status(500).send(e);
    }
}


const get_user_id = async (req, res) => {

    try {

        const userId = await User.find({email:req.body.email}).select('_id');

        if (!userId) {
            res.status(400).send({message: 'Invalid mail'});
            return;
        }
        const user_id=userId[0].id
        console.log(user_id)
        res.status(200).send({user_id:user_id});
    } catch (e) {
        res.status(500).send(e);
    }
}


// user login
const user_login = async (req, res) => {
    try {
        console.log(req.body)
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        if (user.account_status === 'terminated') {
            throw new Error('Unable to login');
        }
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).send(e.message);
    }
}


const blind_data = async (req, res) => {

    console.log("fff")


        const blind = await Blind.find().select('-_id -__v -id');

        if (!blind) {

            res.status(404).send({message: 'blind not found'});

            return;
        }

let arr = []
    arr.push(blind[0])

        res.status(200).send({"blind":blind[0]});

}

const deaf_data = async (req, res) => {

    console.log("fff")


    const deaf = await Deaf.find().select('-_id -__v -id');

    if (!deaf) {

        res.status(404).send({message: 'deaf not found'});

        return;
    }

    let arr = []
    arr.push(deaf[0])

    res.status(200).send({"deaf":deaf[0]});

}
const other_data = async (req, res) => {

    console.log("fff")


    const other = await Other.find().select('-_id -__v -id');

    if (!other) {

        res.status(404).send({message: 'other not found'});

        return;
    }

    let arr = []
    arr.push(other[0])

    res.status(200).send({"other":other[0]});

}
module.exports = {
    create_user,
    verify,
    sendPasswordResetLinkUser,
    resetUserPassword,
    get_user_id,
    user_login,
    blind_data,
    deaf_data,
    other_data
}
