import { useState, useEffect } from "react";
import StudentSearch from "./components/StudentSearch";
import StudentsTable from "./components/StudentsTable";
import TeachersTable from "./components/TeachersTable";
import Attendance from "./components/Attendance";
import Reports from "./components/Reports";
import Results from "./components/Results";
import Login from "./components/Login";

import {
  getAllStudents,
  getAllTeachers,
} from "./services/api";

const BASE_URL = "https://schoolcore.onrender.com";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [role, setRole] = useState(null);

  // ================= AUTH CHECK =================
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");

      if (!token) {
        setIsLoggedIn(false);
        setAuthChecked(true);
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/teachers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Invalid token");
        }

        setRole(storedRole);
        setIsLoggedIn(true);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        setIsLoggedIn(false);
      }

      setAuthChecked(true);
    }

    checkAuth();
  }, []);

  // ================= DASHBOARD DATA =================
  useEffect(() => {
    if (!isLoggedIn) return;

    loadDashboardData();
  }, [isLoggedIn]);

  async function loadDashboardData() {
    try {
      const students = await getAllStudents();

      if (Array.isArray(students)) {
        setStudentCount(students.length);
      }

      const teachers = await getAllTeachers();

      if (Array.isArray(teachers)) {
        setTeacherCount(teachers.length);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // ================= LOADING =================
  if (!authChecked) {
    return (
      <div style={{ padding: 40 }}>
        Checking authentication...
      </div>
    );
  }

  // ================= LOGIN =================
  if (!isLoggedIn) {
    return (
      <Login
        onLoginSuccess={() => {
          setRole(localStorage.getItem("role"));
          setIsLoggedIn(true);
        }}
      />
    );
  }

  // ================= ROLE CONTROL =================
  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: 240,
          backgroundColor: "#1e3a8a",
          color: "white",
          padding: 20,
        }}
      >
        <h2>SchoolCore</h2>

        <div onClick={() => setActivePage("dashboard")}>
          📊 Dashboard
        </div>

        {(isAdmin || isTeacher) && (
          <div onClick={() => setActivePage("students")}>
            👨‍🎓 Students
          </div>
        )}

        {isAdmin && (
          <div onClick={() => setActivePage("teachers")}>
            👩‍🏫 Teachers
          </div>
        )}

        <div onClick={() => setActivePage("attendance")}>
          📅 Attendance
        </div>

        {(isAdmin || isTeacher) && (
          <div onClick={() => setActivePage("results")}>
            📝 Results
          </div>
        )}

        {isAdmin && (
          <div onClick={() => setActivePage("reports")}>
            📑 Reports
          </div>
        )}

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            setIsLoggedIn(false);
          }}
          style={{
            marginTop: 20,
            padding: 10,
            background: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1 }}>
        {activePage === "dashboard" && (
          <div style={{ padding: 20 }}>
            <h1>Dashboard</h1>
            <p>Role: {role}</p>
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

        {activePage === "teachers" && isAdmin && (
          <div style={{ padding: 20 }}>
            <TeachersTable />
          </div>
        )}

        {activePage === "attendance" && (
          <div style={{ padding: 20 }}>
            <Attendance />
          </div>
        )}

        {activePage === "results" && (
          <div style={{ padding: 20 }}>
            <Results />
          </div>
        )}

        {activePage === "reports" && isAdmin && (
          <div style={{ padding: 20 }}>
            <Reports />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;