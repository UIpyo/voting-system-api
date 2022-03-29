//use jwt -> check authorization token -> if (admin, orSelf) give access


// jwt = {
//     authLevel: "Admin, Candidate, Voter, None",
//     userId: "id091uye0911"
// }

const jwt = require('jsonwebtoken');

const generateToken = payload => {
    return jwt.sign(payload, process.env.JWT_SECRET);
    // return token;
}

// handling error
const verifyToken = token => {
    return new Promise(jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=> {
        if(err) reject(err)
        resolve(decoded)
    }))
}

// const authorized = () => {}

const isAuthenticated = async (req, res, next) => {
    if(req.headers['authorization']) {
        const token = req.headers['authorization'].split(' ')[1];
        try{
            const decoded = await verifyToken(token);
            req.headers.auth = true;
            req.headers.user = decoded.userId;
            req.headers.authLevel = decoded.authLevel;
            next();
        }
        catch(err) {
            return res.send({"error" : `Error caught at verifying authentication::${err}`})
        }
    }
    req.headers.auth = false;
    return res.send({"error" : "No authentication token found"})
}

module.exports = {generateToken, isAuthenticated};