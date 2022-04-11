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
    // resultDate: {
    //     type: Date,
    //     required: true
    // },
    // numberOfCandidate: {
    //     type: Number,
    //     required: true,
    //     default: 0
    // },
    candidates: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "users"
    },
    listClosed: {
        type: Boolean,
        required: true,
        default: false
    },
    electionDate: {
        type: Date,
        required: true
    },
    result: [{
            candidate: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'users'
            },
            count: Number,
            votePercentage: Number
    }],
    address: {
        type: String,
        required: true,
        unique: true
    }
    // voterCount: {
    //     type: Number,
    //     required: true,
    //     default: 0
    // }
})

module.exports = mongoose.model("elections", ElectionSchema);