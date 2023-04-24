const sql = require('mssql');
const config = require("../configuation/connectDB");

sql.on('error', err => {
    console.log(err.message)
})

async function addtocart(userid, id) {
    try {
        let pool = await sql.connect(config)
        await pool.request().query(`INSERT INTO cart (userID , prodID, quantity) Values ( '${userid}' , '${id}' , 1)`);
        sql.close();

    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function selectcart(userid) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`select * from cart where userID = '${userid}'`);
        console.log(result);
        sql.close();
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function deletecart(userid, id) {
    try {
        let pool = await sql.connect(config)
        await pool.request().query(`delete from cart where userID = '${userid}' and prodID = '${id}'`);
        sql.close();
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function showcart(userid) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`select cart.userID,cart.quantity,products.* from cart inner join products on cart.prodID = products.id where cart.userID = '${userid}';`);
        console.log(result);
        sql.close();
        return result.recordset;
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function plusquantity(userid, id) {
    try {
        console.log(userid, id);
        let pool = await sql.connect(config)
        let result = await pool.request().query(`update cart set quantity = quantity + 1 where userID = '${userid}' AND prodID = ${id}`);
        console.log(result);
        sql.close();

    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function minusquantity(userid, id) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`update cart set quantity = quantity - 1 where userID = '${userid}' AND prodID = ${id}`);
        console.log(result)

        sql.close();

    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function placeorderandreducestock(userid, pid, quan, house_no, area, state, zip) {
    try {
        let pool = await sql.connect(config)
        await pool.request().query(`INSERT INTO myorder (userid, pid, quantity, house_no, area, _state, zip) VALUES('${userid}', '${pid}', '${quan}' , '${house_no}', '${area}' , '${state}', '${zip}');
        update products set stock = stock - '${quan}' where id = ${pid};
        delete from cart where userID = '${userid}' and prodID = '${pid}';
        `);

        sql.close();
    }
    catch (err) {
        console.log('Error in Query :', err.message)
        sql.close();
    }
}

async function getmyorders(userid) {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query(`select myorder.*,products.name, products.image ,products.price, products.details from myorder inner join products on myorder.pid = products.id where myorder.userID = '${userid}';`);
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
    addtocart,
    deletecart,
    showcart,
    plusquantity,
    minusquantity,
    placeorderandreducestock,
    selectcart,
    getmyorders,
}