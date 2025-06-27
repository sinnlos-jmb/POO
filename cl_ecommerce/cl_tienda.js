const fs = require("fs");
const path = require('path');

const cl_prd = require("./cl_producto");

const prd=new cl_prd.Producto;


class Tienda {
    constructor(p_adminEmps, p_carro) {
        this.registro_ventas=this.cargaVentas();
        this.productos = cl_prd.Producto.cargarProductos();
        this.empleadoActivo=null;
        this.adminEmpleados=p_adminEmps;
        this.carro = p_carro;
        this.prd=new cl_prd.Producto();
    }


    cargaVentas() {
        try {
            return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/reporte_ventas.json')));
        } catch (error) { return []; }
    }

    guardaVentas() {
        fs.writeFileSync(path.resolve(__dirname, '../data/reporte_ventas.json'), JSON.stringify(this.registro_ventas, null, 2));
    }


     addProducto(tipoProducto, marca, modelo, precio, stock, rl1, menu) {
        switch(tipoProducto.nombre) {
            case 'Pantalon':
                rl1.question("ancho: ", (ancho) => {
                    rl1.question("largo: ", (largo) => {
                        const nuevoProducto = new tipoProducto.class(
                        marca, 
                        modelo, 
                        parseFloat(precio), 
                        parseInt(stock),
                        ancho,
                        largo
                    );
                    this.almacenarProducto(nuevoProducto, menu);
                });
            });
            break;
            
            case 'Calzado':
                rl1.question("Ingresar talles: ", (talles) => {
                    rl1.question("Ingresar material: ", (material) => {
                        const nuevoProducto = new tipoProducto.class(
                            marca, 
                            modelo, 
                            parseFloat(precio), 
                            parseInt(stock),
                            talles,
                            material
                        );
                        this.almacenarProducto(nuevoProducto, menu);
                    });
                });
                break;
            
            case 'Campera':
                rl1.question("Ingresar temporada: ", (temporada) => {
                    rl1.question("Ingresar talles: ", (talles) => {
                        rl1.question("Ingresar color: ", (color) => {
                            const nuevoProducto = new tipoProducto.class(
                            marca, 
                            modelo, 
                            parseFloat(precio), 
                            parseInt(stock),
                            temporada,
                            talles,
                            color
                        );
                        this.almacenarProducto(nuevoProducto, menu);
                    });
                });
            });
            break;
        }
    }


    almacenarProducto(nuevoProducto, menu) {
        //menu.vec_prds.push(nuevoProducto);
        this.productos.push(nuevoProducto);
        this.prd.guardarProductos(this.productos);
        console.log("\n✅ Producto agregado exitosamente!");
        console.log(`Detalles: ${nuevoProducto.getDetalles()}\n`);
        menu.menuPrincipal();
    }

    seleccionarEmpleado(rl1, mn, adminEmps) {
        adminEmps.mostrarEmpleados();
        rl1.question("Seleccionar nro de empleado: ", (index) => {
            this.empleadoActivo = adminEmps.empleados[parseInt(index) - 1];
            console.log(`\n Empleado a cargo: ${this.empleadoActivo.nombre}\n`);
            this.menuOperaciones(rl1, mn);
        });
    }

    mostrarReporte() {  //agregar todos los productos por compra, y cuáles fueron las compras de mayor y de menor valor.
        console.log("\n=== Reporte ===");
        //console.log(JSON.stringify(this.registro_ventas, null, 2));
        console.log("this.registro_ventas: "+this.registro_ventas);

        for (var key in this.registro_ventas) {
              console.log("nro de venta:", key, "Empleado:", this.registro_ventas[key].empleado+", Total: $"+this.registro_ventas[key].total);
              console.log("cant de items: "+this.registro_ventas[key].items.length);
              if(this.registro_ventas[key].items.length>0){
                console.log("item1: "+this.registro_ventas[key].items[0].producto.category+", "+this.registro_ventas[key].items[0].producto.marca+", "+this.registro_ventas[key].items[0].producto.modelo+", $"+this.registro_ventas[key].items[0].producto.precio);
                console.log("cantidad: "+this.registro_ventas[key].items[0].cantidad);
                }
          }

          
    }

    menuOperaciones(rl1, mn) {
        console.log("\n=== Operaciones ===");
        console.log("1. Agregar al carro");
        console.log("2. Mostrar contenido del carro");
        console.log("3. Checkout");
        console.log("4. Logout");
        
        rl1.question("Seleccionar una opcion: ", (opc) => {
            switch (opc) {
                case "1":
                    //prd.mostrarProductos(mn.vec_prds);
                    prd.mostrarProductos(this.productos);
                    //console.log("mn.vec_prds: "+mn.vec_prds);
                    rl1.question("Seleccione numero de producto: ", (index) => {
                        rl1.question("Ingrese cantidad: ", (cantidad) => {
                            this.carro.agregarItem(
                               this.productos[parseInt(index) - 1], 
                                parseInt(cantidad)
                            );
                            this.menuOperaciones(rl1, mn);
                        });
                    });
                    break;
                case "2":
                    this.carro.mostrarCarro();
                    this.menuOperaciones(rl1, mn);
                    break;
                case "3":
                    this.productos=mn.vec_prds;
                    this.guardaVentas(this.carro.checkout(this.productos, this.empleadoActivo, this.registro_ventas));
                    this.registro_ventas=this.cargaVentas();
                    mn.menuPrincipal();
                    break;
                case "4":
                    this.empleadoActivo = null;
                    mn.menuPrincipal();
                    break;
                default:
                    this.menuOperaciones(rl1, mn);
            }
        });
    }
}

module.exports = {Tienda }