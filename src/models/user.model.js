const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
        lowercase: true, // Store email in lowercase
        trim: true // Remove whitespace from both ends
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum length for password
        select: false // Exclude password from queries by default
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the creation date
    },
    updatedAt: {
        type: Date,
        default: Date.now // Automatically set the update date
    },
    verified:{
        type: String,
        default: "normal",
        enum: ["normal", "silver", "golden"]
    },
    restiriction: {
        type: Boolean,
        default: false
    }
    

})

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = UserModel;