const mongoose = require('mongoose');


const deaf_schema = new mongoose.Schema({
    deaf: {
        type: Object
    }
}, {
    timestamps: true
})

deaf_schema.set('toObject', {virtuals: true});
deaf_schema.set('toJSON', {virtuals: true});

deaf_schema.methods.toJSON = function () {
    const deaf = this;
    const deafObject = deaf.toObject();

    return deafObject;
}


const Deaf = mongoose.model("Deaf", deaf_schema);

module.exports = Deaf;
