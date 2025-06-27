// Clase para representar un Usuario de la biblioteca
class Usuario {
  constructor(id, nombre, email) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.librosEnPrestamo = [];
    this.historial = [];
  }

  solicitarPrestamo(libro) {
    if (libro.disponible) {
      this.librosEnPrestamo.push(libro);
      this.historial.push({
        libro: libro.titulo,
        accion: 'préstamo',
        fecha: new Date()
      });
      return true;
    }
    return false;
  }

  devolverLibro(libro) {
    //const index = this.librosEnPrestamo.findIndex(l => l.id === libro.id);
    let index = -1;
    for (let i = 0; i < this.librosEnPrestamo.length; i++) {
        if (this.librosEnPrestamo[i].id === libro.id) {
            index = i;
            break;
            }
        }
    if (index !== -1) {
      this.librosEnPrestamo.splice(index, 1); // elimina del array el libro que coincide con el libro.id que estábamos buscando.
      this.historial.push({
        libro: libro.titulo,
        accion: 'devolución',
        fecha: new Date()
      });
      return true;
    }
    return false;
  }

  getLibrosPrestados() {
    return this.librosEnPrestamo;
  }

  getHistorial() {
    return this.historial;
  }
}

// Clase para representar un Autor
class Autor {
  constructor(id, nombre, nacionalidad) {
    this.id = id;
    this.nombre = nombre;
    this.nacionalidad = nacionalidad;
    this.bibliografia = [];
  }

  agregarLibro(libro) {
    this.bibliografia.push(libro);
  }

  getBibliografia() {
    return this.bibliografia;
  }
}

// Clase para representar Categorías de libros
class Categoria {
  constructor(id, nombre, descripcion) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.libros = [];
  }

  agregarLibro(libro) {
    this.libros.push(libro);
  }

  getLibros() {
    return this.libros;
  }
}

// Clase para representar un Libro
class Libro {
  constructor(id, titulo, autor, año, editorial, isbn) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor; // Objeto de tipo Autor
    this.año = año;
    this.editorial = editorial;
    this.isbn = isbn;
    this.categorias = [];
    this.disponible = true;
    this.fechaUltimoPrestamo = null;
    this.prestamosCount = 0;
    this.calificaciones = [];
    
    // Automáticamente agregar este libro a la bibliografía del autor
    if (autor instanceof Autor) {  // instanceof es un operador que comprueba si un objeto es una instancia de una clase específica. Esta condición verifica si el parámetro autor que se pasó al constructor es realmente una instancia de la clase Autor
      autor.agregarLibro(this);
    }
  }

  asignarCategoria(categoria) {
    this.categorias.push(categoria);
    categoria.agregarLibro(this);
  }

  prestar() {
    if (this.disponible) {
      this.disponible = false;
      this.fechaUltimoPrestamo = new Date();
      this.prestamosCount++;
      return true;
    }
    return false;
  }

  devolver() {
    if (!this.disponible) {
      this.disponible = true;
      return true;
    }
    return false;
  }

  agregarCalificacion(valor, comentario = "") {
    if (valor >= 1 && valor <= 5) {
      this.calificaciones.push({ valor, comentario, fecha: new Date() });
      return true;
    }
    return false;
  }

  getCalificacionPromedio() {
    if (this.calificaciones.length === 0) return 0;
    const suma = this.calificaciones.reduce((acc, cal) => acc + cal.valor, 0);
    return suma / this.calificaciones.length;
  }
}

// Clase para gestionar los préstamos
class GestorPrestamos {
  constructor() {
    this.prestamos = [];
  }

  registrarPrestamo(libro, usuario, fechaDevolucion) {
    if (libro.prestar()) {
      const prestamo = {
        id: this.prestamos.length + 1,
        libro,
        usuario,
        fechaPrestamo: new Date(),
        fechaDevolucion,
        devuelto: false
      };
      
      this.prestamos.push(prestamo);
      usuario.solicitarPrestamo(libro);
      return prestamo;
    }
    return null;
  }

  procesarDevolucion(prestamoId) {
    //const prestamo = this.prestamos.find(p => p.id === prestamoId);
    let prestamo = null;
    for (var i = 0; i < this.prestamos.length; i++) {
        if (this.prestamos[i].id === prestamoId) {
            prestamo = this.prestamos[i];
            break;
            }
        }
    if (prestamo && !prestamo.devuelto) {
      prestamo.devuelto = true;
      prestamo.fechaDevolucionReal = new Date();
      prestamo.libro.devolver();
      prestamo.usuario.devolverLibro(prestamo.libro);
      
      const diasRetraso = this.calcularDiasRetraso(prestamo);
      return { exitoso: true, diasRetraso };
    }
    return { exitoso: false };
  }


  calcularDiasRetraso(prestamo) {
    if (!prestamo.devuelto) return 0;
    
    const fechaDevolucionPrevista = new Date(prestamo.fechaDevolucion);
    const fechaDevolucionReal = new Date(prestamo.fechaDevolucionReal);
    const diferencia = fechaDevolucionReal - fechaDevolucionPrevista;
    const diasRetraso = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    
    return diasRetraso > 0 ? diasRetraso : 0;
  }


  getPrestamosPendientes() {
    return this.prestamos.filter(p => !p.devuelto);
  }

  getPrestamosVencidos() {
    const hoy = new Date();
    /*  filter devuelve los préstamos que cumplen las condiciones: no han sido devueltos (!p.devuelto) y su fecha de devolución es anterior a la fecha actual
    return this.prestamos.filter(p => {
      return !p.devuelto && new Date(p.fechaDevolucion) < hoy;
    });
    */
   let prestamosVencidos = [];
    for (let i = 0; i < this.prestamos.length; i++) {
        let prestamo = this.prestamos[i];
        if (!prestamo.devuelto) {
            let fechaDevolucion = new Date(prestamo.fechaDevolucion);
            if (fechaDevolucion < hoy) {
                prestamosVencidos.push(prestamo);
                }
            }
        }
    return prestamosVencidos;
  }
}

// Clase principal Biblioteca
class Biblioteca {
  constructor(nombre, direccion) {
    this.nombre = nombre;
    this.direccion = direccion;
    this.libros = [];
    this.autores = [];
    this.categorias = [];
    this.usuarios = [];
    this.gestorPrestamos = new GestorPrestamos();
  }

  agregarLibro(libro) {
    if (libro instanceof Libro) {
      this.libros.push(libro);
      return true;
    }
    return false;
  }

  eliminarLibro(libroId) {
    const index = this.libros.findIndex(l => l.id === libroId); //busca coincidencia de id
    if (index !== -1) {
      this.libros.splice(index, 1);
      return true;
    }
    return false;
  }

  agregarAutor(autor) {
    if (autor instanceof Autor) {
      this.autores.push(autor);
      return true;
    }
    return false;
  }

  agregarCategoria(categoria) {
    if (categoria instanceof Categoria) {
      this.categorias.push(categoria);
      return true;
    }
    return false;
  }

  registrarUsuario(usuario) {
    if (usuario instanceof Usuario) {
      this.usuarios.push(usuario);
      return true;
    }
    return false;
  }

  buscarLibrosPorTitulo(termino) {
    termino = termino.toLowerCase();
    /*
    return this.libros.filter (libro => 
      libro.titulo.toLowerCase().includes(termino)
    );
    */

    let resultados = [];
    for (let i = 0; i < this.libros.length; i++) {
        let libro = this.libros[i];
        if (libro.titulo.toLowerCase().includes(termino)) {
            resultados.push(libro);
            }
        }
return resultados;   

  }

  buscarLibrosPorAutor(autorId) {
    return this.libros.filter(libro => libro.autor.id === autorId);
  }

  buscarLibrosPorCategoria(categoriaId) {
    return this.libros.filter(libro => 
      libro.categorias.some(cat => cat.id === categoriaId)
    );
  }

  listarLibrosDisponibles() {
    return this.libros.filter(libro => libro.disponible);
  }

  prestarLibro(libroId, usuarioId, diasPrestamo = 14) {
    const libro = this.libros.find(l => l.id === libroId);
    const usuario = this.usuarios.find(u => u.id === usuarioId);
    
    if (!libro || !usuario) return null;
    
    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(fechaDevolucion.getDate() + diasPrestamo);
    
    return this.gestorPrestamos.registrarPrestamo(libro, usuario, fechaDevolucion);
  }

  devolverLibro(prestamoId) {
    return this.gestorPrestamos.procesarDevolucion(prestamoId);
  }

  getEstadisticasLibro(libroId) {
    const libro = this.libros.find(l => l.id === libroId);
    if (!libro) return null;
    
    return {
      titulo: libro.titulo,
      autor: libro.autor.nombre,
      prestamos: libro.prestamosCount,
      calificacionPromedio: libro.getCalificacionPromedio(),
      numCalificaciones: libro.calificaciones.length
    };
  }

  generarReportePrestamos() {
    const prestamos = this.gestorPrestamos.getPrestamosPendientes();
    const vencidos = this.gestorPrestamos.getPrestamosVencidos();
    
    return {
      totalPrestamos: prestamos.length,
      prestamosVencidos: vencidos.length,
      listaPrestamos: prestamos.map(p => ({
        id: p.id,
        libro: p.libro.titulo,
        usuario: p.usuario.nombre,
        fechaPrestamo: p.fechaPrestamo,
        fechaDevolucion: p.fechaDevolucion
      }))
    };
  }
}





// Ejemplo de uso del sistema
function ejemploUso() {
  // Crear la biblioteca
  const miBiblioteca = new Biblioteca("Biblioteca Central", "Avenida Principal 123");
  
  // Crear autores
  const autor1 = new Autor(1, "Gabriel García Márquez", "Colombiana");
  const autor2 = new Autor(2, "Isabel Allende", "Chilena");
  
  miBiblioteca.agregarAutor(autor1);
  miBiblioteca.agregarAutor(autor2);
  
  // Crear categorías
  const categoria1 = new Categoria(1, "Novela", "Obras literarias de ficción en prosa");
  const categoria2 = new Categoria(2, "Realismo mágico", "Estilo literario con elementos fantásticos");
  
  miBiblioteca.agregarCategoria(categoria1);
  miBiblioteca.agregarCategoria(categoria2);
  
  // Crear libros
  const libro1 = new Libro(1, "Cien años de soledad", autor1, 1967, "Sudamericana", "978-0307474728");
  const libro2 = new Libro(2, "La casa de los espíritus", autor2, 1982, "Plaza & Janés", "978-0525433477");
  
  libro1.asignarCategoria(categoria1);
  libro1.asignarCategoria(categoria2);
  libro2.asignarCategoria(categoria1);
  
  miBiblioteca.agregarLibro(libro1);
  miBiblioteca.agregarLibro(libro2);
  
  // Crear usuarios
  const usuario1 = new Usuario(1, "Juan Pérez", "juan@ejemplo.com");
  const usuario2 = new Usuario(2, "María González", "maria@ejemplo.com");
  
  miBiblioteca.registrarUsuario(usuario1);
  miBiblioteca.registrarUsuario(usuario2);
  
  // Realizar préstamos
  const prestamo1 = miBiblioteca.prestarLibro(1, 1, 7); // Libro 1 al usuario 1 por 7 días
  
  // Calificar libro
  libro2.agregarCalificacion(4, "Excelente libro, muy recomendado");
  libro2.agregarCalificacion(5, "Una obra maestra");
  
  // Generar reporte
  const reporte = miBiblioteca.generarReportePrestamos();
  console.log("Reporte de préstamos:", reporte);
  
  // Devolver libro
  const devolucion = miBiblioteca.devolverLibro(prestamo1.id);
  console.log("Devolución procesada:", devolucion);
  
  // Estadísticas de un libro
  const estadisticas = miBiblioteca.getEstadisticasLibro(2);
  console.log("Estadísticas del libro:", estadisticas);
}

// Ejecutar el ejemplo
 ejemploUso();