const bcrypt = require('bcrypt');
const saltRound = 15;

// const passwordHash = input => {
//     return new Promise(bcrypt.genSalt(saltRound, (err, salt) => {
//         if(err) reject({"error" : `saltError::${err}`})
//         bcrypt.hash(input, salt, (err, hash) => {
//             if(err) reject({"error" : `hashError::${err}`})
//             resolve(hash)
//         })
//     }))
// }

const passwordHash = async input => {
    if(!input) return {"error" : "NO input given for password"}
    try{
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(input, salt);
        return hash;
    }
    catch(err) {
        return {"error" :  `hashError::${err}`}
    }
}

module.exports = passwordHash