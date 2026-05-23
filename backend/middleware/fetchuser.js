const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'inotebook_local_secret';

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not defined. fetchuser will use a local fallback secret.');
}

const fetchuser = (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) {
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = fetchuser;