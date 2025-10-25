/*Resolver este ejercicio
1️1️⃣ Ejercicio: Agenda de Contactos
--------------------------------------
📌 Objetivo: Crear una aplicación para gestionar contactos personales.
🔹 Tarea: Crear una clase Contacto con:
   - nombre, teléfono, email, dirección.
   - Una clase Agenda que almacena y organiza contactos.
   - Métodos para agregarContacto(), buscarContacto() y eliminarContacto().
*/

class Contacto {

    constructor (p_nombre, p_email, p_direccion) {
     this.nombre=p_nombre;
     this.email=p_email;
     this.direccion=p_direccion;
    }

    getNombre() {
        return this.nombre;
        }
    
    setNombre(p_nombre) {
        this.nombre=p_nombre;
    }
    
    getInfo(){
        return "datos del contacto: nombre: "+this.nombre+", email: "+this.email+", direccion: "+this.direccion;

    }
}

class Agenda {


    constructor (p_nombre, p_anio){
        this.nombre=p_nombre;
        this.anio=p_anio;
        this.contactos=[];
    }

    //getters y setters

    agregar_contacto(p_contacto) {

        this.contactos.push(p_contacto);
        console.log("contacto agregado exitosamente");
        }

    listar_contactos() {
        console.log("listado de contactos:\n"+JSON.stringify(this.contactos));
    }

    busca_nombre_contacto(p_nombre) {
        let encontrado=false, rta={msg:"no se encontró el contacto", o_contacto:null};
        for (let i=0; i<this.contactos.length && !encontrado; i++) {
            if (this.contactos[i].getNombre()===p_nombre) {
                encontrado=true;
                rta={msg:"contacto encontrado", o_contacto:this.contactos[i]};
            }
        }
        return rta;

    }

    elimina_contacto_x_nombre (p_nombre) {

        //  ????
    }


}
// demostracion

const c1=new Contacto("juana", "112334452233", "juana@gmail.com", "castro barros 2222");
const c2=new Contacto("mayra", "117374752233", "mayra@gmail.com", "cordoba 1122");
const ag1=new Agenda("agenda de amgios", "2025");
ag1.agregar_contacto(c1);
ag1.agregar_contacto(c2);
ag1.listar_contactos();
let rta=ag1.busca_nombre_contacto("pedro");
console.log(rta.msg+"\n referencia al contacto : "+JSON.stringify(rta.o_contacto));
rta=ag1.busca_nombre_contacto("mayra");
console.log(rta.msg+"\n referencia al contacto : "+JSON.stringify(rta.o_contacto));
