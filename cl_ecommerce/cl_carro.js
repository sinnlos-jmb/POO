const cl_prd = require("./cl_producto");

class Carro {
    constructor() {
        this.items = [];
    }

    agregarItem(producto, cantidad) {
        this.items.push({ producto, cantidad });
        console.log("\n✅ Producto agregado al carro!\n");
    }

    mostrarCarro() {
        console.log("\n=== Contenido del carro de compras ===");
        this.items.forEach((item, index) => {
            console.log(`${index + 1}. ${item.producto.getDetalles()} - Cantidad: ${item.cantidad}`);
        });
    }

    checkout(vec_prds, emp_activo, vec_reporte) {
        let total = 0;
        this.items.forEach(({ producto, cantidad }) => {
            let productIndex = vec_prds.findIndex(p => 
                p.marca === producto.marca && 
                p.modelo === producto.modelo
            );
            if (productIndex !== -1 && vec_prds[productIndex].stock >= cantidad) {
                vec_prds[productIndex].stock -= cantidad;
                total += producto.precio * cantidad;
            }
        });
        vec_reporte.push({ 
            empleado: emp_activo.nombre, 
            items: this.items, 
            total 
        });
        
        console.log(`\nCheckout Realizado! Total: $${total}\n`);
        this.items = [];
        return vec_reporte;
        
    }
}

module.exports = { Carro }