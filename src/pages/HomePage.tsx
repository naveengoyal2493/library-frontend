import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddBookModal from "../components/AddBookModal";
import AddMemberModal from "../components/AddMemberModal";

type Book = {
id: number;
title: string;
author: string;
copies: number;
};

type Member = {
id: number;
name: string;
email: string;
mobile: string;
};

export default function HomePage() {
const [books, setBooks] = useState<Book[]>([]);
const [members, setMembers] = useState<Member[]>([]);
const [loading, setLoading] = useState(true);
const [showAddBook, setShowAddBook] = useState(false);
const [showAddMember, setShowAddMember] = useState(false);

const navigate = useNavigate();

const handleDelete = async (bookId: number) => {
const confirmDelete = window.confirm(
  "Are you sure you want to delete this book?"
);

if (!confirmDelete) return;

try {
  const res = await fetch(
    `http://localhost:8000/books/${bookId}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to delete");
  }

  fetchDashboardData();

} catch (err) {
  if (err instanceof Error) {
    alert(err.message);
  }
}
};

const fetchDashboardData = async () => {
try {
const [booksRes, membersRes] = await Promise.all([
fetch("http://localhost:8000/books/"),
fetch("http://localhost:8000/members/"),
]);

  if (!booksRes.ok || !membersRes.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  const booksData = await booksRes.json();
  const membersData = await membersRes.json();

  setBooks(
    Array.isArray(booksData)
      ? booksData
      : booksData.books ?? []
  );

  setMembers(
    Array.isArray(membersData)
      ? membersData
      : membersData.members ?? []
  );

} catch (err) {
  console.error("Dashboard fetch failed:", err);
  setBooks([]);
  setMembers([]);
} finally {
  setLoading(false);
}

};

useEffect(() => {
fetchDashboardData();
}, []);

if (loading) {
return <p style={{ padding: 40 }}>Loading dashboard...</p>;
}

return (
<div style={{ padding: "40px", maxWidth: "1100px", margin: "0 auto" }}>

  {/* Header */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
    }}
  >
    <h1>Library Dashboard</h1>

    <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setShowAddBook(true)}>
          Add Book
        </button>
        <button onClick={() => setShowAddMember(true)}>
          Add Member
        </button>
    </div>
  </div>

  {/* BOOKS */}
  <h2>Books</h2>

  {books.length === 0 ? (
    <p>No books found.</p>
  ) : (
    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
      <thead>
        <tr style={{ background: "#f5f5f5" }}>
          <th style={thStyle}>Title</th>
          <th style={thStyle}>Author</th>
          <th style={thStyle}>Copies</th>
          <th style={thStyle}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {books.map((book) => (
          <tr key={book.id}>
            <td style={tdStyle}>{book.title}</td>
            <td style={tdStyle}>{book.author}</td>
            <td style={tdStyle}>{book.copies}</td>
            <td style={tdStyle}>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => navigate(`/edit-book/${book.id}`)}>
                Update
              </button>
            <button style={{ background: "#ff4d4f", color: "white", border: "none", padding: "6px 10px", cursor: "pointer", borderRadius: "4px", }} onClick={() => handleDelete(book.id)} > Delete </button>
            </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}

  {/* MEMBERS */}
  <h2>Members</h2>

  {members.length === 0 ? (
    <p>No members found.</p>
  ) : (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#f5f5f5" }}>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Email</th>
          <th style={thStyle}>Mobile</th>
          <th style={thStyle}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {members.map((member) => (
          <tr key={member.id}>
            <td style={tdStyle}>{member.name}</td>
            <td style={tdStyle}>{member.email}</td>
            <td style={tdStyle}>{member.mobile}</td>
            <td style={tdStyle}>
              <button onClick={() => navigate(`/edit-member/${member.id}`)}>
                Update
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}

    {showAddBook && (
      <AddBookModal
        onClose={() => setShowAddBook(false)}
        onSuccess={fetchDashboardData} // refresh table
      />
    )}

    {showAddMember && (
      <AddMemberModal
        onClose={() => setShowAddMember(false)}
        onSuccess={fetchDashboardData} // refresh table
      />
    )}

</div>
);
}

const thStyle: React.CSSProperties = {
border: "1px solid #ddd",
padding: "12px",
textAlign: "left",
};

const tdStyle: React.CSSProperties = {
border: "1px solid #ddd",
padding: "12px",
};