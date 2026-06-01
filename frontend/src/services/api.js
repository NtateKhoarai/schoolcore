const BASE_URL = "http://127.0.0.1:8000";

/* ================= TOKEN ================= */
// IMPORTANT: later we will move this to login system
export function getToken() {
  return localStorage.getItem("token");
}

/* ================= HEADERS ================= */
function authHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

/* ================= ERROR HANDLER ================= */
async function handleResponse(res) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.detail || "Request failed");
  }

  return data;
}

/* ================= STUDENTS ================= */

export async function getAllStudents() {
  const res = await fetch(`${BASE_URL}/students`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function getStudentById(studentId) {
  const students = await getAllStudents();
  return students.find((s) => s.student_id === studentId) || null;
}

export async function createStudent(data) {
  const res = await fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateStudent(id, data) {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteStudent(id) {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function downloadStudentReport(id) {
  const res = await fetch(`${BASE_URL}/report/student/${id}`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed report download");
  return res.blob();
}

/* ================= TEACHERS ================= */

export async function getAllTeachers() {
  const res = await fetch(`${BASE_URL}/teachers`, {
    headers: authHeaders(),
  });

  return handleResponse(res);
}

export async function createTeacher(data) {
  const res = await fetch(`${BASE_URL}/teachers`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function updateTeacher(id, data) {
  const res = await fetch(`${BASE_URL}/teachers/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function deleteTeacher(id) {
  const res = await fetch(`${BASE_URL}/teachers/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return handleResponse(res);
}

/* ================= ATTENDANCE ================= */

export async function getAttendance() {
  const res = await fetch(`${BASE_URL}/attendance`, {
    headers: authHeaders(),
  });

  return handleResponse(res);
}

export async function markAttendance(data) {
  const res = await fetch(`${BASE_URL}/attendance`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function getAnalyticsOverview() {
  const res = await fetch(
    `${BASE_URL}/analytics/overview`,
    {
      headers: authHeaders(),
    }
  );

  return handleResponse(res);
}

export const getAllResults = async () => {
  const response = await api.get("/results");
  return response.data;
};