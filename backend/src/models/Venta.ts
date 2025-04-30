import { DataTypes, Model, Optional, Sequelize } from "sequelize"; // Import Sequelize
import { Cliente } from "./Cliente"; // Import Cliente for association
import { ProductoVenta } from "./ProductoVenta";

// Interface defining the Venta model attributes
export interface VentaI {
  id?: number;
  fechaVenta: string; // Consider using DataTypes.DATE if storing actual dates
  subtotal: number;
  impuestos: number;
  descuentos: number;
  total: number;
  clientes_id: number; // Foreign key for Cliente
}

// Define optional attributes for creation
interface VentaCreationAttributes extends Optional<VentaI, "id"> {}

// Sequelize Model for Venta
export class Venta extends Model<VentaI, VentaCreationAttributes> {
  public id!: number;
  public fechaVenta!: string;
  public subtotal!: number;
  public impuestos!: number;
  public descuentos!: number;
  public total!: number;
  public clientes_id!: number; // Foreign key

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Add static initialize method
  public static initialize(sequelize: Sequelize): void {
    Venta.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        fechaVenta: {
          type: DataTypes.STRING, // Consider DataTypes.DATE
          allowNull: false,
        },
        subtotal: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        impuestos: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        descuentos: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        total: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        clientes_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Cliente,
                key: 'id',
            },
        },
      },
      {
        sequelize, // Use the passed instance
        modelName: "Venta",
        tableName: "ventas",
        timestamps: true,
      }
    );
  }

  public static associate(models: any) {
    Venta.belongsTo(models.Cliente, { foreignKey: 'clientes_id' });
    Venta.hasMany(models.ProductoVenta, { foreignKey: 'VentaId' });
  }
}
