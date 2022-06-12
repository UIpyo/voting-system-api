// only admin can access all users data otherwise you have to give the token
const router = require('express').Router();
const hasAccess = require('../controller/hasAccess');
const passwordHash = require('../controller/passwordHash');
const User = require('../models/User');
const admin = require('./Admin');

// onlyUser can modify their own data not after they have been verified (when user.status == registered)
// hasAccess should handle the req.params.UserId == authorizationToken.Id || Admin
// pass the info as req.status == 'Self' || 'Admin' (Use something other than status)
// admin should be able to update the status => Put that in the code later

// ? -> is res.send is closing statement
router.use('/admins',admin);

router.post('/', async (req,res) => {

    // should I use optional chaining '?.' here 
    let newUser = {
        info: {
            name: req.body.name,
            dateOfBirth: req.body?.dateOfBirth,
            email: req.body?.email,
            phoneNumber: req.body?.phoneNumber,
            guardianName: {
                guardian: req.body?.guardian,
                name: req.body?.guardianName
            },
            aadharNumber: req.body?.aadharNumber
        },
        address: req.body?.address,
        authLevel: req.body?.authLevel
    }

    try {
        if(newUser.authLevel === 'admin') throw 'Only an admin can create another admin';
        const hashedPassword = await passwordHash(req.body?.password)
        newUser.password = hashedPassword;
        const savedUser = new User(newUser);
        const doc = await savedUser.save();
        const token = hasAccess.generateToken({
            userId: doc._id,
            authLevel: doc.authLevel
        })
        return res.send({"msg": {"doc" : doc, "token" : token}});
    }
    catch(err){
        console.log(newUser);
        return res.status(400).send({"error" : `Error caught when posting user::${err}`})
    }
})

router.get('/', (req, res) => {
    return res.send({"msg":"this is /user"})
})

router.route('/:userId', hasAccess.isAuthenticated)
    .put(async (req,res) => {
        if(!req.headers.auth || req.headers.user!==req.params.userId){
            return res.send({"msg" : "Not authenticated or don't match your id"});
        }
        const {name, dateOfBirth, email, phoneNumber, guardian, guardianName, aadharNumber, address} = req.body;
            const update = {
                info :{
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
                address: address
            }
            try{
                const user = await User.findById(req.headers.user);
                if(user.approved) {
                    return res.send({"msg" : "Approved profiles can't edit"})
                }
                const updatedDoc = await user.updateOne(update);
                return res.send({"msg" : updatedDoc})
            }
            catch(err) {
                return res.send({"error" : `Error while updating::${err}`})
            }
    })
    .get(async (req,res) => {
        if(!req.headers.auth || req.headers.user!==req.params.userId) {
            return res.send({"error" : "Not yet authenticated"});
        }
        try{
            const user = await User.findById(req.headers.user,'-password');
            return res.send({"msg" : user});
        }
        catch(err) {
            return res.send({"error" : `Caught an error while bringing data::${err}`});
        }
    })

module.exports = router;