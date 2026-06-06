const BASE_URL = "https://schoolcore.onrender.com";

/* ================= TOKEN ================= */
export function getToken() {
  return localStorage.getItem("token");
}

/* ================= LOGOUT HELPERS ================= */
function forceLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.reload();
}

/* ================= HEADERS ================= */
function authHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/* ================= ERROR HANDLER ================= */
async function handleResponse(res) {
  const data = await res.json().catch(() => null);

  // 🔥 GLOBAL AUTH FAILURE HANDLING
  if (!res.ok) {
    if (res.status === 401) {
      console.log("401 Unauthorized → logging out user");
      forceLogout();
    }

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

  if (res.status === 401) {
    forceLogout();
  }

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

/* ================= ANALYTICS ================= */
export async function getAnalyticsOverview() {
  const res = await fetch(`${BASE_URL}/analytics/overview`, {
    headers: authHeaders(),
  });

  return handleResponse(res);
}

/* ================= RESULTS ================= */
export async function getAllResults() {
  const res = await fetch(`${BASE_URL}/results`, {
    headers: authHeaders(),
  });

  return handleResponse(res);
}

export async function getStudentResults(studentId) {
  const res = await fetch(
    `${BASE_URL}/results/student/${studentId}`,
    {
      headers: authHeaders(),
    }
  );

  return handleResponse(res);
}

export async function getStudentAverage(studentId) {
  const res = await fetch(
    `${BASE_URL}/results/student/${studentId}/average`,
    {
      headers: authHeaders(),
    }
  );

  return handleResponse(res);
}

export async function createResults(data) {
  const res = await fetch(`${BASE_URL}/results`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

/* ================= AUTH ================= */
export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await handleResponse(res);

  const token = result.access_token || result.token;

  if (token) {
    localStorage.setItem("token", token);
  }

  if (result.role) {
    localStorage.setItem("role", result.role);
  }

  return result;
}