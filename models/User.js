const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    blockchainAddress: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ['registered','approved','rejected','voted']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
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
                enum: ['FATHER','MOTHER']
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
    password: {
        type: String,
        required: true
    },
    authorityLevel: {
        type: String,
        enum: ['Admin','Candidate','Voter'], //create another model for condidate
        required: true
    }
})

module.exports = mongoose.model("User",UserSchema);