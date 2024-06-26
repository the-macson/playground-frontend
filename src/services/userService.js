import http from "./httpService";

export function getAllProblems() {
  return http.get("/api/user/problem");
}

export function getProblemById(id) {
  return http.get(`/api/user/problem/${id}`);
}

export function submitSolution(data) {
  return http.post("/api/user/submission/submit", data);
}