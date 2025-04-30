import { DataTypes, Model, Sequelize } from "sequelize"; // Import Sequelize
import { Venta } from "./Venta"; // Import Venta for association

// Interface defining the Cliente model attributes
export interface ClienteI {
  id?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  password: string;
  estado: "ACTIVO" | "INACTIVO";
}

// Sequelize Model for Cliente
export class Cliente extends Model<ClienteI> {
  public id!: number;
  public nombre!: string;
  public direccion!: string;
  public telefono!: string;
  public correo!: string;
  public password!: string;
  public estado!: "ACTIVO" | "INACTIVO";

  // Add static initialize method
  public static initialize(sequelize: Sequelize): void {
    Cliente.init(
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
        direccion: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        telefono: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: "El teléfono no puede estar vacío" },
            len: { args: [7, 15], msg: "El teléfono debe tener entre 7 y 15 caracteres" },
          },
        },
        correo: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: { msg: "Debe ser un correo electrónico válido" },
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        estado: {
          type: DataTypes.ENUM("ACTIVO", "INACTIVO"),
          defaultValue: "ACTIVO",
          allowNull: false,
        },
      },
      {
        sequelize, // Use the passed instance
        modelName: "Cliente",
        tableName: "clientes",
        timestamps: true,
      }
    );
  }

  public static associate(models: any) {
    Cliente.hasMany(models.Venta, { foreignKey: 'clientes_id' });
  }
}
