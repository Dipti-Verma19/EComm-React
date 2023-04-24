const sql = require('mssql');
const config = require("../configuation/connectDB");

sql.on('error', err => {
    console.log(err.message)
})

async function finduser(username) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`SELECT * FROM users where name = '${username}'`);
        console.log(result);
        sql.close();

        if (result.rowsAffected == 0)
            return result.rowsAffected;
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function newuser(username, password, email) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`INSERT INTO users (name, password, email, isVerifed, is_admin , is_seller) VALUES('${username}', '${password}', '${email}', 1, 0 ,0)`);
        sql.close();
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function allproducts() {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query('select * from products where is_deleted = 0');
        //console.log(result);
        sql.close();
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function findproduct(id) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`select * from products where id ='${id}'`);
        console.log(result);
        sql.close();
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function userupdate(currentpass, newpass) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`update users set password='${newpass}' where password='${currentpass}'`);
        console.log(result);
        sql.close();
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function findusermail(token) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`SELECT * FROM users where mailtoken = '${token}'`);
        console.log(result);
        sql.close();
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function load5products(offset) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`SELECT * FROM products order by id OFFSET ${offset} ROWS FETCH NEXT 5 ROWS ONLY`);
        //console.log(result);
        sql.close();
        return result;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}


module.exports = {
    finduser,
    allproducts,
    userupdate,
    findusermail,
    findproduct,
    newuser,
    load5products,

}
