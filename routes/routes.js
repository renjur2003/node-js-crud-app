const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const { isAuthenticated, canEditUser, canDeleteUser } = require('../middlewares/authMiddleware');

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
router.get("/", isAuthenticated, userController.getAllUsers);
router.get("/add", isAuthenticated, userController.showAddForm);
router.post("/add", isAuthenticated, upload, userController.insertUser);

//  Edit and Update now have BOTH isAuthenticated and canEditUser
router.get("/edit/:id", isAuthenticated, canEditUser, userController.showEditForm);
router.post("/update/:id", isAuthenticated, canEditUser, upload, userController.updateUser);

router.get("/delete/:id", isAuthenticated, canDeleteUser, userController.deleteUser);


module.exports = router;