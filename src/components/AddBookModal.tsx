import { useState } from "react";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddBookModal({ onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/books/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
        }),
      });

        const data = await res.json();

    if (!res.ok) {

      let errorMessage = "Something went wrong";

      if (Array.isArray(data.detail)) {
        errorMessage = data.detail
          .map((err: any) => err.msg)
          .join(", ");
      }
      else if (typeof data.detail === "string") {
        errorMessage = data.detail;
      }

      throw new Error(errorMessage);
    }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
    <div
      style={modal}
      onClick={(e) => e.stopPropagation()}
    >
        <h2>Add Book</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={input}
        />

        <input
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={input}
        />

        <div style={{ display: "flex", gap: 10 }}>
            {error && (
              <p style={{ color: "red", marginBottom: 10 }}>
                {error}
              </p>
            )}
          <button onClick={handleSubmit}>Add</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal: React.CSSProperties = {
  background: "white",
  padding: 24,
  borderRadius: 10,
  width: 400,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const input: React.CSSProperties = {
  padding: 8,
};
