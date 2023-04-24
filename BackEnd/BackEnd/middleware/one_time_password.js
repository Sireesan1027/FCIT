const mongoose = require('mongoose');

const oneTimePasswordSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    expire_at: {
        type: Date,
        default: Date.now,
        expires: 600
    }
});

oneTimePasswordSchema.set('toObject', {virtuals: true});
oneTimePasswordSchema.set('toJSON', {virtuals: true});
// oneTimePasswordSchema.index({ expire_at: 1 }, { expireAfterSeconds: 86400 });

oneTimePasswordSchema.methods.generateOneTimePassword = async function () {
    const oneTimePassword = this;
    const password = Math.random().toString(36).substring(2, 16);
    oneTimePassword.password = password;
    await oneTimePassword.save();
    return password;
}

const OneTimePassword = mongoose.model('OneTimePassword', oneTimePasswordSchema);
module.exports = {
    oneTimePasswordSchema,
    OneTimePassword
}