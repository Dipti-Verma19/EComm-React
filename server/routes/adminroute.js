const express = require('express')
const ejs = require('ejs');
const multer = require('multer');
const admin = express()
const upload = multer({ dest: 'uploads/' });

const admincontroller = require("../controllers/admincontroller");
const loginAuth = require("../middlewares/loginAuth")

admin.use(express.static("uploads"))
admin.use(express.urlencoded({ extended: true }));
admin.use(express.json());

admin.route("/").get(admincontroller.adminloginget)
    .post(admincontroller.adminloginpost)

admin.get("/home", loginAuth, admincontroller.adminhome)

admin.route("/addproduct").get(admincontroller.addproductget)
    .post(upload.single('pimage'), admincontroller.addproductpost)

admin.get("/delete", admincontroller.productdelete)

admin.post("/update", admincontroller.update)

admin.route("/addseller").get(admincontroller.addsellerget)
    .post(admincontroller.addsellerpost)

module.exports = admin;