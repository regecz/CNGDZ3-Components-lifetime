const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).send('Nem vagy bejelentkezve.');
    }
    next();
  };
  
  module.exports = authMiddleware;
  