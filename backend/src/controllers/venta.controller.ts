import { Request, Response } from "express";
import { Venta, VentaI } from "../models/Venta";
import { Cliente } from "../models/Cliente";
import { Producto } from "../models/Producto";
import { ProductoVenta, ProductoVentaI } from "../models/ProductoVenta";
import { sequelize } from "../database/db"; // Correct import

interface ProductoVentaInput {
    ProductoId: number;
    Cantidad: number; // Use model field name and type
    precio: number;   // Use model field name and type
    total: number;    // Use model field name and type
}

interface CreateVentaBody {
    fechaVenta: string; // Use model field name
    subtotal: number;
    impuestos: number;
    descuentos: number;
    total: number;
    clientes_id: number; // Use model field name
    productos: ProductoVentaInput[];
}

export class VentaController {

    // GET all sales
    public async getAllVentas(req: Request, res: Response): Promise<void> {
        try {
            const ventas: Venta[] = await Venta.findAll({
                include: [
                    { model: Cliente, attributes: ['nombre', 'correo'] },
                    {
                        model: ProductoVenta,
                        include: [{ model: Producto, attributes: ['nombre', 'precio'] }]
                    }
                ]
            });
            res.status(200).json({ ventas });
        } catch (error) {
            console.error("Error fetching sales:", error);
            res.status(500).json({ msg: "Error interno del servidor al obtener ventas" });
        }
    }

    // GET sale by ID
    public async getVentaById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const venta: Venta | null = await Venta.findByPk(id, {
                include: [
                    { model: Cliente, attributes: ['nombre', 'correo'] },
                    {
                        model: ProductoVenta,
                        include: [{ model: Producto, attributes: ['nombre', 'precio'] }]
                    }
                ]
            });

            if (venta) {
                res.status(200).json({ venta });
            } else {
                res.status(404).json({ msg: "Venta no encontrada" });
            }
        } catch (error) {
            console.error("Error fetching sale:", error);
            res.status(500).json({ msg: "Error interno del servidor al obtener la venta" });
        }
    }

    // POST create new sale
    public async createVenta(req: Request, res: Response): Promise<void> {
        const body: CreateVentaBody = req.body;
        const transaction = await sequelize.transaction();

        try {
            // Basic validation
            if (!body.fechaVenta || !body.total || !body.clientes_id || !body.productos || body.productos.length === 0) {
                await transaction.rollback();
                res.status(400).json({ msg: "Faltan campos requeridos o lista de productos vacía" });
                return;
            }

            // Verify Client exists and is active
            const clienteExists = await Cliente.findByPk(body.clientes_id, { transaction });
            if (!clienteExists || clienteExists.estado !== 'ACTIVO') {
                await transaction.rollback();
                res.status(404).json({ msg: "Cliente no encontrado o inactivo" });
                return;
            }

            // Create the Venta record
            const nuevaVentaData = {
                fechaVenta: body.fechaVenta,
                subtotal: body.subtotal,
                impuestos: body.impuestos,
                descuentos: body.descuentos,
                total: body.total,
                clientes_id: body.clientes_id,
            };
            const nuevaVenta = await Venta.create(nuevaVentaData, { transaction });

            // Process each product in the sale
            for (const prodVenta of body.productos) {
                if (!prodVenta.ProductoId || !prodVenta.Cantidad || !prodVenta.precio || !prodVenta.total) {
                     await transaction.rollback();
                     res.status(400).json({ msg: `Datos incompletos para el producto ID ${prodVenta.ProductoId}` });
                     return;
                }

                const producto = await Producto.findByPk(prodVenta.ProductoId, { transaction });
                if (!producto || producto.estado !== 'ACTIVO') {
                    await transaction.rollback();
                    res.status(404).json({ msg: `Producto con ID ${prodVenta.ProductoId} no encontrado o inactivo` });
                    return;
                }

                // Check stock
                if (producto.cantidad < prodVenta.Cantidad) {
                    await transaction.rollback();
                    res.status(400).json({ msg: `Stock insuficiente para el producto ${producto.nombre} (ID: ${prodVenta.ProductoId}). Stock actual: ${producto.cantidad}` });
                    return;
                }

                // Create ProductoVenta record
                await ProductoVenta.create({
                    Cantidad: prodVenta.Cantidad,
                    precio: prodVenta.precio,
                    total: prodVenta.total,
                    VentaId: nuevaVenta.id,
                    ProductoId: prodVenta.ProductoId,
                }, { transaction });

                // Update product stock
                const nuevoStock = producto.cantidad - prodVenta.Cantidad;
                await producto.update({ cantidad: nuevoStock }, { transaction });
            }

            // If everything is ok, commit the transaction
            await transaction.commit();

            // Fetch the created sale with details to return
             const ventaCreada = await Venta.findByPk(nuevaVenta.id, {
                include: [
                    { model: Cliente, attributes: ['nombre', 'correo'] },
                    {
                        model: ProductoVenta,
                        include: [{ model: Producto, attributes: ['nombre', 'precio'] }]
                    }
                ]
            });

            res.status(201).json({ venta: ventaCreada });

        } catch (error: any) {
            await transaction.rollback();
            console.error("Error creating sale:", error);
             if (error.name === 'SequelizeValidationError') {
                res.status(400).json({ msg: "Error de Validación", errors: error.errors.map((e: any) => e.message) });
            } else {
                res.status(500).json({ msg: "Error interno del servidor al crear la venta" });
            }
        }
    }
}
