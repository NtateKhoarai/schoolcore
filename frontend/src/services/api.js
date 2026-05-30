const BASE_URL = "http://127.0.0.1:8000";

const TOKEN = null;

// GET ALL STUDENTS
export async function getAllStudents() {
  const response = await fetch(`${BASE_URL}/students`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return response.json();
}

// SEARCH SINGLE STUDENT (FRONTEND FILTER)
export async function getStudentById(studentId) {
  const students = await getAllStudents();

  if (!Array.isArray(students)) return null;

  const cleanId = studentId.trim().toUpperCase();

  return students.find((s) =>
    (s.student_id || "")
      .toString()
      .trim()
      .toUpperCase() === cleanId
  ) || null;
}

// DOWNLOAD PDF REPORT
export async function downloadStudentReport(studentId) {
  const response = await fetch(
    `${BASE_URL}/report/student/${studentId}`,
    {
      headers: {},
    }
  );

  if (!response.ok) {
    throw new Error("Failed to download report");
  }

  return response.blob();
}