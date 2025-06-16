const Auth = require('../models/auth');

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existUser = await Auth.findOne({ username });
    if (existUser) {
      req.session.message = { type: 'danger', message: 'User already exists' };
      return res.redirect('/register');
    }

    const user = new Auth({ username, password });
    await user.save();

    req.session.message = { type: 'success', message: 'Registered Successfully' };
    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Server error');
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
