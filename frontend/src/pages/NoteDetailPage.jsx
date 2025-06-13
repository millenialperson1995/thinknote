import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import api from "../lib/axios";
import toast, { LoaderIcon } from "react-hot-toast";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";

export default function NoteDetailPage() {
  const [note, setNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // Carrega a nota ao montar o componente
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data.data);
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Failed to load note!");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  // Exclui a nota com confirmação
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note!");
    }
  };

  // Salva as alterações da nota
  const handleSave = async () => {
    if (!note.title || !note.content) {
      toast.error("Please fill in all fields!");
      return;
    }
    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note!");
    } finally {
      setSaving(false);
    }
  };

  // Estado de carregamento inicial
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost gap-2">
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Notes
            </Link>
            <button onClick={handleDelete} className="btn btn-error btn-outline gap-2">
              <Trash2Icon className="w-5 h-5" />
              Delete Note
            </button>
          </div>

          {/* Card da Nota */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              {/* Campo Título */}
              <div className="form-control mb-4 w-full">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="input input-bordered w-full"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              {/* Campo Conteúdo */}
              <div className="form-control mb-4 w-full">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered w-full h-32"
                  value={note.content}
                  onChange={(e) => setNote({ ...note, content: e.target.value })}
                />
              </div>

              {/* Ações */}
              <div className="card-actions justify-end mt-4">
                <button
                  className={`btn btn-primary ${saving ? "btn-disabled loading" : ""}`}
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}