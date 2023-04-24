const sendmail = require("../methods/sendmail");
const forget = require("../methods/forgetpass")
const userService = require('../sql_services/userservice');
const cartService = require('../sql_services/cartservice');
const jwt = require('jsonwebtoken');
const jwtKey = "ThisIsKey";

const root = (req, res) => {
    const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' },
    ];

    res.json({ uid: users });
}

const loginget = function (req, res) {
    res.render("login", { success: '' })
}
const loginpost = async function (req, res) {
    let { username, password } = req.body;
    let User = await userService.finduser(username);
    if (User[0]) {
        const pass = password === User[0].password;
        if (pass) {
            jwt.sign({ User }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    res.status(404).json({ auth: "something went wrong" })
                }
                res.status(200).json({ User, auth: token, msg: "its okay" })
            })
        } else {
            res.status(403).json({ msg: "Password did not match!" })
        }
    } else {
        res.status(403).json({ msg: "User do not have a account , please signup!!!" })
    }
}

const signupget = function (req, res) {
    res.render("signup", { err: "" })
}

const signuppost = async function (req, res) {
    let { username, password, email } = req.body;
    let User = await userService.finduser(username);
    if (User.length) {
        res.status(403).json({ msg: "That user already exisits!" })
    } else {
        // Insert the new user if they do not exist yet
        await userService.newuser(username, password, email);
        let User = await userService.finduser(username);
        sendmail(email, User[0].mailtoken, function (err, data) {
            res.json({ msg: "Account Created Suessfully" })
        })
    }
}

const homeget = async function (req, res) {
    let products = await userService.load5products(0);
    res.json({ pro: products.recordset });
}

const load = async (req, res) => {
    let c = parseInt(req.query.page) + 1;
    const offset = (c - 1) * 5;
    let products = await userService.load5products(offset);
    if (products.rowsAffected > 0)
        res.json({ pro: products.recordset, msg: "No More Products." });
    else {
        req.session.count = 1;
        res.json({ pro: products.recordset, msg: "No More Products." });
    }

}

const cart = async (req, res) => {
    let id = req.headers.authorization.split(" ")[2];
    let cart = await cartService.showcart(id);
    res.json({ cart: cart })

}

const addtocart = async (req, res) => {
    const { id } = req.query;
    let userid = req.headers.authorization.split(" ")[2];
    await cartService.addtocart(userid, id);
    res.status(200).json("OK");
    // if (req.session.count > 1)
    //     res.redirect("/load");
    // else
    //     res.redirect("/home");
}

const cartdelete = async (req, res) => {
    const { id } = req.query;
    let userid = req.headers.authorization.split(" ")[2];
    // await cartService.deletecart(userid, id);
    res.status(200).json("Delete from Cart");
}

const changepassget = (req, res) => {
    res.render("changepass", { msg: '' });
}

const changepasspost = async (req, res) => {
    let { currentpass, newpass, confirmpass } = req.body;
    let name = req.headers.authorization.split(" ")[2];
    let username = name.substring(1, name.length - 1);
    let User = await userService.finduser(username);
    if (User[0].password == currentpass) {
        if (newpass == confirmpass) {
            await userService.userupdate(currentpass, newpass);
            res.json({ msg: 'Password Updated' });
        }
        else {
            res.json({ msg: 'New Password and Confirm Password did not match!' });
        }
    }
    else {
        res.json({ msg: 'Invalid Current Password!' });
    }

}

const verifymail = async (req, res) => {
    const { token } = req.params;
    let User = await userService.findusermail(token);
    if (User) {
        User.isVerifed = true;
        req.session.isVerify = true;
        res.redirect("/home");
    }
    else {
        req.session.isVerify = false;
        res.redirect("/home");
    }
}

const minuscart = async (req, res) => {
    const { id } = req.body;

    let userid = req.headers.authorization.split(" ")[2];
    await cartService.minusquantity(userid, id);
    res.status(200).json("Minus by 1");
}

const pluscart = async (req, res) => {
    const { id } = req.query;

    let userid = req.headers.authorization.split(" ")[2];
    await cartService.plusquantity(userid, id);
    res.status(200).json("Plus by 1");
}

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

const orderpage = async (req, res) => {
    let id = req.headers.authorization.split(" ")[2];
    let order = await cartService.getmyorders(parseInt(id));
    res.json({ arr: order })
}

const orderget = (req, res) => {
    const { total } = req.query;
    req.session.amount = total;
    res.render("order", { user: req.session.userName });
}
const orderpost = async (req, res) => {
    req.session.address = req.body;
    //console.log(req.session.address);
    res.render("payment", { amount: req.session.amount });
}

const payment = (req, res) => {
    const RazorPay = require('razorpay');
    const razorpay = new RazorPay({
        key_id: 'rzp_test_ChPmU5xEZJWFc5',
        key_secret: '5wBPBQJW89hQKrhn3T0DhIGR',
    })
    let options = {
        amount: req.session.amount * 100,
        currency: "INR",
        receipt: "receipt#1",
    };
    razorpay.orders.create(options, (err, order) => {
        // console.log(order)
        console.log("this is order id -" + order.id)
        res.send({ oid: order.id });
    })
}

const paymentdone = async (req, res) => {
    let { house_no, area, state, zip } = req.session.address;
    let wholecart = await cartService.selectcart(parseInt(req.session.userid));
    let userid = parseInt(req.session.userid);
    for (let i = 0; i < wholecart.length; i++) {
        await cartService.placeorderandreducestock(userid, wholecart[i].prodID, wholecart[i].quantity, house_no, area, state, zip);
    }
    res.render("paymentdone");
}

const forgetpassget = (req, res) => {
    res.render("forpass", { err: '' });
}

const forgetpasspost = async (req, res) => {
    let { username, email } = req.body;
    let User = await userService.finduser(username);
    if (User) {
        const check = email === User[0].email;
        if (check) {
            forget(User[0].email, User[0].password, function (err, data) {
                console.log(err, data)
            });
            res.render("forpass", { err: "Mail has been send to your registered email. Kindly Login with your password" })
        } else {
            res.render("forpass", { err: "Email did not match!" })
        }
    } else {
        res.render("forpass", { err: "User do not have a account , please signup!!!" })
    }
}
module.exports = {
    root,
    loginget,
    loginpost,
    signupget,
    signuppost,
    homeget,
    cart,
    cartdelete,
    changepassget,
    changepasspost,
    addtocart,
    logout,
    minuscart,
    pluscart,
    verifymail,
    load,
    orderget,
    orderpost,
    orderpage,
    forgetpassget,
    forgetpasspost,
    payment,
    paymentdone,
}