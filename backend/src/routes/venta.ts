import { Router } from "express";
import { VentaController } from "../controllers/venta.controller";

const router = Router();
const ventaController = new VentaController();

router.get('/', ventaController.getAllVentas);
router.get('/:id', ventaController.getVentaById);
router.post('/', ventaController.createVenta);
// Añadir rutas para update/delete si son necesarias

export default router;
