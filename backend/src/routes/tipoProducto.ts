import { Router } from "express";
import { TipoProductoController } from "../controllers/tipoProducto.controller";

const router = Router();
const tipoProductoController = new TipoProductoController();

router.get('/', tipoProductoController.getAllTipoProductos);
router.get('/:id', tipoProductoController.getTipoProductoById);
router.post('/', tipoProductoController.createTipoProducto);
router.patch('/:id', tipoProductoController.updateTipoProducto);
router.delete('/:id', tipoProductoController.deleteTipoProducto);

export default router;
