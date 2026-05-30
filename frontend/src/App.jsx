import StudentSearch from "./components/StudentSearch";
import StudentsTable from "./components/StudentsTable";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        fontFamily: "Arial",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#1e3a8a",
          color: "white",
          padding: "20px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        SchoolCore Dashboard
      </div>

      {/* Main Content */}
      <div style={{ padding: "30px" }}>
        <StudentSearch />
        <StudentsTable />
      </div>
    </div>
  );
}

export default App;