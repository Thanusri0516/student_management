import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="button-icon">
      <path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="action-icon">
      <path
        d="M4 20l4.5-1 9.8-9.8a2.1 2.1 0 0 0-3-3L5.5 16 4 20Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M13.5 7.5l3 3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="action-icon">
      <path
        d="M5 7h14M9 7V5h6v2m-8 0 1 12h8l1-12"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M10 11v5M14 11v5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

const emptyForm = {
  name: "",
  email: "",
  department: "",
  studentYear: ""
};

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const API = "http://localhost:8086/students";

  const getApiErrorMessage = (error, fallbackMessage) => {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (data?.message) {
      return data.message;
    }

    if (data?.error) {
      return data.error;
    }

    return fallbackMessage;
  };

  const normalizeStudents = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.students)) {
      return data.students;
    }

    return [];
  };

  const fetchStudents = useCallback(async () => {
    try {
      const res = await axios.get(API);
      setStudents(normalizeStudents(res.data));
      setErrorMessage("");
    } catch (error) {
      setStudents([]);
      setErrorMessage(getApiErrorMessage(error, "Unable to load student details."));
      console.error("Fetch students failed:", error);
    }
  }, [API]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD or UPDATE
  const saveStudent = async () => {
    const payload = {
      name: form.name,
      email: form.email,
      department: form.department,
      studentYear: Number(form.studentYear)
    };

    try {
      setIsSaving(true);
      setErrorMessage("");

      if (editId) {
        await axios.put(`${API}/${editId}`, payload);
        setEditId(null);
      } else {
        await axios.post(API, payload);
      }

      setForm(emptyForm);
      await fetchStudents();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to save student details."));
      console.error("Save student failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // DELETE
  const deleteStudent = async (id) => {
    try {
      setIsDeletingId(id);
      setErrorMessage("");
      await axios.delete(`${API}/${id}`);
      await fetchStudents();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to delete student details."));
      console.error("Delete student failed:", error);
    } finally {
      setIsDeletingId(null);
    }
  };

  // EDIT
  const editStudent = (student) => {
    setErrorMessage("");
    setForm({
      name: student.name || "",
      email: student.email || "",
      department: student.department || "",
      studentYear: student.studentYear || ""
    });
    setEditId(student.id);
  };

  return (
    <div className="app-shell">
      <div className="app-container">
        <header className="page-header">
          <p className="eyebrow">Student Administration</p>
          <h1>Student Management System</h1>
        </header>

        <section className="card">
          <div className="section-heading">
            <h2>{editId ? "Update Student" : "Add Student"}</h2>
            <p>Capture student records with a clearer, structured form.</p>
          </div>

          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

          <div className="form-grid">
            <label className="field">
              <span>Student Name</span>
              <input
                name="name"
                placeholder="Enter full name"
                value={form.name}
                onChange={handleChange}
              />
            </label>

            <label className="field">
              <span>Email</span>
              <input
                name="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
              />
            </label>

            <label className="field">
              <span>Department</span>
              <input
                name="department"
                placeholder="Enter department"
                value={form.department}
                onChange={handleChange}
              />
            </label>

            <label className="field">
              <span>Year</span>
              <input
                name="studentYear"
                type="number"
                placeholder="Enter academic year"
                value={form.studentYear}
                onChange={handleChange}
              />
            </label>
          </div>

          <button className="primary-button" onClick={saveStudent} disabled={isSaving}>
            <PlusIcon />
            {isSaving ? "Saving..." : editId ? "Update Student" : "Add Student"}
          </button>
        </section>

        <section className="card">
          <div className="section-heading">
            <h2>Student List</h2>
            <p>Review and manage every record from one organized table.</p>
          </div>

          <div className="table-wrap">
            <table className="student-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Department</th>
                  <th scope="col">Year</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.department}</td>
                      <td>{s.studentYear}</td>
                      <td>
                        <div className="action-group">
                          <button className="icon-button edit-button" onClick={() => editStudent(s)}>
                            <PencilIcon />
                            <span>Edit</span>
                          </button>
                          <button
                            className="icon-button delete-button"
                            onClick={() => deleteStudent(s.id)}
                            disabled={isDeletingId === s.id}
                          >
                            <TrashIcon />
                            <span>{isDeletingId === s.id ? "Deleting..." : "Delete"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No student records available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
