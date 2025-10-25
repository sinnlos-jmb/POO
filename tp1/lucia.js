
class Contacto{
    
    constructor(nombre, email, telefono, direccion){//estaria bueno sumar un id de contacto
        this.nombre=nombre;
        this.email=email;
        this.telefono=telefono;
        this.direccion=direccion;

    }

    getNombre(){
        return this.nombre;
    }

    setNombre(){
        return this.nombre;
    }

    getInfo(){
        return "Datos del contacto: nombre : "+this.email+", telefono: "+ this.telefono+", direccion: "+this.direccion;
    }
    
}


class Agenda{

    constructor(nombre, anio){
        this.nombre=nombre;
        this.anio=anio;
        this.contactos=[];
    }

// getters y setters

agregar_contacto(contacto){
    this.contactos.push(contacto);
    console.log("Nuevo contacto agregado")
}

listar_contactos(){
console.log("listado de contactos:"+JSON.stringify(this.contactos));
}

buscar_contacto_por_nombre(nombre){
    let encontrado=false; let rta={msg:"No se encontro el contacto", obj_contacto:null};// el json tiene un campo mensaje y un campo objeto
    for(let i=0; i<this.contactos.length && !encontrado; i++){
        if(this.contactos[i].getNombre() === nombre){
            encontrado=true;
            rta= {msg:"contacto encontrado", obj_contacto:this.contactos[i]};
            // console.log() no se si va
        }
    }
    return rta;
    
    // armar este
    // eliminar_contacto_por_nombre(){

    // }

}
}

// demostracion

const contacto1= new Contacto("lucia", "lucorral8@gmail.com", "2944419949", "bigua 303");
const contacto2= new Contacto("christian", "christian.manzilo@gmail.com", "1128606860", "bigua 303");

const agenda= new Agenda("Agenda contactos", "2025");

agenda.agregar_contacto(contacto1);
agenda.agregar_contacto(contacto2);
agenda.listar_contactos();
let rta=agenda.buscar_contacto_por_nombre("pedro");
console.log(rta.msg+"Referencia al contacto: "+ rta.obj_contacto);

rta=agenda.buscar_contacto_por_nombre("lucia");
console.log(rta.msg+"Referencia al contacto: "+ rta.obj_contacto);