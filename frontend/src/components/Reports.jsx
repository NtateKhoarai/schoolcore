import { useEffect, useState } from "react";
import {
  getAllStudents,
  getAnalyticsOverview,
  downloadStudentReport,
} from "../services/api";

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const s = await getAllStudents();
      setStudents(s);

      const a = await getAnalyticsOverview();
      setAnalytics(a);
    } catch (err) {
      console.log(err);
    }
  }

  async function downloadReport() {
    if (!studentId) {
      alert("Select student first");
      return;
    }

    try {
      const blob =
        await downloadStudentReport(studentId);

      const url =
        window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download =
        `${studentId}_report.pdf`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.log(err);
      alert("Download failed");
    }
  }

  return (
    <div>

      <h2>Reports & Analytics</h2>

      {analytics && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4,1fr)",
            gap: 20,
            marginBottom: 30,
          }}
        >
          <Card
            title="Students"
            value={analytics.total_students}
          />

          <Card
            title="Teachers"
            value={analytics.total_teachers}
          />

          <Card
            title="Attendance %"
            value={`${analytics.attendance_rate}%`}
          />

          <Card
            title="Records"
            value={
              analytics.total_attendance_records
            }
          />
        </div>
      )}

      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 10,
        }}
      >
        <h3>Generate Student Report</h3>

        <select
          value={studentId}
          onChange={(e) =>
            setStudentId(e.target.value)
          }
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <option value="">
            Select Student
          </option>

          {students.map((s) => (
            <option
              key={s.student_id}
              value={s.student_id}
            >
              {s.first_name} {s.last_name}
            </option>
          ))}
        </select>

        <button onClick={downloadReport}>
          Download PDF Report
        </button>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 10,
        boxShadow:
          "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}