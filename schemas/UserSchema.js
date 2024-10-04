const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true

    },
    creationDate: {
        type: Date,
        default: Date.now
    },mobile:{
        type:String,
        required:true
    }
})

const User = mongoose.model("User", userSchema);

module.exports = {
    User
}

// const mongoose=require('mongoose')
// const UserSchema=mongoose.Schema({
//   name:{type:String,required:true},
//   email: {
//     type: String,
//     required: true,
//     unique: true
// },
// password: {
//     type: String,
//     required: true

// },
// creationDate: {
//     type: Date,
//     default: Date.now
// }
// })

// module.exports=mongoose.model("User",UserSchema)