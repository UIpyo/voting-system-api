const router = require('express').Router();
const { isAuthenticated } = require('../controller/hasAccess');
const User = require('../models/User');
const Election = require('../models/Election');

// /elections/:electionId/candidate {only approved}
// TODO: One enpoints need to be created to approve the candidates and the voters
router.route('/')
    .get(isAuthenticated, async (req,res) => {
        //this should first look at the electionId and retrives the ids and fill them here
        //Bring the candidates with the electionId and show the approved list anyone other than the admin
        if(req.headers.auth && req.headers.authLevel==='admin') {
            const candidateList = await User.find({associatedElection: req.params.electionId}).select('info address');
            return res.send({"msg" : candidateList});
        } 
        //REVIEW: Use this or populate the candidateList of the Election {HANDLED}
        const candidateList = await User.find({associatedElection: req.params.electionId, approved: true}).select('info address');
        return res.send({"msg" : candidateList});

        //or
        // const candidateList = await Election.findById(req.params.electionId).populate({path: 'users',select: 'name address'});
        // return res.send({"msg" : candidateList});
    })
    //to approve the candidates
    .put(isAuthenticated, async (req,res) => {
        //TODO: Need to change the whole thing {should first retrieve the candidates application}
        //TODO: Use electionId to retieve the unapproved Ids and then approve them
        //TODO: Finalizing the approvalList closes the updation
        //REVIEW: I am not checking the electionIds before approving
        //REVIEW: I am assuming it is just handled that way
        
        if(!req.headers.auth || req.headers.authLevel!=='admin')
            return res.send({"msg" : "Only admins permitted"})
        try {
            const approvalListCandidate = req.body.approvalListCandidate;
            const doc = await User.updateMany({$in : approvalListCandidate},{$set : {approved : true}});
            return res.send({"msg": doc})
        } 
        catch(err) {
            return res.send({"error" : `Error caught when approving:: ${err}`})
        }
    })

    module.exports = router;
