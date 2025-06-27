const fs = require("fs");
const path = require('path');

// tipos de producto
let productTypes = [
    { nombre: 'Pantalon', class: null },
    { nombre: 'Calzado', class: null },
    { nombre: 'Campera', class: null }
];

function setProductTypes() {
    productTypes[0].class=Pantalon;
    productTypes[1].class=Calzado;
    productTypes[2].class=Campera;
    //console.log (" productTypes OK!");
}



class Producto {
    constructor(marca, modelo, precio, stock) {
        this.marca = marca;
        this.modelo = modelo;
        this.precio = precio;
        this.stock = stock;
        this.tipo = "";
    }

    getDetalles() {
        return `${this.marca} ${this.modelo}`;
    }

    mostrarProductos(p_vec_prds) {
        console.log("\n=== Productos ===");
        p_vec_prds.forEach((producto, index) => {
            console.log(`${index + 1}. ${producto.getDetalles()} - $${producto.precio} (Stock: ${producto.stock})`);
        });
    }

    mostrarProductos2() {
        console.log("\n=== Productos ===");
        this.produ.forEach((producto, index) => {
            console.log(`${index + 1}. ${producto.getDetalles()} - $${producto.precio} (Stock: ${producto.stock})`);
        });
    }
   
    
    static cargarProductos() {
        try {
            // Parse JSON y reconstruye cada producto como un objeto
            const rawProducts = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/productos.json')));
            const temp = [];
            for (let i = 0; i < rawProducts.length; i++) {
                temp.push(Producto.reconstruct(rawProducts[i]));
                }

            //console.log("mapped: "+temp);
            return temp;
        } catch (error) {
            return [];
        }
    }

    guardarProductos(p_productos) {
        fs.writeFileSync(path.resolve(__dirname, '../data/productos.json'), JSON.stringify(p_productos, null, 2));
    }


    // metodo static para reconstrir los objetos almacenados en el archivo
    static reconstruct(productData) {
        if (productData.ancho !== undefined) {
            return Object.assign(new Pantalon(), productData);
        } else if (productData.talle !== undefined) {
            return Object.assign(new Calzado(), productData);
        } else if (productData.dimensions !== undefined) {
            return Object.assign(new Campera(), productData);
        }
        // x default clase Producto
        return Object.assign(new Producto(), productData);
    }
}

// Subclasses de Producto
class Pantalon extends Producto {
    constructor(marca, modelo, precio, stock, ancho, largo) {
        super(marca, modelo, precio, stock);
        this.ancho = ancho;
        this.largo = largo;
        this.category = 'Pantalon';
    }

    getDetalles() {
        return `${super.getDetalles()} (${this.category}) - Ancho: ${this.ancho} - Largo: ${this.largo}`;
    }
}

class Calzado extends Producto {
    constructor(marca, modelo, precio, stock, talle, material) {
        super(marca, modelo, precio, stock);
        this.talle = talle;
        this.material = material;
        this.category = 'Calzado';
    }

    getDetalles() {
        return `${super.getDetalles()} (${this.category}) - talle: ${this.talle}, Material: ${this.material}`;
    }
}

class Campera extends Producto {
    constructor(marca, modelo, precio, stock, temporada, talles, color) {
        super(marca, modelo, precio, stock);
        this.temporada = temporada;
        this.talles = talles;
        this.color = color;
        this.category = 'Campera';
    }

    getDetalles() {
        return `${super.getDetalles()} (${this.category}) - Temporada: ${this.temporada}, Talles: ${this.talles}, Color: ${this.color}`;
    }
}


module.exports = {Producto, Calzado, Campera, Pantalon, productTypes, setProductTypes }