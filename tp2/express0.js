const express = require ('express');  
const app = express();
const session = require("express-session");  //npm install express-session
const cors = require('cors'); //npm install cors
const https = require('https');
const { OpenRouter } = require('@openrouter/sdk');

//const options = { maxAge: '2h', etag: false }; 
app.use(express.static('public'));
app.use(session({ secret: "1111", resave: false, saveUninitialized: false, }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//modulos locales
const {pool, port, key, htmls} = require("./code/consts");
const {Login, Ferreteria} = require("./code/classes_parcial");

let conversation = []; //historial para chatbot



//rutas  
app.get('/', async function (req, res) {

    if (!Ferreteria.dbase.init) {
        console.log("inicializo clase ferreteria");
        const ferre=new Ferreteria("1");
        console.log("init?: "+Ferreteria.dbase.init);
        await Ferreteria.dbase.init;
         req.session.ferreteria = ferre;  //recuperar: const ferr= req.session.ferreteria;
    }

  const params = { op: req.query.op || '', usuario: req.query.usuario || '', pwd: req.query.pwd || '1221' , logged:false};
  let rta=htmls.grid1;
//let rta="<!DOCTYPE html><html><head><title>prueba TP grupal</title></head>"+"<body>"+"Prueba primera clase TP2</body></html>";
  const ferr=new Ferreteria("1");
        
/* http//:localhost:3060?op=new&nombre_usuario=juan   */ 
  if (params.op=="auth"){

      const o_user=new Login (params.usuario, params.pwd);
      const rta_m= await o_user.autenticar();
      console.log(rta_m.message);
      rta+= "funcion de autenticación: "+rta_m.message;
      }
  else if (params.op=="new"){
      rta+= "<h3>Nuevo Usuario</h3>"+
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
      rta+= "<h3>Login</h3>"+
            " <form method='get' action='/'>"+
            "<p><label for='usuario'>Nombre: </label> <input type='text' id='usuario' name='usuario' /> </p>"+
            "<p><label for='pwd'>Contraseña: </label> <input type='password' id='pwd' name='pwd' /> </p>"+        
              "<p> <button type='submit'>Login</button>  "+
              "<button type='button' onclick='window.location.href=\"?op=new\"'>Registrarse</button></p>"+
              "<input type='hidden' name='op' value='auth'></form>";
      }    

      res.send(rta+htmls.grid2);
     
  })



//http://localhost:3060/productos
app.get('/productos', async function (req, res) {

    if (!Ferreteria.dbase.init) {
        res.send("clase ferreteria no inicializada");    }
    else{

    const arr_prd=Ferreteria.dbase.productos;
    let rta="<h3 style='text-align: center;'>Listado de Productos</h3>"+
            "<div style='text-align: center;'>  <table style='text-align: center;width: 75%;border: solid 1px burlywood; border-collapse: collapse; display: inline-table;'>"+
            "<tr><th style='border-bottom: solid 1px burlywood;'>ID</th><th style='border-bottom: solid 1px burlywood;'>Nombre</th><th style='border-bottom: solid 1px burlywood;'>Precio</th><th style='border-bottom: solid 1px burlywood;'>Stock</th></tr>";
        
    for (let i=0; i<arr_prd.length;i++){
        rta+=`<tr><td>${arr_prd[i].codigo}</td><td>${arr_prd[i].nombre}</td><td>${arr_prd[i].precio}</td><td>${arr_prd[i].stock}</td></tr>`;    }
    rta+="</table><div style='margin-top: 20px;'> <button type='button' style='background: linen; border-radius: 10px; border: solid 1px goldenrod;' onclick=''>Nuevo Producto</button></div>  </div>";
    res.send(htmls.grid1+rta+htmls.grid2);
    }
    })




app.get('/empleados', async function (req, res) {

})



app.get('/ventas', async function (req, res) {

  })
    

app.post('/api/chat_NS', async (req, res) => { //version sin stream

const openRouter = new OpenRouter({
  apiKey: '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',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3060',
    'X-Title': 'Mini AI Chat',
  },
});

  try {
    const { message } = req.body;

    const completion = await openRouter.chat.send({
      model: 'openai/gpt-5-nano',
      messages: [
        { role: 'system', content: 'Eres un asistente' },
        { role: 'user', content: message },
      ],
      stream: false,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: err.message });
  }
});



app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  const OPENROUTER_API_KEY = key;
  

  if (!message) return res.status(400).send("Missing message");

  // Agregar nuevo mensaje del usuario a la conversación
  conversation.push({ role: "user", content: message });

  // Limitar la memoria a los últimos 10 mensajes
  if (conversation.length > 10) conversation = conversation.slice(-10);

  // Configurar headers de streaming
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  const body = JSON.stringify({
    model: "tngtech/deepseek-r1t2-chimera:free",  // x-ai/grok-4-fast openai/gpt-oss-120b google/gemma-3-27b-it google/gemini-2.5-flash-lite nvidia/nemotron-nano-12b-v2-vl:free alibaba/tongyi-deepresearch-30b-a3b:free openai/gpt-oss-20b:free meta-llama/llama-4-maverick:free deepseek/deepseek-v3.2-exp openai/gpt-5-nano
    messages: conversation,
    stream: true,
  });

  const options = {
    hostname: "openrouter.ai",
    path: "/api/v1/chat/completions",
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
  };

  try {
    const request = https.request(options, (response) => {
      let buffer = "";
      let assistantReply = "";

      response.on("data", (chunk) => {
        buffer += chunk.toString("utf-8");

        let lineEnd;
        while ((lineEnd = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, lineEnd).trim();
          buffer = buffer.slice(lineEnd + 1);

          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") {
            // Guardar la respuesta del asistente en la memoria
            conversation.push({ role: "assistant", content: assistantReply });
            res.end();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantReply += content;
              res.write(content);
            }
          } catch (err) {
            // ignorar líneas no parseables
          }
        }
      });

      response.on("end", () => res.end());
    });

    request.on("error", (err) => {
      console.error("❌ HTTPS request error:", err);
      res.status(500).end("Error: " + err.message);
    });

    request.write(body);
    request.end();
  } catch (err) {
    console.error("❌ Streaming error:", err);
    res.status(500).end("Error: " + err.message);
  }
});



 const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    })


// Función para cerrar conexiones de forma ordenada
async function gracefulShutdown(signal) {
    console.log(`\n${signal} recibido. Cerrando conexiones...`);
    
    try {
        // Cerrar el servidor HTTP primero
        server.close(() => {
            console.log('Servidor HTTP cerrado');
        });
        
        // Cerrar el pool de conexiones
        if (pool) {
            await pool.end();
            console.log('Pool de conexiones cerrado');
        }
        
        console.log('Aplicación cerrada correctamente');
        process.exit(0);
        
    } catch (err) {
        console.error('Error durante el cierre:', err);
        process.exit(1);
    }
}

// Escuchar señales de terminación
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));  //kill <pid>
process.on('SIGINT', () => gracefulShutdown('SIGINT'));  //ctrl-c

// Manejar errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});