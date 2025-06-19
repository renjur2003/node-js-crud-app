// function requireAuth(req, res, next) {
//   if (!req.session.userId) {
//     return res.redirect('/login');
//   }
//   next();
// }

// module.exports = requireAuth;

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
}

module.exports = isAuthenticated;
