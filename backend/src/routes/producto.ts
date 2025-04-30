import { Router } from "express";
import { ProductoController } from "../controllers/producto.controller";

const router = Router();
const productoController = new ProductoController();

router.get('/', productoController.getAllProductos);
router.get('/:id', productoController.getProductoById);
router.post('/', productoController.createProducto);
router.patch('/:id', productoController.updateProducto); // Usar PATCH para actualizaciones parciales
router.delete('/:id', productoController.deleteProducto); // DELETE para borrado lógico

export default router;
