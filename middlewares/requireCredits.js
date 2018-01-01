module.exports = (req, res, next) => {
  if (req.user.credits < 1) {
    // status in 400 range indicates that the user did something wrong
    return res.status(403).send({ error: "You need more credits" });
  }

  next();
};
