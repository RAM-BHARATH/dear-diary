// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     emailAddress: { type: String, required: true },
//     username: { type: String, required: true, minLength: 5 },
//     password: { type: String, required: true },
// })

// CategorySchema
// .virtual('url')
// .get(function(){
//     return '/diary/users/'+this._id;
// })

// module.exports = mongoose.model('User',userSchema);

const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    googleId: String,
    username: String,
    email: String
});

module.exports = mongoose.model('User', userSchema);