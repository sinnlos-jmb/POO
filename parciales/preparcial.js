/*
Ejercicio: Sistema de Gestión Hospitalaria
📌 Contexto: Un hospital necesita administrar su personal médico (doctores y enfermeros), pacientes, y mantener historias clínicas detalladas con diagnósticos y tratamientos.
🎯 Objetivo: Modelar un sistema complejo con múltiples niveles de herencia, composición de historias clínicas, y métodos que coordinen las relaciones entre entidades.
🔹 Requerimientos:

Parte 1 - Personas del Hospital:

Clase base Persona: nombre, dni, edad (encapsulados)
Subclases con características específicas:

Doctor: especialidad, matricula
Método: atenderPaciente(paciente)


Paciente: numeroHistoriaClinica, obraSocial
Método: consultarSintomas() (retorna descripción)


Enfermero: turno (mañana/tarde/noche), sector
Método: tomarSignosVitales(paciente)


Parte 2 - Composición de Historia Clínica:
Clase HistoriaClinica que compone:
Array de diagnósticos (objetos con: fecha, descripción, doctor, tratamiento)
//ampliación a implementar: Array de tratamientos (objetos con: medicamento, dosis, duración)

Métodos:
agregarDiagnostico(diagnostico)
obtenerHistorialCompleto()



Parte 3 - Gestión del Hospital:

Clase Hospital con:

Arrays de: doctores, enfermeros, pacientes
Métodos:

registrarPersonal(persona) (agrega doctor o enfermero)
admitirPaciente(paciente) (crea historia clínica)
asignarDoctor(paciente, doctor) (relaciona ambos)
agregarDiagnostico(paciente, diagnostico) (actualiza historia)
mostrarHistoriaClinica(paciente) (imprime registro completo)
listarDoctoresPorEspecialidad(especialidad)

*/

class Persona {

    constructor (dni, nombre, apellido, edad){
        this.dni=dni;
        this.nombre=nombre;
        this.apellido=apellido;
        this.edad=edad;

    }

    // getters y setters

    getInfo() {
        return ``;
    }

}

class Doctor extends Persona {

    constructor (dni, nombre, apellido, edad, especialidad, matricula){
        super(dni,nombre,apellido,edad);
        this.especialidad=especialidad;
        this.matricula=matricula;
    }

    atenderPaciente(HC) {

        const hoy=new Date();
        const f_hoy = new Intl.DateTimeFormat('es-ES').format(hoy);
        //console.log(f_hoy);
        HC.agregarDiganostico(f_hoy, "revision del paciente:..... ", this, "tratamiento m1");
        return HC;

        }

    getInfo() {
        return `Dr./Dra. ${this.nombre} ${this.apellido} de ${this.edad} años, matricula: ${this.matricula} y especialidad: ${this.especialidad}`
    }

}

class Paciente extends Persona {

    constructor (dni, nombre, apellido, edad, nroHC, o_social){
        super(dni,nombre,apellido,edad);
        this.nroHC=nroHC;
        this.obra_social=o_social;
    }

    getNroHC() {
        return this.nroHC;
    }

    getInfo() {
        return `Paciente: ${this.nombre} ${this.apellido} de ${this.edad} años. Obra social: ${this.obra_social}\nnumero de historia clinica: ${this.nroHC}`;
    }

}


class Enfermero extends Persona {

    constructor (dni, nombre, apellido, edad, turno, sector){
        super(dni,nombre,apellido,edad);
        this.turno=turno;
        this.sector=sector;
    }

    getSignosVitales(pacient) {
        return this.nroHC;
        }

    getInfo() {
        return `Enfermero: ${this.nombre} ${this.apellido} de ${this.edad} años. \nTurno: ${this.turno}, sector: ${this.sector}`;
        }

}

class HC {
    #diagnosticos=[];

    constructor (paciente){
        this.paciente=paciente;
        this.nro=paciente.getNroHC();
    }

    agregarDiganostico(p_fecha, desc, dr, trat){
        this.#diagnosticos.push({fecha:p_fecha, descripcion:desc, doctor:dr, tratamiento:trat});
    }

    getHC() {
        let rta="";
        for (let i=0; i<this.#diagnosticos.length;i++) {
            rta+=`\nregisro ${i}: ${JSON.stringify(this.#diagnosticos[i])}`;
        }
    return rta;
    
    }



}

//demostracion

const dr1=new Doctor("34234567", "juan", "quiroz", "48", "cardiologo", "M.N. 122343");
console.log(dr1.getInfo());
const pac1=new Paciente("24134161", "maria", "gonzalez", "58", "1", "UP");
console.log(pac1.getInfo());

let hc1=new HC(pac1);
hc1.agregarDiganostico ("01-01-2025", "TA 120/80, FC 88lpm. ECG normal", dr1, "lotrial 50mg. Revisar 3 meses.");
console.log(hc1.getHC());
hc1=dr1.atenderPaciente(hc1);
console.log(hc1.getHC());