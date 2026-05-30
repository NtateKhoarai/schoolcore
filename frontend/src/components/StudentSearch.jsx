import { useState } from "react";
 import { getStudentById, downloadStudentReport } from "../services/api";
 
export default function StudentSearch() {
  const [studentId, setStudentId] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    try {
      const data = await getStudentById(studentId);
      setResult(data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch student data");
      setResult(null);
    }
  };

  const handleDownload = async () => {
    if (!result) {
      alert("Please search a student first");
      return;
    }

    try {
      const pdfBlob = await downloadStudentReport(result.student_id);

      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${result.student_id}_report.pdf`;

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
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
        maxWidth: "600px",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        Student Search
      </h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: "25px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "#f9fafb",
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>
            Student Profile
          </h3>

          <p><strong>Student ID:</strong> {result.student_id}</p>
          <p><strong>First Name:</strong> {result.first_name}</p>
          <p><strong>Last Name:</strong> {result.last_name}</p>
          <p><strong>Class:</strong> {result.class_name}</p>
          <p><strong>Gender:</strong> {result.gender}</p>
          <p><strong>Parent:</strong> {result.parent_name}</p>
          <p><strong>Phone:</strong> {result.parent_phone}</p>

          <button
            onClick={handleDownload}
            style={{
              marginTop: "20px",
              backgroundColor: "#16a34a",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Download PDF Report
          </button>
        </div>
      )}
    </div>
  );
}