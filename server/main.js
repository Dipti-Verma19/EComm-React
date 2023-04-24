const express = require('express');
const sql = require('mssql');
const session = require('express-session');
const cors = require('cors');
const app = express()
const port = 5000;

app.use(cors({
    origin: "http://localhost:3000"
}))
app.use(express.json());
const config = require("./configuation/connectDB");
const pool = new sql.ConnectionPool(config);

pool.connect().then(() => {
    console.log('Connected to SQL database');
}).catch((err) => {
    console.error('Error connecting to database', err);
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))

const sellerroute = require("./routes/sellerroute");
app.use("/seller", sellerroute)

const adminroute = require("./routes/adminroute");
app.use("/admin", adminroute)

const userroute = require("./routes/userroute");
app.use("/", userroute)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
