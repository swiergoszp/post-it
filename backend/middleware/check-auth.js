const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secret_this_string_needs_to_be_super_long_aka_gigantic');
    req.userData = { email: decodedToken.email, userId:decodedToken.userId };
    console.log('check auth is good');
    next();
  } catch(error) {
    res.status(401).json({ message: 'You are not authenticted'});
  }
};
