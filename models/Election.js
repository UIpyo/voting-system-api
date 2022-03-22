const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['local','panchayat','district','city','state','country'],
        required: true
    },
    resultDate: {
        type: Date,
        required: true
    },
    numberOfCandidate: {
        type: Number,
        required: true,
        default: 0
    },
    candidates: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
    },
    electionDate: {
        type: Date,
        required: true
    },
    votersApproved: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model("Election", ElectionSchema);