var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Entry = require('./entry')

var CategorySchema = new Schema({
    name:{ type: String, required: true, maxLength: 70 },
    description: { type: String, maxLength:200 },
    userId: { type: Schema.Types.ObjectId, required: true, ref:'User' }
})

CategorySchema
.virtual('url')
.get(function(){
    return '/diary/category/'+this._id;
})

// CategorySchema.pre('update', function(next){
//     // Category.update(
//     //     {},
//     //     { "$pull": { "category": this._id } }
//     // )
//     Entry.updateMany(
//         { },
//         {'$pull': { "category": this._id }},
//         { "multi": true },
//         next()
//     )
// })

module.exports = mongoose.model('Category', CategorySchema);