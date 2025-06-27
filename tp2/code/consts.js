const mariadb = require('mariadb');

const host_db = "localhost";
const user_db = "manu";
const pwd_db = "1234";
const dbase = "Poo_ecommerce";
const pool_size = 3;
const port = 3306;

const d1=new Date();
const fecha=String(d1.getDate()).padStart(2, '0')+"/"+String(d1.getMonth() + 1).padStart(2, '0')+"/"+d1.getFullYear();


const htmls={grid1:"<!DOCTYPE html><html><head><title>Ecommerce - OPP</title>"+
        "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"+
        "<link rel='stylesheet' href='/ecommerce.css'><script src='/ecommerce_scripts.js'></script></head>"+
        "<body>"+
        "<div class='grid-container'>"+
          "<header><h1>App de Ecommerce - POO</h1>"+
            "</header>"+
          "<nav>"+
            "<ul>"+
            "<li><a href='/'>Home</a></li>"+
            "<li><a href='/productos'>Productos</a></li>"+
            "<li><a href='/empleados'>Empleados</a></li>"+
            "<li><a href='/ventas'>Ventas</a></li>"+
            "<li><a href='#'>Login</a></li>"+
            "</ul>"+
          "</nav>"+
        "<main>",
      grid2:"</main>"+
            "<footer>"+
              "<p>&copy; 2025 My Website</p>"+
            "</footer>"+
          "</div>"+
        "</body></html>",
      grid_header:"<!DOCTYPE html><html><head><title>Ecommerce - OPP</title>"+
        "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"+
        "<link rel='stylesheet' href='/ecommerce.css'><script src='/ecommerce_scripts.js'></script></head>"+
        "<body>"+
        "<div class='grid-container'>"+
          "<header><h1>App de Ecommerce - POO</h1>",
      grid_main: "</header>"+
          "<nav>"+
            "<ul>"+
            "<li><a href='/'>Home</a></li>"+
            "<li><a href='/productos'>Productos</a></li>"+
            "<li><a href='/empleados'>Empleados</a></li>"+
            "<li><a href='/ventas'>Ventas</a></li>"+
            "<li><a href='#'>Login</a></li>"+
            "</ul>"+
          "</nav>"+
        "<main>"};

const int_l=new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
    });

const pool = mariadb.createPool({
    host: host_db,
    user: user_db,
    password: pwd_db,
    database: dbase,
    connectionLimit: pool_size
});


function get_connection() {
    return mariadb.createConnection({
        host: host_db,
        user: user_db,
        password: pwd_db,
        database: dbase
    });
}




module.exports = { pool, get_connection, int_l, htmls, fecha };