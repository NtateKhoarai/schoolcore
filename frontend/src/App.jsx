import StudentSearch from "./components/StudentSearch";
import StudentsTable from "./components/StudentsTable";
import TeachersTable from "./components/TeachersTable";
import Attendance from "./components/Attendance";

function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9" }}>
      <div style={{ padding: 20, background: "#1e3a8a", color: "white" }}>
        SchoolCore Dashboard
      </div>

      <div style={{ padding: 30 }}>
        <StudentSearch />
        <StudentsTable />
        <TeachersTable />
        <Attendance />
      </div>
    </div>
  );
}

export default App;