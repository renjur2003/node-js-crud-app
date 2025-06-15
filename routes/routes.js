const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');

// image upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("image");

// Routes
router.get("/", userController.getAllUsers);
router.get("/add", userController.showAddForm);
router.post("/add", upload, userController.insertUser);
router.get("/edit/:id", userController.showEditForm);
router.post("/update/:id", upload, userController.updateUser);
router.get("/delete/:id", userController.deleteUser);

module.exports = router;
