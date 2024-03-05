import http from './httpService';

export function getTags () {
  return http.get('/api/admin/problem/tags');
}

export function addProblem (data) {
  return http.post("/api/admin/problem/create-problem", data);
}

export function getAllProblems (){
  return http.get("/api/admin/problem");
}