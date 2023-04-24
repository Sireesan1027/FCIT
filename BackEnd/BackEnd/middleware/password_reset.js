const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

passwordResetSchema.set('toObject', {virtuals: true});
passwordResetSchema.set('toJSON', {virtuals: true});
// passwordResetSchema.index({"expire_at": 1 }, { expireAfterSeconds: 120 } );

passwordResetSchema.methods.generateOneTimePassword = async function () {
    const passwordReset = this;
    const password = Math.random().toString(36).substring(2, 16);
    passwordReset.password = password;
    await passwordReset.save();
    return password;
}

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);
module.exports = {
    passwordResetSchema,
    PasswordReset
}