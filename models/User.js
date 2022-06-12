const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    info: {
        name: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
            // index: true
        },
        phoneNumber: {
            type: Number,
            required: true,
            unique: true
        },
        guardianName: {
            type: {
                guardian : {
                    type: String,
                    enum: ['FATHER','MOTHER'],
                    default: 'FATHER',
                    required: true
                },
                name: String
            },
            required: true
        },
        aadharNumber: {
            type: Number,
            length: 16,
            required: true,
            unique: true
        },
    },
    associatedElection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
        index: true
    },
    authLevel: {
        type: String,
        enum: ['voter', 'candidate', 'admin'],
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    //can be edited by an admin only
    approved: {
        type: Boolean,
        required: true,
        default: false
    },
    address: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model("users",UserSchema);