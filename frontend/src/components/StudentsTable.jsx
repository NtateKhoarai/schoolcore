import { useEffect, useState } from "react";
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  downloadStudentReport,
} from "../services/api";

export default function StudentsTable() {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [form, setForm] = useState({
    student_id: "",
    first_name: "",
    last_name: "",
    class_name: "",
    gender: "",
    parent_name: "",
    parent_phone: "",
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      alert("Failed to load students");
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setSelectedStudent(null);

    setForm({
      student_id: "",
      first_name: "",
      last_name: "",
      class_name: "",
      gender: "",
      parent_name: "",
      parent_phone: "",
    });

    setModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditMode(true);
    setSelectedStudent(student);

    setForm({
      student_id: student.student_id,
      first_name: student.first_name,
      last_name: student.last_name,
      class_name: student.class_name,
      gender: student.gender,
      parent_name: student.parent_name,
      parent_phone: student.parent_phone,
    });

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
        await updateStudent(
          selectedStudent.student_id,
          form
        );
      } else {
        await createStudent(form);
      }

      setModalOpen(false);
      loadStudents();
    } catch (err) {
      console.log(err);
      alert("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) {
      return;
    }

    try {
      await deleteStudent(id);
      loadStudents();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  const handleDownload = async (id) => {
    try {
      const blob = await downloadStudentReport(id);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${id}_report.pdf`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
      alert("Failed to download report");
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Students Dashboard</h2>

      <button onClick={openAddModal}>
        + Add Student
      </button>

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.student_id}>
              <td>{s.student_id}</td>
              <td>
                {s.first_name} {s.last_name}
              </td>
              <td>{s.class_name}</td>

              <td>
                <button
                  onClick={() => openEditModal(s)}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(s.student_id)
                  }
                >
                  Delete
                </button>

                <button
                  onClick={() =>
                    handleDownload(s.student_id)
                  }
                >
                  PDF
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
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              width: 400,
            }}
          >
            <h3>
              {editMode
                ? "Edit Student"
                : "Add Student"}
            </h3>

            {Object.keys(form).map((key) => (
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
            ))}

            <button onClick={handleSubmit}>
              {editMode ? "Update" : "Create"}
            </button>

            <button
              onClick={() => setModalOpen(false)}
              style={{ marginLeft: 10 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}