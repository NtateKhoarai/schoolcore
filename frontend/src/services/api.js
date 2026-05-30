const BASE_URL = "http://127.0.0.1:8000";

const TOKEN =
  "PASTE_YOUR_REAL_TOKEN_HERE";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

// GET ALL STUDENTS
export async function getAllStudents() {
  const response = await fetch(`${BASE_URL}/students`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return response.json();
}

// GET SINGLE STUDENT
export async function getStudentById(studentId) {
  const students = await getAllStudents();

  return (
    students.find(
      (s) => s.student_id === studentId
    ) || null
  );
}

// CREATE STUDENT
export async function createStudent(studentData) {
  const response = await fetch(
    `${BASE_URL}/students`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(studentData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create student");
  }

  return response.json();
}

// UPDATE STUDENT
export async function updateStudent(
  studentId,
  studentData
) {
  const response = await fetch(
    `${BASE_URL}/students/${studentId}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify(studentData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update student");
  }

  return response.json();
}

// DELETE STUDENT
export async function deleteStudent(studentId) {
  const response = await fetch(
    `${BASE_URL}/students/${studentId}`,
    {
      method: "DELETE",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete student");
  }

  return response.json();
}

// DOWNLOAD PDF REPORT
export async function downloadStudentReport(
  studentId
) {
  const response = await fetch(
    `${BASE_URL}/report/student/${studentId}`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to download report");
  }

  return response.blob();
}