

//  Middleware to Check if User is Logged In
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect("/login");
}

// Middleware to Check Edit Permissions
async function canEditUser(req, res, next) {
  const loggedInUser = req.session.user;

  // Admin can edit any user
  if (loggedInUser && loggedInUser.role === "admin") {
    return next();
  }

  // Normal user can only edit themselves
  if (loggedInUser && loggedInUser._id == req.params.id) {
    return next();
  }

  //  Otherwise, reject
  return res.status(403).send("Not Authorized");
}

// New middleware for delete
async function canDeleteUser(req, res, next) {
  const loggedInUser = req.session.user;

  // Admin can delete any user
  if (loggedInUser && loggedInUser.role === "admin") {
    return next();
  }

  // Normal user can only delete themselves
  if (loggedInUser && loggedInUser._id == req.params.id) {
    return next();
  }

  // Not authorized
  return res.status(403).send("Not Authorized");
}

module.exports = {
  isAuthenticated,
  canEditUser,canDeleteUser,
};
