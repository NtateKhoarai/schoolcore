import { useState } from "react";
import {
  getStudentById,
  downloadStudentReport,
} from "../services/api";

export default function StudentSearch() {
  const [studentId, setStudentId] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    try {
      const data = await getStudentById(studentId);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Student not found");
      setResult(null);
    }
  };

  const handleDownload = async () => {
    if (!result) return;

    try {
      const blob = await downloadStudentReport(
        result.student_id
      );

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.student_id}_report.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download report");
    }
  };

  return (
    <div
      style={{
        padding: 20,
        background: "white",
        marginBottom: 20,
        borderRadius: 8,
      }}
    >
      <h2>Student Search</h2>

      <input
        value={studentId}
        onChange={(e) =>
          setStudentId(e.target.value)
        }
        placeholder="Enter Student ID"
      />

      <button
        onClick={handleSearch}
        style={{ marginLeft: 10 }}
      >
        Search
      </button>

      {result && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            border: "1px solid #ddd",
          }}
        >
          <h3>Student Profile</h3>

          <p>
            <strong>ID:</strong>{" "}
            {result.student_id}
          </p>

          <p>
            <strong>First Name:</strong>{" "}
            {result.first_name}
          </p>

          <p>
            <strong>Last Name:</strong>{" "}
            {result.last_name}
          </p>

          <p>
            <strong>Gender:</strong>{" "}
            {result.gender}
          </p>

          <p>
            <strong>Class:</strong>{" "}
            {result.class_name}
          </p>

          <p>
            <strong>Parent Name:</strong>{" "}
            {result.parent_name}
          </p>

          <p>
            <strong>Parent Phone:</strong>{" "}
            {result.parent_phone}
          </p>

          <button onClick={handleDownload}>
            Download PDF Report
          </button>
        </div>
      )}
    </div>
  );
}