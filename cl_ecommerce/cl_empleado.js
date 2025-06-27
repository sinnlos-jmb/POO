const fs = require("fs");
const path = require('path');

class Empleado {
    constructor(nombre, rol) {
        this.nombre = nombre;
        this.rol = rol;
    }
}



class AdminEmpleados {
    constructor() {
        this.empleados = this.cargarEmpleados();
    }

    cargarEmpleados() {
        try {
            return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/empleados.json')));
        } catch (error) {
            return [];
        }
    }

    guardarEmpleados() {
        console.log("guardando empleado: "+JSON.stringify(this.empleados, null, 2) );
        fs.writeFileSync(path.resolve(__dirname, '../data/empleados.json'), JSON.stringify(this.empleados, null, 2));
    }

    addEmpleado(emp) {
        this.empleados.push(emp);
        this.guardarEmpleados();
        console.log("\n✅ Empleado agregado!\n");
    }

    mostrarEmpleados() {
        console.log("\n=== Empleados ===");
        this.empleados.forEach((empleado, index) => {
            console.log(`${index + 1}. ${empleado.nombre} - ${empleado.rol}`);
        });
    }
}


module.exports = { Empleado, AdminEmpleados }