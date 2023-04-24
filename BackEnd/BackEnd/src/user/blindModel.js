const mongoose = require('mongoose');


const blind_schema = new mongoose.Schema({
    blind: {
        type: Object
    }
}, {
    timestamps: true
})

blind_schema.set('toObject', {virtuals: true});
blind_schema.set('toJSON', {virtuals: true});

blind_schema.methods.toJSON = function () {
    const blind = this;
    const blindObject = blind.toObject();

    return blindObject;
}


const Blind = mongoose.model("Blind", blind_schema);

module.exports = Blind;
