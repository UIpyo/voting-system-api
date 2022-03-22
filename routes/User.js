// only admin can access all users data otherwise you have to give the token
const router = require('express').Router();
const req = require('express/lib/request');
const hasAccess = require('../controller/hasAccess');
const User = require('../models/User');

router.get('/:userId', hasAccess, async (req,res) => {
    try{
        const user = await User.findById(req.param.userId);
        res.send(user);
    } //trim the doc "remove the password"
    catch(err) {
        res.send({"error" : err})
    }
})

// onlyUser can modify their own data not after they have been verified (when user.status == registered)
// hasAccess should handle the req.params.UserId == authorizationToken.Id || Admin
// pass the info as req.status == 'Self' || 'Admin' (Use something other than status)
// admin should be able to update the status => Put that in the code later

// ? -> is res.send is closing statement
router.put('/:userId', hasAccess, async (req,res) => {
    try{
        if(req.status != 'Self') return res.send({"error": "Only the user themselves can modify"});
        const user = await User.findById(req.params.userId);
        if(user.status !== 'registered') return res.send({"error" : "Data can't be modified anymore"})
        const doc = await User.findById(req.params.userId)
        const update = {
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,  //encrypt the password before saving
            dateOfBirth: req.body.dateOfBirth
        }

        const updatedDoc = await doc.updateOne(update);
        res.send({"updatedDoc" : updatedDoc})
    }
    catch(err) {
        res.send({"error": err})
    }
})

router.post('/', async (req,res) => {
    // send jwt token
    try{
        const level = () => {
            if(req.body.authLevel) return 'Candidate';
            return 'Voter'
        }
        const user = {
            name: req.body.name,
            dateOfBirth: req.body.dateOfBirth,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password, //encrypt the password before saving
            guardianName: {
                guardian: req.body.guardian,
                name: req.body.guardianName
            },
            aadharNumber: req.body.aadharNumber,
            authorityLevel: level
        }

        const newUser = new User(user);
        const doc = await newUser.save();
        res.send({"doc": doc})
    }
    catch(err) {
        res.send({"error": err})
    }
})
