const adminService = require('../sql_services/adminservice')
var sellerid
const adminloginget = (req, res) => {
    res.render("adminlogin", { msg: '' })
}

const adminloginpost = async (req, res) => {
    let { username, password } = req.body;
    let User = await adminService.LoginAdmin(username);
    if (User && User[0].is_admin) {
        const pass = password === User[0].password;
        if (pass && User[0].is_admin) {
            req.session.is_logged_in_admin = true;
            req.session.is_logged_in = true;
            req.session.userName = User[0].name;
            sellerid = User[0].id;
            res.redirect("/admin/home");
        } else {
            res.render("adminlogin", { msg: 'Password did not match!' })
        }
    } else {
        res.render("adminlogin", { msg: 'User cannot Access!!!' })
    }
}

const adminhome = async (req, res) => {
    if (req.session.is_logged_in_admin) {
        let products = await adminService.allproducts();
        res.render("adminhome", { user: req.session.userName, product: products });
    } else {
        res.redirect("/admin/");
    }
}

const productdelete = async (req, res) => {
    const { id } = req.query;
    await adminService.productdelete(id);
    res.redirect("/admin/home");
}

const update = async (req, res) => {
    const { id } = req.query;
    let { pname, pdetails, pprice, pquantity } = req.body;
    await adminService.productupdate(id, pname, pdetails, pprice, pquantity);
    res.redirect("/admin/home");
}

const addproductget = async (req, res) => {
    if (req.session.is_logged_in_admin) {
        res.render("addproduct", { user: req.session.userName })
    } else {
        res.redirect("/admin/");
    }
}

const addproductpost = async (req, res) => {
    var pimage = req.file.filename;
    console.log(pimage);
    let { pname, pdetails, pprice, pquantity } = req.body;
    //let products = await adminService.allproducts();
    //id = products.length + 1;
    await adminService.productadd(pname, pimage, pprice, pdetails, pquantity, sellerid);
    res.redirect("/admin/home")
}

const addsellerget = (req, res) => {
    if (req.session.is_logged_in_admin) {
        res.render("addseller", { user: req.session.userName })
    } else {
        res.redirect("/admin/");
    }
}

const addsellerpost = async (req, res) => {
    let { sname, semail, spass } = req.body;
    console.log(req.body)
    await adminService.addseller(sname, spass, semail);
    res.redirect("/admin/home");
}

module.exports = {
    adminloginget,
    adminloginpost,
    adminhome,
    productdelete,
    update,
    addproductget,
    addproductpost,
    addsellerget,
    addsellerpost,
}