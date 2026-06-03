import { useEffect, useState } from "react";
import {
  getAllStudents,
  createResults,
  getStudentResults,
  getStudentAverage,
} from "../services/api";

function calculateGrade(score) {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

export default function Results() {
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    student_id: "",
    subject: "",
    term: "Term 1",
    score: "",
    teacher: "",

    // NEW SAFE DEFAULTS
    assessment_type: "Test",
    assessment_name: "",
    total_marks: 100,
    feedback: "",
  });

  const [results, setResults] = useState([]);

  const [searchStudentId, setSearchStudentId] = useState("");
  const [studentResults, setStudentResults] = useState([]);
  const [average, setAverage] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      const data = await getAllStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function addToList() {
    if (!form.student_id || !form.subject || !form.score) return;

    const score = Number(form.score);
    const total = Number(form.total_marks || 100);

    const newEntry = {
      ...form,
      score,
      grade: calculateGrade(score),

      // IMPORTANT BACKEND FIELDS
      assessment_type: form.assessment_type || "Test",
      assessment_name: form.assessment_name || null,
      total_marks: total,
      percentage: total ? Math.round((score / total) * 10000) / 100 : null,
      feedback: form.feedback || null,
    };

    setResults([...results, newEntry]);

    setForm({
      ...form,
      subject: "",
      score: "",
      assessment_name: "",
      feedback: "",
    });
  }

  async function submitResults() {
    try {
      if (results.length === 0) return;

      await createResults(results);

      alert("Results saved successfully");

      setResults([]);
    } catch (err) {
      console.log(err);
      alert("Failed to save results");
    }
  }

  async function searchResults() {
    try {
      if (!searchStudentId) return;

      const resultsData = await getStudentResults(searchStudentId);
      const averageData = await getStudentAverage(searchStudentId);

      setStudentResults(Array.isArray(resultsData) ? resultsData : []);
      setAverage(averageData.average);
    } catch (err) {
      console.log(err);
      setStudentResults([]);
      setAverage(null);
      alert("No results found");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Results Management</h2>

      {/* ENTRY FORM */}
      <div style={{ background: "white", padding: 20, borderRadius: 10, marginBottom: 20 }}>
        <h3>Enter Results</h3>

        <select name="student_id" value={form.student_id} onChange={handleChange}>
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.student_id} value={s.student_id}>
              {s.student_id} - {s.first_name} {s.last_name}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
        />

        <br /><br />

        <select name="term" value={form.term} onChange={handleChange}>
          <option>Term 1</option>
          <option>Term 2</option>
          <option>Term 3</option>
        </select>

        <br /><br />

        <input
          name="score"
          type="number"
          placeholder="Score"
          value={form.score}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="total_marks"
          type="number"
          placeholder="Total Marks (default 100)"
          value={form.total_marks}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="assessment_name"
          placeholder="Assessment Name (e.g. Quiz 1, Midterm)"
          value={form.assessment_name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="teacher"
          placeholder="Teacher Name"
          value={form.teacher}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="feedback"
          placeholder="Feedback (optional)"
          value={form.feedback}
          onChange={handleChange}
        />

        <br /><br />

        <button onClick={addToList}>Add Assessment</button>
      </div>

      {/* PENDING RESULTS */}
      <div style={{ background: "white", padding: 20, borderRadius: 10, marginBottom: 20 }}>
        <h3>Pending Results</h3>

        <table width="100%" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Assessment</th>
              <th>Type</th>
            </tr>
          </thead>

          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td>{r.student_id}</td>
                <td>{r.subject}</td>
                <td>{r.score}</td>
                <td>{r.grade}</td>
                <td>{r.assessment_name}</td>
                <td>{r.assessment_type}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={submitResults} style={{ marginTop: 10, padding: 10 }}>
          Save All Results
        </button>
      </div>

      {/* STUDENT REPORT */}
      <div style={{ background: "white", padding: 20, borderRadius: 10 }}>
        <h3>Student Report</h3>

        <select value={searchStudentId} onChange={(e) => setSearchStudentId(e.target.value)}>
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.student_id} value={s.student_id}>
              {s.student_id} - {s.first_name} {s.last_name}
            </option>
          ))}
        </select>

        <button onClick={searchResults} style={{ marginLeft: 10 }}>
          Search
        </button>

        <br /><br />

        {average !== null && (
          <h4>Average Score: {average}%</h4>
        )}

        <table width="100%" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Term</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Assessment</th>
              <th>Type</th>
              <th>Feedback</th>
            </tr>
          </thead>

          <tbody>
            {studentResults.map((r) => (
              <tr key={r.id}>
                <td>{r.subject}</td>
                <td>{r.term}</td>
                <td>{r.score}</td>
                <td>{r.grade}</td>
                <td>{r.assessment_name}</td>
                <td>{r.assessment_type}</td>
                <td>{r.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}