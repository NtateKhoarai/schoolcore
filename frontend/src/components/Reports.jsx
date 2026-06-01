import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

import { getAllStudents, getAttendance } from "../services/api";

 

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const s = await getAllStudents();
      const a = await getAttendance();

      setStudents(Array.isArray(s) ? s : []);
      setAttendance(Array.isArray(a) ? a : []);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadResults() {
  try {
    const data = await getAllResults();
    if (Array.isArray(data)) {
      setResults(data);
    }
  } catch (error) {
    console.log("Results not available");
  }
}

  // 📊 Student per class breakdown
  const classData = Object.values(
    students.reduce((acc, s) => {
      acc[s.class_name] = acc[s.class_name] || {
        class: s.class_name,
        students: 0,
      };
      acc[s.class_name].students += 1;
      return acc;
    }, {})
  );

  // 📊 Gender distribution
  const genderData = Object.values(
    students.reduce((acc, s) => {
      acc[s.gender] = acc[s.gender] || {
        name: s.gender,
        value: 0,
      };
      acc[s.gender].value += 1;
      return acc;
    }, {})
  );

  // 📊 Attendance summary
  const attendanceData = Object.values(
    attendance.reduce((acc, a) => {
      acc[a.date] = acc[a.date] || {
        date: a.date,
        present: 0,
        absent: 0,
      };

      if (a.status === "Present") {
        acc[a.date].present += 1;
      } else {
        acc[a.date].absent += 1;
      }

      return acc;
    }, {})
  );

  const COLORS = ["#1e3a8a", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Reports & Analytics Dashboard</h2>

      {/* TOP CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          marginTop: 20,
        }}
      >
        <Card title="Total Students" value={students.length} />
        <Card title="Total Records" value={attendance.length} />
        <Card title="Classes" value={classData.length} />
        <Card
          title="Attendance Rate"
          value={
            attendance.length
              ? `${Math.round(
                  (attendance.filter((a) => a.status === "Present").length /
                    attendance.length) *
                    100
                )}%`
              : "0%"
          }
        />
      </div>

      {/* CHARTS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 20,
          marginTop: 30,
        }}
      >
        {/* CLASS BAR CHART */}
        <div style={box}>
          <h3>Students per Class</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={classData}>
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#1e3a8a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GENDER PIE CHART */}
        <div style={box}>
          <h3>Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
              >
                {genderData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ATTENDANCE LINE */}
        <div style={{ ...box, gridColumn: "span 2" }}>
          <h3>Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="present" stroke="#10b981" />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Card({ title, value }) {
  return (
    <div style={card}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

const card = {
  background: "white",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const box = {
  background: "white",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

 

