
const express = require ('express');
const app = express();
const options = { maxAge: '2h', etag: false }; 
app.use(express.static('public', options));

const {port, htmls, pool} = require("./code/consts");

async function cargar_vec() {
        let conn, rows, rta="<table>";
        console.log("entro a db");
        try {
            conn = await pool.getConnection();
            rows = await conn.query("select id_hotel, nombre_hotel from Hoteles order by nombre_hotel");
            for (let i in rows) {
                rta+="<tr><td>"+rows[i].id_hotel+"</td><td>"+rows[i].nombre_hotel+"</td></tr>"
                }
            console.log("salgo de for. RTA= "+rta);
            rta+="</table>"
            }
        catch (err) {
            console.log(err);
            return {rta: "error: "+err, ok: false};} 
        finally { 
            if (conn) await conn.release();
            return {rta: rta, ok:true};
            }
        

        }



//rutas  : localhost:3060?p1=100&usuario=juan&logged=false
app.get('/', async function (req, res) {
  const params = { op: req.query.op || '', usuario: req.query.usuario || '', pwd: req.query.pwd || '1221' , logged:false};
  //let rta=htmls.grid1;
let rta="<!DOCTYPE html><html><head><title>prueba TP grupal</title></head>"+
        "<body>"+
        "Prueba primera clase TP2</body></html>";
/*
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
      */
      res.send(rta);
  })



//http://localhost:3060/productos
app.get('/productos', async function (req, res) {
    let tabla_prd=await cargar_vec();
    console.log(tabla_prd);
    res.send(tabla_prd.rta);

  })




app.get('/empleados', async function (req, res) {

})



app.get('/ventas', async function (req, res) {

  })
    



  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    })
