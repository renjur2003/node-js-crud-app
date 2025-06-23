const Auth = require('../models/auth');

exports.registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;
   console.log("Form Data:", { username, email, password });
  try {
    const existUser = await Auth.findOne({ username });
    if (existUser) {
      req.session.message = { type: 'danger', message: 'User already exists' };
      return res.redirect('/register');
    }

    const user = new Auth({ username, email, password, role: role || 'user' }); // Default role to 'user' if not provided
     console.log(" Saving user to DB..."); //  log before saving
    await user.save();
     console.log(" User saved successfully!");

    req.session.message = { type: 'success', message: 'Registered Successfully' };
    res.redirect('/login');
  } catch (err) {
  console.error(" Register Error:", err.message);
  res.status(500).send('Server error: ' + err.message);
}
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Auth.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      req.session.message = { type: 'danger', message: 'Invalid credentials' };
      return res.redirect('/login');
    }

    req.session.user = user;
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Login failed');
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};
