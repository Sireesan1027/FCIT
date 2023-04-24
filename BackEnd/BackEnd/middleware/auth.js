const jwt = require('jsonwebtoken');
const User = require('../src/user/userModel');


const is_user = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.AUTH_SECRET);
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token,
        });


        if (!user) {
            throw new Error('Only user is allowed');
        }

        if (user.account_status === "terminated") {
            throw new Error('Terminated user account');
        }
        console.log("user auth")
        req.token = token;
        req.user = user;
        next();
    } catch (e) {

        res.status(401).send({error: e.message});
    }
};


const auth = {
   is_user
};
module.exports = auth;
