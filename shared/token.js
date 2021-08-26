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

module.exports = { getToken: getToken };
