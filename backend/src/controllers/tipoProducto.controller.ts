import { Request, Response } from "express";
import { TipoProducto, TipoProductoI } from "../models/TipoProducto";

export class TipoProductoController {

  // GET all active product types
  public async getAllTipoProductos(req: Request, res: Response): Promise<void> {
    try {
      const tiposProducto: TipoProductoI[] = await TipoProducto.findAll({ where: { estado: 'ACTIVO' } });
      res.status(200).json({ tiposProducto });
    } catch (error) {
      console.error("Error fetching product types:", error);
      res.status(500).json({ msg: "Error interno del servidor al obtener tipos de producto" });
    }
  }

  // GET product type by ID
  public async getTipoProductoById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const tipoProducto: TipoProducto | null = await TipoProducto.findByPk(id);

      if (tipoProducto && tipoProducto.estado === 'ACTIVO') {
        res.status(200).json({ tipoProducto });
      } else if (tipoProducto && tipoProducto.estado === 'INACTIVO') {
        res.status(404).json({ msg: "Tipo de Producto no encontrado (inactivo)" });
      } else {
        res.status(404).json({ msg: "Tipo de Producto no encontrado" });
      }
    } catch (error) {
      console.error("Error fetching product type:", error);
      res.status(500).json({ msg: "Error interno del servidor al obtener el tipo de producto" });
    }
  }

  // POST create new product type
  public async createTipoProducto(req: Request, res: Response): Promise<void> {
    const body: TipoProductoI = req.body;
    try {
      // Basic validation
      if (!body.name) {
        res.status(400).json({ msg: "Falta el campo nombre" });
        return;
      }

      const nuevoTipoProducto = await TipoProducto.create(body);
      res.status(201).json({ tipoProducto: nuevoTipoProducto });
    } catch (error: any) {
      console.error("Error creating product type:", error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({ msg: "Error: El nombre del tipo de producto ya existe" });
      } else if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ msg: "Error de Validación", errors: error.errors.map((e: any) => e.message) });
      } else {
        res.status(500).json({ msg: "Error interno del servidor al crear tipo de producto" });
      }
    }
  }

  // PATCH update product type by ID
  public async updateTipoProducto(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const body: Partial<TipoProductoI> = req.body;
    try {
      const tipoProductoExistente = await TipoProducto.findByPk(id);

      if (!tipoProductoExistente) {
        res.status(404).json({ msg: "Tipo de Producto no encontrado" });
        return;
      }

      // Prevent changing estado directly
      delete body.estado;

      await tipoProductoExistente.update(body);
      res.status(200).json({ tipoProducto: tipoProductoExistente });

    } catch (error: any) {
      console.error("Error updating product type:", error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({ msg: "Error: El nombre del tipo de producto ya existe" });
      } else if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ msg: "Error de Validación", errors: error.errors.map((e: any) => e.message) });
      } else {
        res.status(500).json({ msg: "Error interno del servidor al actualizar tipo de producto" });
      }
    }
  }

  // DELETE (logical delete) product type by ID
  public async deleteTipoProducto(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const tipoProductoExistente = await TipoProducto.findByPk(id);

      if (!tipoProductoExistente) {
        res.status(404).json({ msg: "Tipo de Producto no encontrado" });
        return;
      }

      if (tipoProductoExistente.estado === 'INACTIVO') {
         res.status(400).json({ msg: "Tipo de Producto ya está inactivo" });
         return;
      }

      // Check if any active products use this type before deactivating (optional but recommended)
      // const productsUsingType = await Producto.count({ where: { TipoProductoId: id, estado: 'ACTIVO' } });
      // if (productsUsingType > 0) {
      //   res.status(400).json({ msg: "No se puede desactivar, hay productos activos usando este tipo." });
      //   return;
      // }

      await tipoProductoExistente.update({ estado: 'INACTIVO' });
      res.status(200).json({ msg: "Tipo de Producto desactivado correctamente" });

    } catch (error) {
      console.error("Error deleting product type:", error);
      res.status(500).json({ msg: "Error interno del servidor al eliminar tipo de producto" });
    }
  }
}
