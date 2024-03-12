const jwt = require("jsonwebtoken");
// exporting middleware---->>
module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(400).send({
      message: `Access denied , no token available`
    });
    jwt.verify(token, process.env.JWTPRIVATEKEY, (error, validToken) => {
      if (error) {
        return res.status(400).send({
          message: `Invalid Token`
        })
      }
      else {
        if (!validToken.isAdmin) {
          res.status(403).send({
            message:`You donnot have access to this content`
          })
        }
        req.user = validToken;
        // calling the next middle ware of the chain--->>>
        next();
      }
    })
  }
}