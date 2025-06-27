/*
3️⃣ Ejercicio: Sistema de Comercio Electrónico
--------------------------------------
📌 Objetivo: Aprender herencia creando una jerarquía de productos.
🔹 Tarea: Crear una clase padre `Producto`.
   - Subclases: `Electrónica`, `Ropa` y `Alimentos`.
   - Cada subclase tiene un atributo único (`garantía`, `talla` o `fechaCaducidad`).
*/


// Clase Padre: Producto
class Producto {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }

    mostrarInfo() {
        return `📦 Producto: ${this.nombre} - 💲 Precio: $${this.precio}`;
    }
}

// Subclase: Electrónica
class Electronica extends Producto {
    constructor(nombre, precio, garantia) {
        super(nombre, precio);
        this.garantia = garantia; // En años
    }

    mostrarInfo() {
        return `${super.mostrarInfo()} - 🛡️ Garantía: ${this.garantia} años`;
        }
}

// Subclase: Ropa
class Ropa extends Producto {
    constructor(nombre, precio, talla) {
        super(nombre, precio);
        this.talla = talla; // Talla de la ropa (S, M, L, etc.)
    }

    mostrarInfo() {
        return `${super.mostrarInfo()} - 👕 Talla: ${this.talla}`;
    }
}

// Subclase: Alimentos
class Alimentos extends Producto {
    constructor(nombre, precio, fechaCaducidad) {
        super(nombre, precio);
        this.fechaCaducidad = fechaCaducidad;
    }

    mostrarInfo() {
        return `${super.mostrarInfo()} - 🗓️ Vence: ${this.fechaCaducidad}`;
    }
}

// ✅ Ejemplo de uso
const laptop = new Electronica("Laptop Dell", 1200, 2);
const camisa = new Ropa("Camisa Polo", 35, "M");
const manzana = new Alimentos("Manzana Roja", 1.5, "2024-12-31");

console.log(laptop.mostrarInfo());
console.log(camisa.mostrarInfo());
console.log(manzana.mostrarInfo());
