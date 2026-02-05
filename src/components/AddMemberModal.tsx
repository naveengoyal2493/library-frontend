import { useState } from "react";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddMemberModal({ onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/members/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          mobile,
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  };


  return (
    <div style={overlay} onClick={onClose}>
    <div
      style={modal}
      onClick={(e) => e.stopPropagation()}
    >
        <h2>Add Member</h2>
        {error && (
          <div style={{ color: "red", marginBottom: 1 }}>
            {error}
          </div>
        )}
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          placeholder="Mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          style={input}
        />
        <div style={{ display: "flex", gap: 10 }}>
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
