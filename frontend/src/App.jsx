import { useState, useEffect } from "react";
import StudentSearch from "./components/StudentSearch";
import StudentsTable from "./components/StudentsTable";
import TeachersTable from "./components/TeachersTable";
import Attendance from "./components/Attendance";
import { getAllStudents, getAllTeachers } from "./services/api";
import Reports from "./components/Reports";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const students = await getAllStudents();

      if (Array.isArray(students)) {
        setStudentCount(students.length);
      }

      try {
        const teachers = await getAllTeachers();

        if (Array.isArray(teachers)) {
          setTeacherCount(teachers.length);
        }
      } catch (teacherError) {
        console.log("Teachers count unavailable");
        setTeacherCount(0);
      }
    } catch (error) {
      console.error("Dashboard load failed:", error);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "240px",
          backgroundColor: "#1e3a8a",
          color: "white",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "40px" }}>SchoolCore</h2>

        <div
          style={menuStyle}
          onClick={() => setActivePage("dashboard")}
        >
          📊 Dashboard
        </div>

        <div
          style={menuStyle}
          onClick={() => setActivePage("students")}
        >
          👨‍🎓 Students
        </div>

        <div
          style={menuStyle}
          onClick={() => setActivePage("teachers")}
        >
          👩‍🏫 Teachers
        </div>

        <div
          style={menuStyle}
          onClick={() => setActivePage("attendance")}
        >
          📅 Attendance
        </div>

        <div
          style={menuStyle}
          onClick={() => setActivePage("reports")}
        >
          📑 Reports
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {/* Top Bar */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h1 style={{ margin: 0 }}>SchoolCore Dashboard</h1>

          <div>
            <strong>Admin</strong>
          </div>
        </div>

        {/* Dashboard */}
        {activePage === "dashboard" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
              padding: "20px",
            }}
          >
            <div style={cardStyle}>
              <h3>Total Students</h3>
              <h1>{studentCount}</h1>
            </div>

            <div style={cardStyle}>
              <h3>Total Teachers</h3>
              <h1>{teacherCount}</h1>
            </div>

            <div style={cardStyle}>
              <h3>Attendance</h3>
              <h1>95%</h1>
            </div>

            <div style={cardStyle}>
              <h3>Classes</h3>
              <h1>12</h1>
            </div>
          </div>
        )}

        {/* Students */}
        {activePage === "students" && (
          <div style={{ padding: "20px" }}>
            <StudentSearch />
            <StudentsTable />
          </div>
        )}

        {/* Teachers */}
        {activePage === "teachers" && (
          <div style={{ padding: "20px" }}>
            <TeachersTable />
          </div>
        )}

        {/* Attendance */}
        {activePage === "attendance" && (
          <div style={{ padding: "20px" }}>
            <Attendance />
          </div>
        )}

        {/* Reports */}
        {activePage === "reports" && (
          <div style={{ padding: "20px" }}>
            <Reports />
          </div>
        )}
      </div>
    </div>
  );
}

const menuStyle = {
  marginBottom: "20px",
  cursor: "pointer",
  padding: "10px",
  borderRadius: "6px",
};

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

export default App;