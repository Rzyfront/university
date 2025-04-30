import { DataTypes, Model, Optional, Sequelize } from "sequelize"; // Import Sequelize
import { TipoProducto } from "./TipoProducto"; // Import for association
import { ProductoVenta } from "./ProductoVenta"; // Import for association

// Interface defining the Producto model attributes
export interface ProductoI {
  id?: number;
  nombre: string;
  marca: string;
  precio: number;
  stockMin: number;
  cantidad: number;
  Tipoproductoid: number; // Foreign key for TipoProducto
}

// Define optional attributes for creation
interface ProductoCreationAttributes extends Optional<ProductoI, "id"> {}

// Sequelize Model for Producto
export class Producto extends Model<ProductoI, ProductoCreationAttributes> {
  public id!: number;
  public nombre!: string;
  public marca!: string;
  public precio!: number;
  public stockMin!: number;
  public cantidad!: number;
  public Tipoproductoid!: number; // Foreign key

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Add static initialize method
  public static initialize(sequelize: Sequelize): void {
    Producto.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nombre: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        marca: {
          type: DataTypes.STRING,
          allowNull: true, // Assuming marca can be optional
        },
        precio: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        stockMin: {
          type: DataTypes.FLOAT, // Consider INTEGER if stock is always whole numbers
          allowNull: false,
          defaultValue: 0,
        },
        cantidad: {
          type: DataTypes.FLOAT, // Consider INTEGER if quantity is always whole numbers
          allowNull: false,
          defaultValue: 0,
        },
        Tipoproductoid: { // Foreign key definition
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: TipoProducto,
            key: 'id',
          },
        },
      },
      {
        sequelize, // Use the passed instance
        modelName: "Producto", // Model name
        tableName: "productos", // Table name in the database
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
      }
    );
  }

  // Define associations here or separately
  public static associate(models: any) {
    Producto.belongsTo(models.TipoProducto, { foreignKey: 'Tipoproductoid' });
    Producto.hasMany(models.ProductoVenta, { foreignKey: 'ProductoId' });
  }
}
