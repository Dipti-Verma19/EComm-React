const adminService = require('../sql_services/adminservice')

const sellerloginget = (req, res) => {
    res.render("sellerlogin", { msg: '' })
}

const sellerloginpost = async (req, res) => {
    let { username, password } = req.body;
    let User = await adminService.LoginAdmin(username);
    if (User && User[0].is_seller) {
        const pass = password === User[0].password;
        if (pass && User[0].is_seller) {
            req.session.is_logged_in = true;
            req.session.is_logged_in_seller = true;
            req.session.userName = User[0].name;
            req.session.sellerid = User[0].id;
            res.redirect("/seller/home");
        } else {
            res.render("sellerlogin", { msg: 'Password did not match!' })
        }
    } else {
        res.render("sellerlogin", { msg: 'User cannot Access!!!' })
    }
}

const sellerhome = async (req, res) => {
    if (req.session.is_logged_in_seller) {
        let products = await adminService.sellerproducts(parseInt(req.session.sellerid));
        res.render("sellerhome", { user: req.session.userName, product: products });
    } else {
        res.redirect("/seller/")
    }
}

const sproductdelete = async (req, res) => {
    const { id } = req.query;
    await adminService.productdelete(id);
    res.redirect("/seller/home");
}

const supdate = async (req, res) => {
    const { id } = req.query;
    let { pname, pdetails, pprice, pquantity } = req.body;
    await adminService.productupdate(id, pname, pdetails, pprice, pquantity);
    res.redirect("/seller/home");
}

const saddproductget = async (req, res) => {
    if (req.session.is_logged_in_seller) {
        res.render("addproduct", { user: req.session.userName })
    } else {
        res.redirect("/seller/")
    }
}

const saddproductpost = async (req, res) => {
    var pimage = req.file.filename;
    console.log(pimage);
    let { pname, pdetails, pprice, pquantity } = req.body;
    //let products = await adminService.allproducts();
    //id = products.length + 1;
    await adminService.productadd(pname, pimage, pprice, pdetails, pquantity, sellerid);
    res.redirect("/seller/home");
}

const sellerorderget = async (req, res) => {
    let order = await adminService.sellerorder(parseInt(req.session.sellerid));
    res.render("orders", { user: req.session.userName, order: order })
}

module.exports = {
    sellerloginget,
    sellerloginpost,
    sellerhome,
    sproductdelete,
    supdate,
    saddproductget,
    saddproductpost,
    sellerorderget,
}