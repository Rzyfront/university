import { Router } from 'express';
import clienteRoutes from './cliente'; // Import client routes
// Import other resource routes here (e.g., import ventaRoutes from './venta';)

const router = Router();

// Mount resource routes
router.use('/clientes', clienteRoutes);
// router.use('/ventas', ventaRoutes); // Example for another resource

export default router;
