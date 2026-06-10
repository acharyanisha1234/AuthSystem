import express from 'express'; 
import { verifyRole, verifyToken } from '../middleware/authMiddleware';
import { deleteUser } from '../controllers/userController';

const router = express.Router();

router.get("/", verifyToken, verifyRole("admin"), getUsers);

const router = express.Router();

router.get("/", verifyToken, verifyRole("admin"), getUsers);
router.delete("/:id", verifyToken, verifyRole("admin"), deleteUser);
router.get("/me",verifyToken, getProfile);

export default router;