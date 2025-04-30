import { Request, Response } from "express";
import { Cliente, ClienteI } from "../models/Cliente";

export class ClienteController {

  // GET all active clients
  public async getAllClientes(req: Request, res: Response): Promise<void> {
    try {
      const clientes: ClienteI[] = await Cliente.findAll({ where: { estado: 'ACTIVO' } });
      res.status(200).json({ clientes });
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ msg: "Error interno del servidor al obtener clientes" });
    }
  }

  // GET client by ID
  public async getClienteById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const cliente: ClienteI | null = await Cliente.findByPk(id);

      if (cliente && cliente.estado === 'ACTIVO') {
        res.status(200).json({ cliente });
      } else if (cliente && cliente.estado === 'INACTIVO') {
        res.status(404).json({ msg: "Cliente not found (inactive)" });
      } else {
        res.status(404).json({ msg: "Cliente not found" });
      }
    } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).json({ msg: "Error interno del servidor al obtener el cliente" });
    }
  }

  // POST create new client
  public async createCliente(req: Request, res: Response): Promise<void> {
    const body: ClienteI = req.body;
    try {
      // Basic validation (consider using a validation library like Joi or express-validator)
      if (!body.nombre || !body.telefono || !body.correo || !body.password) {
        res.status(400).json({ msg: "Missing required fields" });
        return;
      }

      const nuevoCliente = await Cliente.create(body);
      res.status(201).json({ cliente: nuevoCliente });
    } catch (error: any) {
      console.error("Error creating client:", error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({ msg: "Error: Correo electrónico ya existe" });
      } else if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ msg: "Validation Error", errors: error.errors.map((e: any) => e.message) });
      } else {
        res.status(500).json({ msg: "Error interno del servidor al crear cliente" });
      }
    }
  }

  // PATCH update client by ID
  public async updateCliente(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const body: Partial<ClienteI> = req.body; // Use Partial for updates
    try {
      const clienteExistente = await Cliente.findByPk(id);

      if (!clienteExistente) {
        res.status(404).json({ msg: "Cliente not found" });
        return;
      }

      // Prevent changing estado directly via this method if needed, handle separately
      // delete body.estado;

      await clienteExistente.update(body);
      res.status(200).json({ cliente: clienteExistente });

    } catch (error: any) {
      console.error("Error updating client:", error);
       if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({ msg: "Error: Correo electrónico ya existe" });
      } else if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ msg: "Validation Error", errors: error.errors.map((e: any) => e.message) });
      } else {
        res.status(500).json({ msg: "Error interno del servidor al actualizar cliente" });
      }
    }
  }

  // DELETE (logical delete) client by ID
  public async deleteCliente(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const clienteExistente = await Cliente.findByPk(id);

      if (!clienteExistente) {
        res.status(404).json({ msg: "Cliente not found" });
        return;
      }

      // Check if already inactive
      if (clienteExistente.estado === 'INACTIVO') {
         res.status(400).json({ msg: "Cliente already inactive" });
         return;
      }

      // Perform logical delete by setting estado to INACTIVO
      await clienteExistente.update({ estado: 'INACTIVO' });
      res.status(200).json({ msg: "Cliente deactivated successfully" });

    } catch (error) {
      console.error("Error deleting client:", error);
      res.status(500).json({ msg: "Error interno del servidor al eliminar cliente" });
    }
  }
}
