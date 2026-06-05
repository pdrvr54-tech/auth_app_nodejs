const crypto = require("crypto");

function generateSalt(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

function hashPassword(password, salt) {
  const hash = crypto
    .createHmac("sha512", salt)
    .update(password)
    .digest("hex");

  return { salt, hash };
}

function validatePassword(password, storedSalt, storedHash) {
  const { hash } = hashPassword(password, storedSalt);
  return hash === storedHash;
}

module.exports = { generateSalt, hashPassword, validatePassword };
