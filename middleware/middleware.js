const protect =  async (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized user.'
    })
  }
  req.user = req.session.user;

  next();
};

module.exports = protect;
