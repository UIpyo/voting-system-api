const bcrypt = require('bcrypt');
const saltRound = 15;

const passwordHash = input => {
    return new Promise(bcrypt.genSalt(saltRound, (err, salt) => {
        if(err) reject({"error" : `saltError::${err}`})
        bcrypt.hash(input, salt, (err, hash) => {
            if(err) reject({"error" : `hashError::${err}`})
            resolve(hash)
        })
    }))
}

module.exports = passwordHash