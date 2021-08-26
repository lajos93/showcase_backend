const jwt = require("jsonwebtoken");
const secret = require("../shared/secret");

function getToken(email, id) {
  const token = jwt.sign(
    {
      email: email,
      id: id,
    },
    secret.value,
    {
      expiresIn: "1h",
    }
  );
  return token;
}

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, secret.value, (err, verifiedJwt) => {
      if (err) {
        res.json({ message: "Invalid token" });
      } else {
        // if verified
        next();
      }
    });
  } else {
    // Forbidden
    res.status(403).json({ message: "Authorization token is required" });
  }
}

module.exports = { getToken: getToken, verifyToken: verifyToken };
