import { DataTypes, Model, Optional, Sequelize } from "sequelize"; // Import Sequelize
import { Producto } from "./Producto"; // Import for association
import { Venta } from "./Venta"; // Import for association

// Interface defining the ProductoVenta model attributes
export interface ProductoVentaI {
  id?: number;
  Cantidad: number; // Changed to number
  precio: number;   // Changed to number
  total: number;    // Changed to number
  ProductoId: number; // Foreign key for Producto
  VentaId: number;    // Foreign key for Venta
}

// Define optional attributes for creation
interface ProductoVentaCreationAttributes extends Optional<ProductoVentaI, "id"> {}

// Sequelize Model for ProductoVenta (Junction Table)
export class ProductoVenta extends Model<ProductoVentaI, ProductoVentaCreationAttributes> {
  public id!: number;
  public Cantidad!: number; // Changed to number
  public precio!: number;   // Changed to number
  public total!: number;    // Changed to number
  public ProductoId!: number; // Foreign key
  public VentaId!: number;    // Foreign key

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Add static initialize method
  public static initialize(sequelize: Sequelize): void {
    ProductoVenta.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        Cantidad: {
          type: DataTypes.INTEGER, // Changed to INTEGER (adjust if FLOAT needed)
          allowNull: false,
        },
        precio: {
          type: DataTypes.FLOAT, // Changed to FLOAT
          allowNull: false,
        },
        total: {
          type: DataTypes.FLOAT, // Changed to FLOAT
          allowNull: false,
        },
        ProductoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: Producto,
            key: 'id',
          },
        },
        VentaId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: Venta,
            key: 'id',
          },
        },
      },
      {
        sequelize, // Use the passed instance
        modelName: "ProductoVenta",
        tableName: "productoventas",
        timestamps: true,
      }
    );
  }

  public static associate(models: any) {
    ProductoVenta.belongsTo(models.Producto, { foreignKey: 'ProductoId' });
    ProductoVenta.belongsTo(models.Venta, { foreignKey: 'VentaId' });
  }
}
