import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Adiciona índice para melhorar a performance da ordenação por data
noteSchema.index({ createdAt: -1 }); // do mais novo ao mais antigo

const Note = mongoose.model("Note", noteSchema);

export default Note;