const express = require('express');
const ejs = require('ejs');
const app = express()

const loginAuth = require("../middlewares/loginAuth")
const EmailAuth = require("../middlewares/emailAuth")

const usercontroller = require("../controllers/usercontroller");

app.use(express.static("uploads"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.get('/', usercontroller.root)

app.route("/login").get(usercontroller.loginget)
    .post(usercontroller.loginpost)

app.route("/signup").get(usercontroller.signupget)
    .post(usercontroller.signuppost)

app.get("/home", loginAuth,/* EmailAuth */ usercontroller.homeget)

app.get("/load", loginAuth, usercontroller.load)

app.get("/verifymail/:token", loginAuth, usercontroller.verifymail)

app.get("/addtocart", loginAuth, usercontroller.addtocart)

app.get("/cart", loginAuth, usercontroller.cart)

app.get("/delete", loginAuth, usercontroller.cartdelete)

app.get("/pluscart", loginAuth, usercontroller.pluscart)

app.get("/minuscart", loginAuth, usercontroller.minuscart)

app.route("/changepass").get(loginAuth, usercontroller.changepassget)
    .post(loginAuth, usercontroller.changepasspost)

app.route('/forgetpass').get(loginAuth, usercontroller.forgetpassget)
    .post(loginAuth, usercontroller.forgetpasspost)

app.get('/logout', usercontroller.logout)

app.route("/order").get(/*loginAuth*/ usercontroller.orderpage)

app.route("/orderform").get(loginAuth, usercontroller.orderget)
    .post(usercontroller.orderpost)

app.route("/orderformx").post(usercontroller.orderpost)

app.get('/payment', usercontroller.payment)

app.get('/success', usercontroller.paymentdone)

app.get("*", function (req, res) {
    res.send("<h1>404 - Page Not Found</h1>");
})

module.exports = app;