import { Request, Response } from "express";
import { Producto, ProductoI } from "../models/Producto";
import { TipoProducto } from "../models/TipoProducto"; // Importar TipoProducto si se necesita incluir en las respuestas

export class ProductoController {

  // GET all active products
  public async getAllProductos(req: Request, res: Response): Promise<void> {
    try {
      const productos: ProductoI[] = await Producto.findAll({
        where: { estado: 'ACTIVO' },
        include: [{ model: TipoProducto, attributes: ['name'] }] // Use 'name' from TipoProducto
      });
      res.status(200).json({ productos });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ msg: "Error interno del servidor al obtener productos" });
    }
  }

  // GET product by ID
  public async getProductoById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const producto: Producto | null = await Producto.findByPk(id, {
        include: [{ model: TipoProducto, attributes: ['name'] }] // Use 'name'
      });

      if (producto && producto.estado === 'ACTIVO') {
        res.status(200).json({ producto });
      } else if (producto && producto.estado === 'INACTIVO') {
        res.status(404).json({ msg: "Producto no encontrado (inactivo)" });
      } else {
        res.status(404).json({ msg: "Producto no encontrado" });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ msg: "Error interno del servidor al obtener el producto" });
    }
  }

  // POST create new product
  public async createProducto(req: Request, res: Response): Promise<void> {
    const body: ProductoI = req.body;
    try {
      // Basic validation
      if (!body.nombre || !body.marca || !body.cantidad || !body.precio || !body.Tipoproductoid) { // Use 'cantidad' and 'Tipoproductoid'
        res.status(400).json({ msg: "Faltan campos requeridos" });
        return;
      }
      // Verify Tipoproductoid exists
      const tipoProductoExists = await TipoProducto.findByPk(body.Tipoproductoid); // Use 'Tipoproductoid'
      if (!tipoProductoExists || tipoProductoExists.estado !== 'ACTIVO') {
          res.status(404).json({ msg: "Tipo de Producto no encontrado o inactivo" });
          return;
      }

      const nuevoProducto = await Producto.create(body);
      res.status(201).json({ producto: nuevoProducto });
    } catch (error: any) {
      console.error("Error creating product:", error);
       if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ msg: "Error de Validación", errors: error.errors.map((e: any) => e.message) });
      } else {
        res.status(500).json({ msg: "Error interno del servidor al crear producto" });
      }
    }
  }

  // PATCH update product by ID
  public async updateProducto(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const body: Partial<ProductoI> = req.body;
    try {
      const productoExistente = await Producto.findByPk(id);

      if (!productoExistente) {
        res.status(404).json({ msg: "Producto no encontrado" });
        return;
      }

      // If Tipoproductoid is being updated, verify it exists and is active
      if (body.Tipoproductoid) { // Use 'Tipoproductoid'
          const tipoProductoExists = await TipoProducto.findByPk(body.Tipoproductoid); // Use 'Tipoproductoid'
          if (!tipoProductoExists || tipoProductoExists.estado !== 'ACTIVO') {
              res.status(404).json({ msg: "Tipo de Producto no encontrado o inactivo" });
              return;
          }
      }

      // Prevent changing estado directly via this method
      delete body.estado;

      await productoExistente.update(body);
      // Fetch again to include TipoProducto name
      const productoActualizado = await Producto.findByPk(id, {
          include: [{ model: TipoProducto, attributes: ['name'] }] // Use 'name'
      });
      res.status(200).json({ producto: productoActualizado });

    } catch (error: any) {
      console.error("Error updating product:", error);
      if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ msg: "Error de Validación", errors: error.errors.map((e: any) => e.message) });
      } else {
        res.status(500).json({ msg: "Error interno del servidor al actualizar producto" });
      }
    }
  }

  // DELETE (logical delete) product by ID
  public async deleteProducto(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const productoExistente = await Producto.findByPk(id);

      if (!productoExistente) {
        res.status(404).json({ msg: "Producto no encontrado" });
        return;
      }

      if (productoExistente.estado === 'INACTIVO') {
         res.status(400).json({ msg: "Producto ya está inactivo" });
         return;
      }

      await productoExistente.update({ estado: 'INACTIVO' });
      res.status(200).json({ msg: "Producto desactivado correctamente" });

    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ msg: "Error interno del servidor al eliminar producto" });
    }
  }
}
