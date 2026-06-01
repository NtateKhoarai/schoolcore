import { useState, useEffect } from "react";
import StudentSearch from "./components/StudentSearch";
import StudentsTable from "./components/StudentsTable";
import TeachersTable from "./components/TeachersTable";
import Attendance from "./components/Attendance";
import Reports from "./components/Reports";
import { getAllStudents, getAllTeachers } from "./services/api";
import Login from "./components/Login";

function App() {
  // ================= ALL HOOKS FIRST =================
  const [activePage, setActivePage] = useState("dashboard");
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // check login on load
 useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    setAuthChecked(true);
    return;
  }

  // decode expiry safely
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now) {
      // token expired → clear it
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  } catch (e) {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  setAuthChecked(true);
}, []);

  // load dashboard data AFTER login
  useEffect(() => {
    if (!isLoggedIn) return;

    loadDashboardData();
  }, [isLoggedIn]);

  async function loadDashboardData() {
    try {
      const students = await getAllStudents();
      if (Array.isArray(students)) setStudentCount(students.length);

      const teachers = await getAllTeachers();
      if (Array.isArray(teachers)) setTeacherCount(teachers.length);
    } catch (error) {
      console.error("Dashboard load failed:", error);
    }
  }

  // ================= CONDITIONAL UI AFTER HOOKS =================

  if (!authChecked) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  if (!isLoggedIn) {
    return (
      <Login
        onLoginSuccess={() => {
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: 240, backgroundColor: "#1e3a8a", color: "white", padding: 20 }}>
        <h2>SchoolCore</h2>

        <div onClick={() => setActivePage("dashboard")}>📊 Dashboard</div>
        <div onClick={() => setActivePage("students")}>👨‍🎓 Students</div>
        <div onClick={() => setActivePage("teachers")}>👩‍🏫 Teachers</div>
        <div onClick={() => setActivePage("attendance")}>📅 Attendance</div>
        <div onClick={() => setActivePage("reports")}>📑 Reports</div>
      </div>

      {/* Main */}
      <div style={{ flex: 1 }}>
        {activePage === "dashboard" && (
          <div style={{ padding: 20 }}>
            <h1>Dashboard</h1>
            <p>Students: {studentCount}</p>
            <p>Teachers: {teacherCount}</p>
          </div>
        )}

        {activePage === "students" && (
          <div style={{ padding: 20 }}>
            <StudentSearch />
            <StudentsTable />
          </div>
        )}

        {activePage === "teachers" && (
          <div style={{ padding: 20 }}>
            <TeachersTable />
          </div>
        )}

        {activePage === "attendance" && (
          <div style={{ padding: 20 }}>
            <Attendance />
          </div>
        )}

        {activePage === "reports" && (
          <div style={{ padding: 20 }}>
            <Reports />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;