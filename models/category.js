var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name:{ type: String, required: true, maxLength: 70 },
    description: { type: String, maxLength:1000 },
    userId: { type: Schema.Types.ObjectId, required: true, ref:'User' }
})

CategorySchema
.virtual('url')
.get(function(){
    return '/diary/category/'+this._id;
})

module.exports = mongoose.model('Category', CategorySchema);