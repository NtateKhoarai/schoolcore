const BASE_URL = "http://127.0.0.1:8000";

/*
IMPORTANT:
Replace this with a REAL token after login.
If empty → backend 401 errors will happen.
*/
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3ODAxNjI4OTR9.IGVmbXD3KoIjHnS57OrfOchGxN_1iEuQWtVCCZvA9iw"
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

/* ================= STUDENTS ================= */

export async function getAllStudents() {
  const res = await fetch(`${BASE_URL}/students`, { headers });
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
}

export async function getStudentById(studentId) {
  // Backend does NOT have GET /students/{id}
  const students = await getAllStudents();
  return students.find((s) => s.student_id === studentId) || null;
}

export async function createStudent(data) {
  const res = await fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create student");
  return res.json();
}

export async function updateStudent(id, data) {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update student");
  return res.json();
}

export async function deleteStudent(id) {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) throw new Error("Failed to delete student");
  return res.json();
}

export async function downloadStudentReport(id) {
  const res = await fetch(`${BASE_URL}/report/student/${id}`, {
    headers,
  });

  if (!res.ok) throw new Error("Failed to download report");
  return res.blob();
}

/* ================= TEACHERS ================= */

export async function getAllTeachers() {
  const res = await fetch(`${BASE_URL}/teachers`, { headers });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }

  return res.json();
}

export async function createTeacher(data) {
  const res = await fetch(`${BASE_URL}/teachers`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create teacher");
  return res.json();
}

export async function updateTeacher(id, data) {
  const res = await fetch(`${BASE_URL}/teachers/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update teacher");
  return res.json();
}

export async function deleteTeacher(id) {
  const res = await fetch(`${BASE_URL}/teachers/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) throw new Error("Failed to delete teacher");
  return res.json();
}