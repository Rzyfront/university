import { Router } from 'express';
import { ClienteController } from '../controllers/cliente.controller';

const router = Router();
const clienteController = new ClienteController();

// Define routes for Cliente
router.get('/', clienteController.getAllClientes);
router.get('/:id', clienteController.getClienteById);
router.post('/', clienteController.createCliente);
router.patch('/:id', clienteController.updateCliente);
router.delete('/:id', clienteController.deleteCliente);

export default router;
