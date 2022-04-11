const router = require('express').Router();
const { isAuthenticated } = require('../controller/hasAccess');
const passwordHash = require('../controller/passwordHash');
const User = require('../models/User');

//TODO: add route in the User.js
// /users/admins
router.route('/')
    .get(async (req,res) => {
        try{
            const admins = await User.find({authLevel: 'admin'}).select('name email');
            return res.send({"msg" : admins})
        }
        catch(err) {
            return res.send({"error" : `Error while retreiving admins::${err}`})
        }
    })
    .post(isAuthenticated, async (req,res) => {
        if(!req.headers.auth || req.headers.authLevel!=='admin')
            return res.send({"msg" : "Only admins permitted"})
        const {name, dateOfBirth, email, phoneNumber, guardian, guardianName, aadharNumber, address} = req.body;
        const newAdmin = {
            info: {
                name: name,
                dateOfBirth: dateOfBirth,
                email: email,
                phoneNumber: phoneNumber,
                guardianName: {
                    guardian: guardian,
                    name: guardianName
                },
                aadharNumber: aadharNumber
            },
            authLevel: 'admin',
            approved: true,
            address: address,
        }
        try{
            newAdmin.password = await passwordHash(req.body.password);
            const admin = new User(newAdmin);
            const doc = await admin.save();
            return res.send({"msg" : doc})
        }
        catch(err) {
            return res.send({"error" : `Error caught when adding an admin::${err}`})
        }
    })

router.route('/:adminId')
    .get(async (req,res) => {
        try{
            const doc = await User.findById(req.params.adminId);
            return res.send({"msg" : doc})
        }
        catch(err) {
            return res.send({"error" : `Error while fetching data::${err}`})
        }
    })
    .put(isAuthenticated, async (req,res) => {
        if(!req.headers.auth || req.auth.user!==req.params.adminId)
            return res.send({"msg" : "Only admin themselves can edit"})
        const {name, dateOfBirth, email, phoneNumber, address} = req.body;
        const update = {
            info: {
                name: name,
                dateOfBirth: dateOfBirth,
                email: email,
                phoneNumber: phoneNumber
            },
            address: address
        }
        try{
            const admin = await User.findById(req.params.adminId);
            const updatedDoc = await admin.updateOne(update);
            return res.send({"msg" : updatedDoc})
        }
        catch(err) {
            return res.send({"error" : `Error caught when updating:: ${err}`})
        }
    })

    module.exports = router;
