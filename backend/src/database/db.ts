import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Import models
import { Cliente } from "../models/Cliente";
import { Producto } from "../models/Producto";
import { ProductoVenta } from "../models/ProductoVenta";
import { TipoProducto } from "../models/TipoProducto";
import { Venta } from "../models/Venta";

dotenv.config();

// Define database configurations for different engines
const dbConfig = {
  mysql: {
    dialect: "mysql",
    host: process.env.DB_HOST || "localhost",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Desarrollo123$%",
    port: parseInt(process.env.DB_PORT || "3306")
  },
  postgres: {
    dialect: "postgres",
    host: process.env.DB_HOST || "localhost",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Desarrollo123$%",
    port: parseInt(process.env.DB_PORT || "5432")
  },
  mssql: {
    dialect: "mssql",
    host: process.env.DB_HOST || "localhost",
    username: process.env.DB_USER || "sa",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Desarrollo123$%",
    port: parseInt(process.env.DB_PORT || "1433")
  },
  oracle: {
    dialect: "oracle",
    host: process.env.DB_HOST || "localhost",
    username: process.env.DB_USER || "oracle",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Desarrollo123$%",
    port: parseInt(process.env.DB_PORT || "1521")
  },
};

// Select the database engine from environment variables, default to mysql
const dbEngine = process.env.DB_ENGINE || "mysql";
const config = dbConfig[dbEngine as keyof typeof dbConfig];

if (!config) {
  throw new Error(`Unsupported DB_ENGINE: ${dbEngine}`);
}

// Create the Sequelize instance
export const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect as any, // Cast dialect to any to satisfy Sequelize options type
  port: config.port,
  logging: false, // Disable logging SQL queries or set to console.log for debugging
});

// Function to connect and sync the database
export const connectDB = async () => {
  try {
    await sequelize.authenticate(); // Test the connection
    console.log('Database authenticated successfully.');

    // Initialize models
    Cliente.initialize(sequelize);
    TipoProducto.initialize(sequelize);
    Producto.initialize(sequelize); // Depends on TipoProducto
    Venta.initialize(sequelize); // Depends on Cliente
    ProductoVenta.initialize(sequelize); // Depends on Producto and Venta
    console.log("Models initialized.");

    // Define models object for associations
    const models = {
      Cliente,
      Producto,
      ProductoVenta,
      TipoProducto,
      Venta,
    };

    // Call associate methods *after* all models are initialized
    Object.values(models).forEach((model) => {
      if (model.associate) {
        model.associate(models);
      }
    });
    console.log("Model associations configured.");

    // Sync all models (after initialization and association)
    // Use { alter: true } in development to update tables without dropping data
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully.");

  } catch (error) {
    console.error("Unable to connect to the database, initialize models, or configure associations:", error);
    process.exit(1); // Exit process with failure
  }
};
