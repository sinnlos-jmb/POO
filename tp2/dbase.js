const readline = require("readline");
const mariadb = require("mariadb");
const { Client } = require("pg");

// 🔹 Clase Base: Database
class Database {
    constructor(config) {
        this.config = config;
    }

    async conectar() {
        throw new Error("❌ El método conectar() debe ser implementado en la subclase.");
    }

    async crearTabla(nombre, columnas) {
        try {
            await this.conn.query(`CREATE TABLE IF NOT EXISTS ${nombre} (${columnas})`);
            console.log(`📄 Tabla '${nombre}' creada.`);
        } catch (error) {
            console.error("❌ Error al crear la tabla:", error);
        }
    }

    async cargarDatos(nombreTabla, datos) {
        try {
            const keys = Object.keys(datos).join(", ");
            const values = Object.values(datos).map(val => `'${val}'`).join(", ");
            await this.conn.query(`INSERT INTO ${nombreTabla} (${keys}) VALUES (${values})`);
            console.log(`📥 Datos insertados en '${nombreTabla}'.`);
        } catch (error) {
            console.error("❌ Error al cargar datos:", error);
        }
    }

    async ejecutarQuery(sql) {
        try {
            const resultados = await this.conn.query(sql);
            console.log("🔍 Resultados:", resultados);
            return resultados;
        } catch (error) {
            console.error("❌ Error al ejecutar query:", error);
        }
    }

    async cerrarConexion() {
        throw new Error("❌ El método cerrarConexion() debe ser implementado en la subclase.");
    }
}

// 🔹 Subclase: MariaDB es la extensión codigo abierto (open source) del proyecto mySql.
class MariaDBDatabase extends Database { 
    constructor(config) {
        super(config);
        this.pool = mariadb.createPool(config);
    }

    async conectar() {
        try {
            this.conn = await this.pool.getConnection();
            console.log("✅ Conectado a MariaDB");
        } catch (error) {
            console.error("❌ Error al conectar a MariaDB:", error);
        }
    }

    async cerrarConexion() {
        if (this.conn) {
            await this.conn.end();
            console.log("🔌 Conexión cerrada.");
        }
        if (this.pool) {
            await this.pool.end();
            console.log("🏁 Pool de conexiones cerrado.");
        }
    }
}

// 🔹 Subclase: PostgreSQLDatabase
class PostgreSQLDatabase extends Database {
    constructor(config) {
        super(config);
        this.client = new Client(config);
    }

    async conectar() {
        try {
            await this.client.connect();
            this.conn = this.client;
            console.log("✅ Conectado a PostgreSQL");
        } catch (error) {
            console.error("❌ Error al conectar a PostgreSQL:", error);
        }
    }

    async cerrarConexion() {
        if (this.conn) {
            await this.conn.end();
            console.log("🔌 Conexión a PostgreSQL cerrada.");
        }
    }
}

// 📌 Interfaz para que el usuario seleccione la base de datos
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function seleccionarBaseDeDatos() {
    rl.question("Selecciona la base de datos (1: MariaDB, 2: PostgreSQL): ", async (opcion) => {
        let db;
        
        if (opcion === "1") {
            db = new MariaDBDatabase({
                host: "localhost",
                user: "manu",
                password: "1234",
                database: "dbAmeca"
            });
        } else if (opcion === "2") {
            db = new PostgreSQLDatabase({
                host: "localhost",
                user: "sinnlos",
                password: "1234",
                database: "ifts16_test",
                port: 5432
            });
        } else {
            console.log("❌ Opción inválida.");
            rl.close();
            return;
        }

        await db.conectar();
        await db.crearTabla("usuarios", "id SERIAL PRIMARY KEY, nombre VARCHAR(50), edad INT");
        await db.cargarDatos("usuarios", { nombre: "Pedro", edad: 42 });
        await db.ejecutarQuery("SELECT * FROM usuarios");

        await db.cerrarConexion();
        rl.close();
    });
}

// Iniciar el programa
seleccionarBaseDeDatos();
