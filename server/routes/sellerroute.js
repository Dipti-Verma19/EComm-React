const express = require('express')
const ejs = require('ejs');
const multer = require('multer');
const seller = express()
const upload = multer({ dest: 'uploads/' });

const sellercontroller = require("../controllers/sellercontroller");
const loginAuth = require("../middlewares/loginAuth")

seller.use(express.static("uploads"))
seller.use(express.urlencoded({ extended: true }));
seller.use(express.json());

seller.set("view engine", "ejs");
seller.set('views', "./views/seller")

seller.route("/").get(sellercontroller.sellerloginget)
    .post(sellercontroller.sellerloginpost)

seller.get("/home", loginAuth, sellercontroller.sellerhome)

seller.route("/addproduct").get(sellercontroller.saddproductget)
    .post(upload.single('pimage'), sellercontroller.saddproductpost)

seller.get("/delete", sellercontroller.sproductdelete)

seller.post("/update", sellercontroller.supdate)

seller.get("/orders", sellercontroller.sellerorderget)

module.exports = seller;