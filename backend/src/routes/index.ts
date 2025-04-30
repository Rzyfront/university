import { Router } from "express";
import clienteRoutes from "./cliente";
import productoRoutes from "./producto"; // Importar rutas de producto
import tipoProductoRoutes from "./tipoProducto"; // Importar rutas de tipo producto
import ventaRoutes from "./venta"; // Importar rutas de venta

const router = Router();

// Definir las rutas base para cada entidad
router.use('/clientes', clienteRoutes);
router.use('/productos', productoRoutes);
router.use('/tipos-producto', tipoProductoRoutes);
router.use('/ventas', ventaRoutes);

export default router;
