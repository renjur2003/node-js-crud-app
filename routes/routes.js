const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const fs = require('fs');
const e = require('express');
// image upload configuration
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "-" + file.originalname);
    }
});

var upload = multer({ storage: storage }).single("image");

// Insert a user into the database
router.post("/add", upload, async (req, res) => {
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
});

// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.render("index", { title: "Home page", users: users });
    } catch (err) {
        res.json({ message: err.message });
    }
});

// Add user form page
router.get("/add", (req, res) => {
    res.render("add_users", { title: "Add Users" });
});

// Edit user form page
router.get("/edit/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.redirect("/");
        }
        res.render("edit_users", { title: "Edit User", user: user });
    } catch (err) {
        console.error("Edit route error:", err.message);
        res.redirect("/");
    }
});

// Update user route
router.post("/update/:id", upload, async (req, res) => {
    let id = req.params.id;
    let new_image = '';

    if (req.file) {
        new_image = req.file.filename;

        // Delete old image
        try {
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } catch (err) {
            console.error("Could not delete old image:", err.message);
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
});


// Delete user route
router.get("/delete/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const result = await User.findByIdAndDelete(id);

        if (result && result.image) {
            try {
                fs.unlinkSync('./uploads/' + result.image); // Delete old image
            } catch (err) {
                console.error("Image delete error:", err);
            }
        }

        req.session.message = {
            type: "info",
            message: "User deleted successfully",
        };
        res.redirect("/");
    } catch (err) {
        console.error("Delete user error:", err);
        res.json({ message: err.message });
    }
});

module.exports = router;
