const User = require('../models/users');
const fs = require('fs');

// Handle insert user
exports.insertUser = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file.filename,
    });

    await user.save();

    req.session.message = {
      type: "success",
      message: "User added successfully",
    };

    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

// Handle get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render("index", { title: "Home page", users: users });
  } catch (err) {
    res.json({ message: err.message });
  }
};

// Show add form
exports.showAddForm = (req, res) => {
  res.render("add_users", { title: "Add Users" });
};

// Show edit form
exports.showEditForm = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.redirect("/");
    res.render("edit_users", { title: "Edit User", user: user });
  } catch (err) {
    console.error("Edit error:", err.message);
    res.redirect("/");
  }
};

// Update user
exports.updateUser = async (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync('./uploads/' + req.body.old_image);
    } catch (err) {
      console.error("Image delete error:", err.message);
    }
  } else {
    new_image = req.body.old_image;
  }

  try {
    await User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_image,
    });

    req.session.message = {
      type: "success",
      message: "User updated successfully",
    };

    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (result && result.image) {
      try {
        fs.unlinkSync('./uploads/' + result.image);
      } catch (err) {
        console.error("Delete image error:", err.message);
      }
    }

    req.session.message = {
      type: "info",
      message: "User deleted successfully",
    };

    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message });
  }
};
