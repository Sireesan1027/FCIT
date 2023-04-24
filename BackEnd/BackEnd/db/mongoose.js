const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
// mongoose.connect("mongodb+srv://Dilaxn:1234@main.cscur.mongodb.net/Thuva", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log('mongoDB connected successfully');
// }).catch((e) => {
//     console.log({message: 'something wrong connecting database server', error: e});
// });

mongoose.connect('mongodb://127.0.0.1:27017/sree', {

}).then(() => {
    console.log('mongoDB connected successfully');
}).catch((e) => {
    console.log('something wrong connecting database server,', e);
});



