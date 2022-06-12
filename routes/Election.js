const router = require('express').Router();
const { isAuthenticated } = require('../controller/hasAccess');
const Election = require('../models/Election');
const candidate = require('./Candidate');

// Create 'onlyAdmin' middleware later
// /elections/
router.route('/')
    .get(async (req,res) => {
        try{
            const electionList = await Election.find().select('name electionDate');
            return res.send({"msg" : electionList})
        }
        catch(err) {
            return res.send({"msg" : `Error found when getting info:: ${err}`})
        }
    })
    .post(isAuthenticated, async (req,res) => {
        if(!req.headers.auth || req.headers.authLevel!=='admin') {
            return res.send({"msg" : "Only admins permitted"})
        }
        const {name, level, electionDate, address} = req.body;

            //TODO: numberOfCandidates = candidates.length()
            //TODO: Candidates to be added through approval
        const electionInfo = {
            name: name,
            level: level,
            electionDate: electionDate,
            address: address
        }

        try{
            const newElectionInfo = new Election(electionInfo);
            const doc = await newElectionInfo.save();
            return res.send({"msg" : doc})
        }
        catch(err) {
            return res.send({"error" : `Error caught during posting election::${err}`})
        }
    })

router.use('/:electionId/candidates', candidate);


router.route('/:electionId')
    .get(async (req,res) => {
        try {
            const electionInfo = await Election.findById(req.params.electionId);
            return res.send({"msg" : electionInfo});
        }
        catch(err) {
            return res.send({"error" : `Caught error while recieving the data:: ${err}`});
        }
    })
    .put(isAuthenticated, async (req,res) => {
        if(!req.headers.auth || req.headers.authLevel!=='admin') 
            return res.send({"msg" : "Only admins permitted"})
        try {
            const electionInfo = await Election.findById(req.params.electionId);
            const date = new Date();
            if(date >= electionInfo.electionDate)
                return res.send({"msg" : "Can't update anymore"})
            const {name, level, electionDate, listClosed} = req.body;
            const updatedElectionInfo = {
                _id : electionInfo._id,
                name: (name ? name : electionInfo.name),
                level: (level ? level : electionInfo.level),
                electionDate: (electionDate ? electionDate : electionInfo.electionDate),
                listClosed : (listClosed ? listClosed : electionInfo.listClosed)
            }
            const doc = await electionInfo.updateOne(updatedElectionInfo);
            //TODO:check later if it returns the updated doc or not 
            return res.send({"msg" : doc})
        }
        catch(err) {
            return res.send({"error" : `Error caught when updating election::${err}`})
        }
    })

    module.exports = router;