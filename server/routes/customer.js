import express from "express";
import auth, { checkPermission } from "../middleware/auth.js";
import * as customer from "../controller/customer.js";

const router = express.Router();

router.post(`/`, auth, customer.addCustomer);
router.get(`/`, auth, customer.getCustomers);
router.get('/:id', auth, customer.getDetailedCustomerDetails);

router.patch('/:id', auth, checkPermission, customer.updateCustomer);
router.delete('/:id', auth, customer.deleteCustomer);

export default router;