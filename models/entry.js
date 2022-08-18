var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//entry means diary entry

var EntrySchema = new Schema({
    entry_text: { type: String, required: true, maxLength:5000 },
    entry_title: { type: String, maxLength:100},
    entry_date_time: { type: Date },
    last_updated_time: {type: Date},
    category: [{ type: Schema.Types.ObjectId, ref: 'Category'}],
    year: Number,
});

EntrySchema
.virtual('url')
.get(function(){
    return '/diary/entry/'+this._id;
})

moduule.exports = mongoose.model('Entry', EntrySchema);