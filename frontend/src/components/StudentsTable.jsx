import { useEffect, useState } from "react";
import {
  getAllStudents,
  downloadStudentReport,
} from "../services/api";

export default function StudentsTable() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

 const loadStudents = async () => {
  try {
    const data = await getAllStudents();

    console.log("RAW STUDENTS RESPONSE:", data);

    if (Array.isArray(data)) {
      setStudents(data);
    } else {
      console.log("DATA IS NOT ARRAY:", data);
      setStudents([]);
    }
  } catch (error) {
    console.log("LOAD ERROR:", error);
    alert("Failed to load students");
    setStudents([]);
  }
};
  const handleDownload = async (studentId) => {
    try {
      const pdfBlob = await downloadStudentReport(studentId);

      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${studentId}_report.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
      alert("Failed to download report");
    }
  };

  return (
    <div
      style={{
        marginTop: "40px",
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        Students Dashboard
      </h2>

   <p>Total Students: {students.length}</p>

      <table
        width="100%"
        cellPadding="12"
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#1e3a8a", color: "white" }}>
            <th align="left">Student ID</th>
            <th align="left">First Name</th>
            <th align="left">Last Name</th>
            <th align="left">Class</th>
            <th align="left">Action</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(students) &&
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.student_id}</td>
                <td>{student.first_name}</td>
                <td>{student.last_name}</td>
                <td>{student.class_name}</td>

                <td>
                  <button
                    onClick={() =>
                      handleDownload(student.student_id)
                    }
                    style={{
                      backgroundColor: "#16a34a",
                      color: "white",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Download Report
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}