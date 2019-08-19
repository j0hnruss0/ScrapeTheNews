var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  title: String,
  body: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }

});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
