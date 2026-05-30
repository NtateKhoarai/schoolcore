import { useEffect, useState } from "react";
import { getAllStudents } from "../services/api";

export default function Attendance() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getAllStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      alert("Failed to load attendance data");
    }
  };

  return (
    <div style={{ marginTop: 30, background: "#fff", padding: 20 }}>
      <h2>Attendance (Coming Soon)</h2>

      <p>This module is not connected to backend yet.</p>

      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Student</th>
            <th>Class</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.student_id}>
              <td>{s.first_name} {s.last_name}</td>
              <td>{s.class_name}</td>
              <td>Not Marked</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}