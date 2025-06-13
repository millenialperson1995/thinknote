// src/controllers/NotesController.js
import mongoose from "mongoose";
import { statusCode } from "../constants/statusCodes.js";
import { z } from "zod";
import Note from "../models/Note.js";
import { get, set, del } from "../utils/inMemoryCache.js";

// Schema de validação com Zod
const createNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(100),
  content: z.string().min(1, { message: "Content is required" }).max(1000),
});

const CACHE_KEY = "notes:all";
const CACHE_TTL = 59; // segundos

export default class NotesController {
  async getAllNotes(_, res) {
  try {
    const cachedNotes = get(CACHE_KEY);

    if (cachedNotes) {
      return res.status(statusCode.OK.code).json({
        message: statusCode.OK.message,
        data: cachedNotes,
        fromCache: true,
      });
    }

    const notes = await Note.find().lean().sort({ createdAt: -1 }); // ✅ Do mais novo ao mais antigo
    set(CACHE_KEY, notes, CACHE_TTL);

    return res.status(statusCode.OK.code).json({
      message: statusCode.OK.message,
      data: notes,
      fromCache: false,
    });
    } catch (error) {
      console.error("Error in getAllNotes controller: ", error);
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: statusCode.INTERNAL_SERVER_ERROR.message,
        error: error.message,
      });
    }
  }

  getNoteById = async (req, res) => {
    try {
      const { id } = req.params;

      // Verifica se o ID é válido
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(statusCode.BAD_REQUEST.code).json({
          message: statusCode.BAD_REQUEST.message,
          error: "Invalid note ID",
        });
      }

      const cacheKey = `notes:${id}`;
      const cachedNote = get(cacheKey);

      if (cachedNote) {
        return res.status(statusCode.OK.code).json({
          message: statusCode.OK.message,
          data: cachedNote,
          fromCache: true,
        });
      }

      const note = await Note.findById(id).lean();

      if (!note) {
        return res.status(statusCode.NOT_FOUND.code).json({
          message: statusCode.NOT_FOUND.message,
        });
      }

      set(cacheKey, note, CACHE_TTL);

      return res.status(statusCode.OK.code).json({
        message: statusCode.OK.message,
        data: note,
        fromCache: false,
      });
    } catch (error) {
      console.error("Error in getNoteById controller: ", error);
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: statusCode.INTERNAL_SERVER_ERROR.message,
        error: error.message,
      });
    }
  };

  createNote = async (req, res) => {
    try {
      const result = createNoteSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(statusCode.BAD_REQUEST.code).json({
          message: statusCode.BAD_REQUEST.message,
          error: result.error.issues[0].message,
        });
      }

      const { title, content } = result.data;

      const existingNote = await Note.findOne({ title, content }).lean();

      if (existingNote) {
        return res.status(statusCode.CONFLICT.code).json({
          message: "Duplicate note detected",
          error: "A note with the same title and content already exists",
        });
      }

      const newNote = await Note.create({ title, content });

      del(CACHE_KEY); // Invalida o cache após criar uma nova nota

      return res.status(statusCode.CREATED.code).json({
        message: statusCode.CREATED.message,
        data: newNote,
      });
    } catch (error) {
      console.error("Error in createNote controller: ", error);
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: statusCode.INTERNAL_SERVER_ERROR.message,
        error: error.message,
      });
    }
  };

  updateNote = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      const updatedNote = await Note.findByIdAndUpdate(
        id,
        { title, content },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedNote) {
        return res.status(statusCode.NOT_FOUND.code).json({
          message: statusCode.NOT_FOUND.message,
        });
      }

      del(CACHE_KEY); // Invalida o cache após atualizar
      del(`notes:${id}`); // Também invalida o cache específico da nota

      return res.status(statusCode.OK.code).json({
        message: statusCode.OK.message,
        data: updatedNote,
      });
    } catch (error) {
      console.error("Error in updateNote controller: ", error);
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: statusCode.INTERNAL_SERVER_ERROR.message,
        error: error.message,
      });
    }
  };

  deleteNote = async (req, res) => {
    try {
      const { id } = req.params;

      const deletedNote = await Note.findByIdAndDelete(id).lean();

      if (!deletedNote) {
        return res.status(statusCode.NOT_FOUND.code).json({
          message: statusCode.NOT_FOUND.message,
        });
      }

      del(CACHE_KEY); // Invalida o cache principal
      del(`notes:${id}`); // Invalida o cache específico da nota

      return res.status(statusCode.OK.code).json({
        message: statusCode.OK.message,
        data: deletedNote,
      });
    } catch (error) {
      console.error("Error in deleteNote controller: ", error);
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: statusCode.INTERNAL_SERVER_ERROR.message,
        error: error.message,
      });
    }
  };
}