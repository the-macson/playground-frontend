import http from "./httpService";

export function getAllProblems() {
  return http.get("/api/user/problem");
}

export function getProblemById(id) {
  return http.get(`/api/user/problem/${id}`);
}