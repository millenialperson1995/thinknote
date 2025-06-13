import { NotebookIcon } from "lucide-react";
import { Link } from "react-router"

export default function NotesNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
      <NotebookIcon className="size-10 text-primary" />

      <h3 className="text-2xl font-bold">No notes yet</h3>

      <p className="text-base-content/70">
        Ready to organize your thoughts? Create your first note to get started on your journey.
      </p>

      <Link to={"/create"} className="btn btn-primary">
        Create Your First Note
      </Link>
    </div>
  );
}