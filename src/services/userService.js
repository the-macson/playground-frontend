import http from './httpService';

export function getAllProblems() {
  return http.get('/api/user/problem');
}

export function getProblemById(id) {
  return http.get(`/api/user/problem/${id}`);
}

export function submitSolution(data) {
  return http.post('/api/user/submission/submit', data);
}

export function getSubmissions(id) {
  return http.get(`/api/user/submission/${id}`);
}

export function getUserProfile() {
  return http.get('/api/user/profile');
}

export function getLeaderboard() {
  return http.get('/api/user/leaderboard');
}
