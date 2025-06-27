//viewport y load en true tras primera ejecución
const express = require('express')
const session = require("express-session");

const app = express()
const port = 3060;

const options = { maxAge: '2h', etag: false };  //cambiar a 2d
app.use(express.static('public', options));
app.use(session({ secret: "1111", resave: false, saveUninitialized: false, }));

const {htmls, fecha} = require("./code/consts");
const { Producto, Empleado, Venta, Login } = require('./code/classes');






app.get('/', async function (req, res) {
  const params = { op: req.query.op || '', usuario: req.query.usuario || '', pwd: req.query.pwd || '1221' , logged:false};
  let rta=htmls.grid1;

  if (params.op=="auth"){
      const o_user=new Login (params.usuario, params.pwd);
      const rta_m= await o_user.autenticar();
      console.log(rta_m.message);
      rta+= "funcion de autenticación: "+rta_m.message;
      }
  else if (params.op=="new"){
      rta+= "<h2 style='text-align: center;'>Modelo de app: gestion tienda online</h2>"+
            "<h3>Nuevo Usuario</h3>"+
            " <form method='get' action='/'>"+
            "<p><label for='usuario'>Nombre: </label> <input type='text' id='usuario' name='usuario' /> </p>"+
            "<p><label for='pwd'>Contraseña: </label> <input type='password' id='pwd' name='pwd' /> </p>"+      
              "<p> <button type='submit'>Registrarse</button></p>"+
              "<input type='hidden' name='op' value='submit'></form>";
      }
  else if (params.op=="submit"){
      const o_user=new Login (params.usuario, params.pwd);
      const rta_m= await o_user.nuevo_usuario();
      console.log(rta_m);
      rta+= "funcion de insert nuevo user: "+rta_m;
      }
  else {
      rta+= "<h2 style='text-align: center;'>Modelo de app: gestion tienda online</h2>"+
            "<h3>Login</h3>"+
            " <form method='get' action='/'>"+
            "<p><label for='usuario'>Nombre: </label> <input type='text' id='usuario' name='usuario' /> </p>"+
            "<p><label for='pwd'>Contraseña: </label> <input type='password' id='pwd' name='pwd' /> </p>"+        
              "<p> <button type='submit'>Login</button>  <button type='button' onclick='window.location.href=\"?op=new\"'>Registrarse</button></p>"+
              "<input type='hidden' name='op' value='auth'></form>";
      }    

      res.send(rta+htmls.grid2);
  })




app.get('/productos', async function (req, res) {

if (!Producto.load) {
  Producto.cargar_vec();
  }

const params = { op: req.query.op || '', query: '' , logged:true};  
const prd = { marca: req.query.marca || '', modelo:  req.query.modelo || '' , 
              precio:  req.query.precio || '', stock:  req.query.stock || '', 
              categ:  req.query.categ || '', talles:  req.query.talles || '', 
              material:  req.query.material || '', 
              temporada:  req.query.temporada || '', color:  req.query.color || '',
              ancho:  req.query.ancho || '', largo:  req.query.largo || ''};

let rta=htmls.grid1;
if (params.op=='lista') {
    rta+="<h2>Lista de productos</h2><br>"+Producto.getProductos();
    }
else if (params.op=='nuevo') {
    rta+="<h2>Nuevo producto</h2><br>"+
          "<select name='s_rol' onchange='new_form(this.value);'><option value='0'>tipo producto</option><option value='1'>calzado</option><option value='2'>campera</option><option value='3'>pantalon</option></select>\n"+
          "<div id='new_f'></div>";
    }
else if (params.op=='submit') {
      rta+="<h2>Insertar producto en la dbase</h2><br>"+
          "<ul>datos del form: "+
          "<li>marca: "+prd.marca+"</li>"+
          "<li>modelo: "+prd.modelo+"</li>"+
          "<li>precio: "+prd.precio+"</li>"+
          "<li>stock: "+prd.stock+"</li>"+
          "<li>categ: "+prd.categ+"("+Producto.categs[prd.categ]+")</li></ul>";
      try {
            const value = await Producto.insert_producto(prd);
            if (value != null) {
              rta+=value;
              }
            else {
              rta+="No se insertaron registros.";
              }
          }
      catch (error) { rta+=error; }          
    }    
else {
    rta+="<h2><a href='/productos?op=lista'>Listar Productos</a>  |  <a href='/productos?op=nuevo'>Nuevo producto</a></h2>"
    }
rta+=htmls.grid2;
res.send(rta);
  })




app.get('/empleados', async function (req, res) {

  if (!Empleado.load) {
    Empleado.cargar_vec();
    }
  const params = { op: req.query.op || '', logged:true};  
  const emp = { id: req.query.id_empleado || '', nombre:  req.query.nom_empleado || '' , 
                apellido:  req.query.ape_empleado || '', dni:  req.query.dni_empleado || '', 
                rol:  req.query.rol_empleado || ''};

  let rta=htmls.grid1;
  if (params.op=='lista') {
      rta+="<h2>Lista de empleados</h2><br>"+Empleado.getEmpleados();
      }
  else if (params.op=='nuevo') {
      rta+="<h2>Nuevo empleado</h2><br>"+
            "<form action='/empleados' method='get'>"+
            " <p><label for='nom_empleado'>Nombre:</label> <input type='text' id='nom_empleado' name='nom_empleado' /> </p>"+
            " <p><label for='ape_empleado'>Apellido:</label> <input type='text' id='ape_empleado' name='ape_empleado' /> </p>"+
            " <p><label for='dni_empleado'>DNI:</label> <input type='text' id='dni_empleado' name='dni_empleado' /> </p>"+
            " <p><label for='rol_empleado'>Rol:</label> <select name='rol_empleado'><option value='cajero'>cajero</option><option value='reposicion'>reposicion</option><option value='administracion'>administracion</option><option value='supervisor'>supervisor</option></select>\n</p>"+
            "<p> <button type='submit'>Guardar</button></p>"+
            "<input type='hidden' name='op' value='submit'></form>";
      }
  else if (params.op=='submit') {
        rta+="<h2>Insertar empleado en la dbase</h2><br>"+
            "<ul>datos del form: "+
            "<li>nombre: "+emp.nombre+"</li>"+
            "<li>apellido: "+emp.apellido+"</li>"+
            "<li>dni: "+emp.dni+"</li>"+
            "<li>rol: "+emp.rol+"</li></ul>";
        try {
              const value = await Empleado.insert_empleado(emp);
              if (value != null) {
                rta+=value;
                }
              else {
                rta+="No se insertaron registros.";
                }
            }
        catch (error) { rta+=error; }          
      }
  else {
      rta+="<h2><a href='/empleados?op=lista'>Listar Empleados</a>  |  <a href='/empleados?op=nuevo'>Nuevo empleado</a></h2>"
      }
  rta+=htmls.grid2;
  res.send(rta);
  })



app.get('/ventas', async function (req, res) {

  if (!Venta.load) {
    Venta.cargar_vec();
    }
  if (!Empleado.load) {
    Empleado.cargar_vec();
    }
  if (!Producto.load) {
    Producto.cargar_vec();
    }
  const params = { op: req.query.op || '', logged:true};  
  const venta = { id_empleado: req.query.id_empleado || '', total:  req.query.total_venta || '' , 
                fecha:  req.query.fecha || fecha, dni_cliente:  req.query.dni_cliente || '', 
                detalle:  req.query.detalle || ''};

  let rta=htmls.grid1;
  if (params.op=='lista') {
      rta+="<h2>Lista de ventas</h2><br>"+Venta.getVentas();
      }
  else if (params.op=='nuevo') {
      rta=htmls.grid_header+"<script>";
      rta+=Producto.get_vec_js_productos()+"</script>"+htmls.grid_main;
      rta+="<h2>Nueva venta</h2><br>"+
            "<form action='/ventas' method='get'>"+
            " <p><label for='id_empleado'>Empleado:</label> "+Empleado.getDDEmpleados()+" </p>"+
            " <p><label for='total_venta'>Total:</label> <input type='text' id='total_venta' name='total_venta' /> </p>"+
            " <p><label for='fecha'>Fecha:</label> <input type='text' id='fecha' name='fecha' value='"+fecha+"' /> </p>"+
            " <p><label for='dni_cliente'>DNI cliente:</label> <input type='text' name='dni_cliente' id='dni_cliente' /></p>"+
            "<p> <button type='submit'>Guardar</button> <button type='button' onclick='add_carro();'>Agregar producto</button> <button type='button' onclick='update_carro();'>Actualizar</button></p>"+
            "<input type='hidden' name='op' value='submit'></form>"+
            "<br><div id='carro' class='carro'></div>";
      }
  else if (params.op=='submit') {
        rta+="<h2>Insertar venta en la dbase</h2><br>"+
            "<ul>datos del form: "+
            "<li>id_empleado: "+venta.id_empleado+"</li>"+
            "<li>importe: "+venta.total+"</li>"+
            "<li>dni_cliente: "+venta.dni_cliente+"</li>"+
            "<li>fecha: "+venta.fecha+"</li></ul>";
        try {
              const value = await Venta.insert_venta(venta);
              if (value != null) {
                rta+=value;
                }
              else {
                rta+="No se insertaron registros.";
                }
            }
        catch (error) { rta+=error; }          
      }
  else {
      rta+="<h2><a href='/ventas?op=lista'>Listar Ventas</a>  |  <a href='/ventas?op=nuevo'>Nueva venta</a></h2>"
      }
  rta+=htmls.grid2;
  res.send(rta);
  })
    

app.get('/encuentrame', async function (req, res) {

  const params = { op: req.query.op || '', logged:true};  
  const venta = { id_empleado: req.query.id_empleado || '', total:  req.query.total_venta || '' , 
                fecha:  req.query.fecha || fecha, dni_cliente:  req.query.dni_cliente || '', 
                detalle:  req.query.detalle || ''};


  rta="<!DOCTYPE html><html><head><title>Encuentrame</title>"+
        "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"+
        "<link rel='stylesheet' href='/ecommerce.css'><script src='/ecommerce_scripts.js'></script></head>"+
        "<body>"+
        "<h3>pagina de prueba para login</h3>"+
        "</body></html>";
  res.send(rta);
  })



  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    })
