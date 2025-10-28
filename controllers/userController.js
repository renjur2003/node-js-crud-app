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
      createdBy: req.session.user._id, // Use the logged-in user's ID
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
    res.render("index", {
      title: "Home page",
      users: users,
      user: req.session.user // ✅ Add this line
    });
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
   const userData = await User.findById(req.params.id);
if (!userData) return res.redirect("/");

//  New permission check
if (
  req.session.user.role !== "admin" && 
  userData.createdBy.toString() !== req.session.user._id.toString()
) {
  return res.status(403).send("Not Authorized");
}
res.render("edit_users", { title: "Edit User", user: userData });

  } catch (err) {
    console.error("Edit error:", err.message);
    res.redirect("/");
  }
};

// Update user
// ✅ UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Find user record
    const userData = await User.findById(id);
    if (!userData) return res.redirect("/");

    // ✅ Owner or Admin can edit
    if (
      req.session.user.role !== "admin" && 
      userData.createdBy.toString() !== req.session.user._id.toString()
    ) {
      return res.status(403).send("Not Authorized");
    }

    // Proceed with the update
    let new_image = req.body.old_image;

    if (req.file) {
      new_image = req.file.filename;
      try {
        fs.unlinkSync('./uploads/' + req.body.old_image);
      } catch (err) {
        console.error("Image delete error:", err.message);
      }
    }

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


// ✅ DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Find user record
    const userData = await User.findById(id);
    if (!userData) return res.redirect("/");

    // ✅ Owner or Admin can delete
    if (
      req.session.user.role !== "admin" && 
      userData.createdBy.toString() !== req.session.user._id.toString()
    ) {
      return res.status(403).send("Not Authorized");
    }

    // Proceed with delete
    await User.findByIdAndDelete(id);
    if (userData.image) {
      try {
        fs.unlinkSync('./uploads/' + userData.image);
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
