import { useEffect, useState } from "react";
import AddBookModal from "../components/AddBookModal";
import AddMemberModal from "../components/AddMemberModal";
import EntityFormModal from "../components/EntityFormModal";

/* -------------------- TYPES -------------------- */

type Book = {
  id: number;
  title: string;
  author: string;
};

type Member = {
  id: number;
  name: string;
  email: string;
  mobile: string;
};

type EditableEntity = Book | Member;

type Field = {
  name: string;
  label: string;
  type?: string;
};

type UpdateConfig<T> = {
  id: number;
  endpoint: string;
  data: T;
  entityName: string;
  onSuccess?: () => void;
};

/* -------------------- FIELD CONFIG (OUTSIDE COMPONENT) -------------------- */

const memberFields: Field[] = [
  { name: "name", label: "Name" },
  { name: "email", label: "Email" },
  { name: "mobile", label: "Mobile" },
];

const bookFields: Field[] = [
  { name: "title", label: "Title" },
  { name: "author", label: "Author" },
];

/* -------------------- API BASE -------------------- */

const BASE_URL = "http://localhost:8000";

/* ================================================== */

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddBook, setShowAddBook] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const [editingEntity, setEditingEntity] = useState<EditableEntity | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [endpoint, setEndpoint] = useState("");
  const [title, setTitle] = useState("");
  const [loans, setLoans] = useState<Loan[]>([]);

  /* -------------------- UPDATE -------------------- */

  const handleUpdate = async <T,>({
    id,
    endpoint,
    data,
    entityName,
    onSuccess,
  }: UpdateConfig<T>) => {
    try {
      const res = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

    if (!res.ok) {
        const data = await res.json();

        const message =
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail);

        throw new Error(message);
    }

      onSuccess?.();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

/* -------------------- BORROW BOOK -------------------- */

const handleBorrow = async (bookId: number) => {
  const memberId = window.prompt("Enter Member ID to borrow this book:");

  if (!memberId) return;

  try {
    const res = await fetch(`${BASE_URL}/loans/`, {
      method: "POST", // change if your API uses something else
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        book_id: bookId,
        member_id: Number(memberId),
      }),
    });

    if (!res.ok) {
        const data = await res.json();

        const message =
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail);

        throw new Error(message);
    }

    alert("Book borrowed successfully");

    fetchDashboardData(); // refresh copies etc.
  } catch (err) {
    if (err instanceof Error) {
      alert(err.message);
    }
  }
};

  /* -------------------- DELETE -------------------- */

  const handleDelete = async ({
    id,
    endpoint,
    entityName,
    onSuccess,
  }: {
    id: number;
    endpoint: string;
    entityName: string;
    onSuccess?: () => void;
  }) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${entityName}?`
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || `Failed to delete ${entityName}`);
      }

      onSuccess?.();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  /* -------------------- FETCH DASHBOARD -------------------- */

  const fetchDashboardData = async () => {
    try {
    const [booksRes, membersRes, loansRes] = await Promise.all([
      fetch(`${BASE_URL}/books/`),
      fetch(`${BASE_URL}/members/`),
      fetch(`${BASE_URL}/books/borrowed`),
    ]);

      if (!booksRes.ok || !membersRes.ok || !loansRes.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const booksData = await booksRes.json();
      const membersData = await membersRes.json();
      const loansData = await loansRes.json();

      setBooks(Array.isArray(booksData) ? booksData : booksData.books ?? []);
      setMembers(
        Array.isArray(membersData) ? membersData : membersData.members ?? []
      );
        setLoans(Array.isArray(loansData) ? loansData : loansData.loans ?? []);
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

  if (loading) return <p style={{ padding: 40 }}>Loading dashboard...</p>;

  return (
    <div style={{ padding: "40px", maxWidth: "1100px", margin: "0 auto" }}>
      {/* HEADER */}

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
          <button onClick={() => setShowAddBook(true)}>Add Book</button>
          <button onClick={() => setShowAddMember(true)}>Add Member</button>
        </div>
      </div>

      {/* ================= BOOKS ================= */}

      <h2>Books</h2>

      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
                <th style={thStyle}>ID</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Author</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
              <td style={tdStyle}>{book.id}</td>
                <td style={tdStyle}>{book.title}</td>
                <td style={tdStyle}>{book.author}</td>

                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => {
                        setEditingEntity(book);
                        setFields(bookFields);
                        setEndpoint("books");
                        setTitle("Edit Book");
                      }}
                    >
                      Update
                    </button>

                    <button style={borrowBtn} onClick={() => handleBorrow(book.id)}>
                        Borrow
                    </button>

                    <button
                      style={deleteBtn}
                      onClick={() =>
                        handleDelete({
                          id: book.id,
                          endpoint: "books",
                          entityName: "book",
                          onSuccess: fetchDashboardData,
                        })
                      }
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= MEMBERS ================= */}

      <h2>Members</h2>

      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Mobile</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td style={tdStyle}>{member.id}</td>
                <td style={tdStyle}>{member.name}</td>
                <td style={tdStyle}>{member.email}</td>
                <td style={tdStyle}>{member.mobile}</td>

                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => {
                        setEditingEntity(member);
                        setFields(memberFields);
                        setEndpoint("members");
                        setTitle("Edit Member");
                      }}
                    >
                      Update
                    </button>

                    <button
                      style={deleteBtn}
                      onClick={() =>
                        handleDelete({
                          id: member.id,
                          endpoint: "members",
                          entityName: "member",
                          onSuccess: fetchDashboardData,
                        })
                      }
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

  {/* ================= BORROWED BOOKS ================= */}

  <h2>Borrowed Books</h2>

  {loans.length === 0 ? (
    <p>No borrowed books.</p>
  ) : (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
      <thead>
        <tr style={{ background: "#f5f5f5" }}>
          <th style={thStyle}>Loan ID</th>
          <th style={thStyle}>Book ID</th>
          <th style={thStyle}>Member ID</th>
          <th style={thStyle}>Borrowed</th>
          <th style={thStyle}>Returned</th>
        </tr>
      </thead>

      <tbody>
        {loans.map((loan) => (
          <tr key={loan.id}>
            <td style={tdStyle}>{loan.id}</td>
            <td style={tdStyle}>
              {loan.book.title} (ID: {loan.book.id})
            </td>

            <td style={tdStyle}>
              {loan.member.name} (ID: {loan.member.id})
            </td>
            <td style={tdStyle}>
              {new Date(loan.borrowed_at).toLocaleDateString()}
            </td>
            <td style={tdStyle}>
              {loan.returned_at
                ? new Date(loan.returned_at).toLocaleDateString()
                : "Not Returned"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}


      {/* ================= MODALS ================= */}

      {showAddBook && (
        <AddBookModal
          onClose={() => setShowAddBook(false)}
          onSuccess={fetchDashboardData}
        />
      )}

      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onSuccess={fetchDashboardData}
        />
      )}

      {editingEntity && (
        <EntityFormModal
          title={title}
          entity={editingEntity}
          fields={fields}
          endpoint={endpoint}
          onClose={() => setEditingEntity(null)}
          onSuccess={fetchDashboardData}
          handleUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

/* -------------------- STYLES -------------------- */

const thStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "12px",
};

const deleteBtn: React.CSSProperties = {
  background: "#ff4d4f",
  color: "white",
  border: "none",
  padding: "6px 10px",
  cursor: "pointer",
  borderRadius: "4px",
};

const borrowBtn: React.CSSProperties = {
  background: "#52c41a",
  color: "white",
  border: "none",
  padding: "6px 10px",
  cursor: "pointer",
  borderRadius: "4px",
};

type Loan = {
  id: number;
  book: {
    id: number;
    title: string;
    author: string;
  };
  member: {
    id: number;
    name: string;
    email: string;
    mobile: string;
  };
  borrowed_at: string;
  returned_at?: string | null;
};