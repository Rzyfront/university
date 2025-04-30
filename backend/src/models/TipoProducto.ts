import { DataTypes, Model, Optional, Sequelize } from "sequelize"; // Import Sequelize
import { Producto } from "./Producto"; // Import for association

// Interface defining the TipoProducto model attributes
export interface TipoProductoI {
  id?: number;
  name: string;
  estado?: 'ACTIVO' | 'INACTIVO'; // Added estado
}

// Define optional attributes for creation
interface TipoProductoCreationAttributes extends Optional<TipoProductoI, "id" | "estado"> {} // Make estado optional on creation

// Sequelize Model for TipoProducto
export class TipoProducto extends Model<TipoProductoI, TipoProductoCreationAttributes> {
  public id!: number;
  public name!: string;
  public estado!: 'ACTIVO' | 'INACTIVO'; // Added estado

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Add static initialize method
  public static initialize(sequelize: Sequelize): void {
    TipoProducto.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true, // Assuming type names should be unique
        },
        estado: { // Added estado definition
          type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
          allowNull: false,
          defaultValue: 'ACTIVO',
        },
      },
      {
        sequelize, // Use the passed instance
        modelName: "TipoProducto", // Model name
        tableName: "tipoproductos", // Table name in the database
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
      }
    );
  }

  // Define associations here or separately
  public static associate(models: any) {
    TipoProducto.hasMany(models.Producto, { foreignKey: 'Tipoproductoid' });
  }
}
