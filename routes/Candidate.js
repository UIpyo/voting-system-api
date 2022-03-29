const router = require('express').Router();
const { isAuthenticated } = require('../controller/hasAccess');
const User = require('../models/User');

// /elections/:electionId/candidate {only approved}
// TODO: One enpoints need to be created to approve the candidates and the voters
router.route('/')
    .get(async (req,res) => {
        //this should first look at the electionId and retrives the ids and fill them here
    })
    .put(isAuthenticated, async (req,res) => {
        //TODO: Need to change the whole thing {should first retrieve the candidates application}
        //TODO: Use electionId to retieve the unapproved Ids and then approve them
        //TODO: Finalizing the approvalList closes the updation
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
