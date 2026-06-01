import { useEffect, useState } from "react";
import {
  getAttendance,
  markAttendance,
  getAllStudents,
} from "../services/api";

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    student_id: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
    remarks: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const studentsData = await getAllStudents();
      const attendanceData = await getAttendance();

      setStudents(studentsData || []);
      setRecords(attendanceData || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit() {
    try {
      await markAttendance(form);

      alert("Attendance saved");

      loadData();

      setForm({
        ...form,
        remarks: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save attendance");
    }
  }

  return (
    <div>
      <h2>Attendance Management</h2>

      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <h3>Mark Attendance</h3>

        <select
          value={form.student_id}
          onChange={(e) =>
            setForm({
              ...form,
              student_id: e.target.value,
            })
          }
        >
          <option value="">Select Student</option>

          {students.map((s) => (
            <option
              key={s.student_id}
              value={s.student_id}
            >
              {s.student_id} - {s.first_name} {s.last_name}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm({
              ...form,
              date: e.target.value,
            })
          }
        />

        <br /><br />

        <select
          value={form.status}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value,
            })
          }
        >
          <option>Present</option>
          <option>Absent</option>
          <option>Late</option>
        </select>

        <br /><br />

        <input
          placeholder="Remarks"
          value={form.remarks}
          onChange={(e) =>
            setForm({
              ...form,
              remarks: e.target.value,
            })
          }
        />

        <br /><br />

        <button onClick={handleSubmit}>
          Save Attendance
        </button>
      </div>

      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 10,
        }}
      >
        <h3>Attendance Records</h3>

        <table
          border="1"
          width="100%"
          cellPadding="10"
        >
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.student_id}</td>
                <td>{r.date}</td>
                <td>{r.status}</td>
                <td>{r.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}