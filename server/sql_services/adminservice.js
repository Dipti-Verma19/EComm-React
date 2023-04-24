const sql = require('mssql');
const config = require("../configuation/connectDB");

sql.on('error', err => {
    console.log(err.message)
})

async function LoginAdmin(username) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`SELECT * FROM users where name = '${username}'`);
        console.log(result);
        sql.close();
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function allproducts() {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query('select * from products where is_deleted = 0;');
        //console.log(result);
        sql.close();
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function productupdate(id, pname, pdetails, pprice, pquantity) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`update products set name = '${pname}',price = '${pprice}', details = '${pdetails}', stock = '${pquantity}' where id = ${id};`);
        console.log(result);
        sql.close();
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function productadd(pname, pimage, pprice, pdetails, pquantity, sellerid) {
    try {
        //console.log(pimage);
        let pool = await sql.connect(config)
        let result = await pool.request().query(`INSERT INTO products (name, image, price , details, stock, is_deleted ,sellerid ) VALUES('${pname}', '${pimage}' ,'${pprice}','${pdetails}', '${pquantity}', 0 , '${sellerid}')`);
        console.log(result);
        sql.close();
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function productdelete(id) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`update products set is_deleted = 1 where id = ${id};`);
        console.log(result);
        sql.close();
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function addseller(sname, spass, semail) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`INSERT INTO users (name, password, email, isVerifed, is_admin , is_seller) VALUES('${sname}', '${spass}', '${semail}', 1, 0 , 1)`);
        console.log(result);
        sql.close();
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function sellerproducts(sellerid) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`select * from products where is_deleted = 0 and sellerid = '${sellerid}';`);
        //console.log(result);
        sql.close();
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function sellerorder(sellerid) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`select myorder.* , products.*  , users.name as username
        from myorder 
        inner join products on myorder.pid = products.id
        inner join users on myorder.userid = users.id
        where products.sellerid = '${sellerid}'`);
        //console.log(result);
        sql.close();
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

module.exports = {
    LoginAdmin,
    allproducts,
    productupdate,
    productadd,
    productdelete,
    addseller,
    sellerproducts,
    sellerorder,
}