const mongoose = require('mongoose');


const other_schema = new mongoose.Schema({
    other: {
        type: Object
    }
}, {
    timestamps: true
})

other_schema.set('toObject', {virtuals: true});
other_schema.set('toJSON', {virtuals: true});

other_schema.methods.toJSON = function () {
    const other = this;
    const otherObject = other.toObject();

    return otherObject;
}


const Other = mongoose.model("Other", other_schema);

module.exports = Other;
