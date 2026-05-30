import { useEffect, useState } from "react";
import {
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../services/api";

export default function TeachersTable() {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    teacher_id: "",
    first_name: "",
    last_name: "",
    gender: "",
    subject: "",
    phone: "",
    email: "",
    class_assigned: "",
  });

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    const results = teachers.filter(
      (t) =>
        t.teacher_id?.toLowerCase().includes(search.toLowerCase()) ||
        t.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        t.last_name?.toLowerCase().includes(search.toLowerCase()) ||
        t.subject?.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredTeachers(results);
  }, [search, teachers]);

  const loadTeachers = async () => {
    try {
      const data = await getAllTeachers();
      setTeachers(Array.isArray(data) ? data : []);
      setFilteredTeachers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load teachers");
    }
  };

  const openAddModal = () => {
    setEditMode(false);

    setForm({
      teacher_id: "",
      first_name: "",
      last_name: "",
      gender: "",
      subject: "",
      phone: "",
      email: "",
      class_assigned: "",
    });

    setModalOpen(true);
  };

  const openEditModal = (teacher) => {
    setEditMode(true);
    setForm(teacher);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updateTeacher(
          form.teacher_id,
          form
        );
      } else {
        await createTeacher(form);
      }

      setModalOpen(false);
      loadTeachers();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  const handleDelete = async (teacherId) => {
    if (!window.confirm("Delete teacher?")) {
      return;
    }

    try {
      await deleteTeacher(teacherId);
      loadTeachers();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Teachers Dashboard</h2>

      <div style={{ marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Search teacher..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            padding: 8,
            width: 250,
            marginRight: 10,
          }}
        />

        <button onClick={openAddModal}>
          + Add Teacher
        </button>
      </div>

      <table
        border="1"
        width="100%"
        cellPadding="10"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Subject</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredTeachers.map((t) => (
            <tr key={t.teacher_id}>
              <td>{t.teacher_id}</td>

              <td>
                {t.first_name} {t.last_name}
              </td>

              <td>{t.gender}</td>

              <td>{t.subject}</td>

              <td>{t.phone}</td>

              <td>{t.email}</td>

              <td>{t.class_assigned}</td>

              <td>
                <button
                  onClick={() =>
                    openEditModal(t)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      t.teacher_id
                    )
                  }
                  style={{
                    marginLeft: 5,
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              width: 450,
            }}
          >
            <h3>
              {editMode
                ? "Edit Teacher"
                : "Add Teacher"}
            </h3>

            {Object.keys(form).map(
              (key) => (
                <input
                  key={key}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  placeholder={key}
                  style={{
                    display: "block",
                    width: "100%",
                    marginBottom: 8,
                    padding: 8,
                  }}
                />
              )
            )}

            <button
              onClick={handleSubmit}
            >
              {editMode
                ? "Update"
                : "Create"}
            </button>

            <button
              onClick={() =>
                setModalOpen(false)
              }
              style={{
                marginLeft: 10,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

