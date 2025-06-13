// src/routes/notesRoutes.js

import { Router } from "express";
import NotesController from "../controllers/notesController.js";
import rateLimiter from "../middleware/rateLimiter.js";

const notesController = new NotesController();

const router = Router();

router.get("/", rateLimiter, notesController.getAllNotes);         // Listar todas
router.get("/:id", rateLimiter, notesController.getNoteById);      // Buscar por ID
router.post("/", rateLimiter, notesController.createNote);         // Criar
router.put("/:id", notesController.updateNote);       // Atualizar
router.delete("/:id", notesController.deleteNote);    // Deletar

export default router;