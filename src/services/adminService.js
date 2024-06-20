import http from "./httpService";

export function getTags() {
  return http.get("/api/admin/problem/tags");
}

export function addProblem(data) {
  return http.post("/api/admin/problem/create-problem", data);
}

export function getAllProblems() {
  return http.get("/api/admin/problem");
}

export function getPorblemById(id) {
  return http.get(`/api/admin/problem/${id}`);
}

export function updateProblem(id, data) {
  return http.put(`/api/admin/problem/${id}`, data);
}
