/* ============================================
   FULL Supabase-Powered App.js
   ============================================ */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://fnabfzdtneaanjkodnbm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuYWJmemR0bmVhYW5qa29kbmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMDE4ODcsImV4cCI6MjA3ODg3Nzg4N30.7JW9MhOt8cqAoOga88TAsPINK-gxqwgHsYuqnCSDyI0"; // replace with your anon key
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ============================================
   1. LOGIN PAGE
   ============================================ */
if (location.pathname.includes('/shared/login.html')) {

  document.querySelectorAll('button[data-role]').forEach(btn =>
    btn.addEventListener('click', async () => {

      const role = btn.dataset.role;
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // save role in localStorage
        localStorage.setItem('role', role);

        // redirect by role
        location.href = role === 'student'
          ? '../student/dashboard.html'
          : '../teacher/dashboard.html';
      } catch (err) {
        alert(err.message);
      }
    })
  );

  return; // stop script on login page
}

/* ============================================
   2. GUARD FUNCTION
   ============================================ */
async function guard(role) {
  if (localStorage.getItem('role') !== role) {
    alert('Please log in as ' + role);
    location.href = '../shared/login.html';
  }
}

/* ============================================
   3. UTILITIES
   ============================================ */
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];

const page = location.pathname.split('/').pop().replace('.html', '');
const dir = location.pathname.split('/').slice(-2, -1)[0]; // student / teacher

/* ============================================
   4. DASHBOARD GUARDS
   ============================================ */
if (page === 'dashboard' && dir === 'student') guard('student');
if (page === 'dashboard' && dir === 'teacher') guard('teacher');

/* ============================================
   5. STUDENT ASSIGNMENTS
   ============================================ */
async function fetchAssignments() {
  const { data, error } = await supabase.from('assignments').select('*').order('due_date', { ascending: true });
  if (error) return console.error(error);
  return data;
}

async function fetchGrades() {
  const user = supabase.auth.user();
  const { data, error } = await supabase
    .from('grades')
    .select('assignment_id, grade, feedback')
    .eq('student_id', user.id);
  if (error) return console.error(error);
  return data;
}

/* ============================================
   6. TEACHER FUNCTIONS
   ============================================ */
async function createAssignment(title, desc, due) {
  const user = supabase.auth.user();
  const { data, error } = await supabase.from('assignments').insert([{
    title, description: desc, due_date: due, created_by: user.id
  }]);
  if (error) return console.error(error);
  alert('Assignment Created!');
  return data;
}

async function gradeSubmission(student_id, assignment_id, grade, feedback) {
  const { data, error } = await supabase.from('grades').upsert([{
    student_id, assignment_id, grade, feedback
  }]);
  if (error) return console.error(error);
  alert('Graded!');
  return data;
}

/* ============================================
   7. ANNOUNCEMENTS
   ============================================ */
async function postAnnouncement(text) {
  const { data, error } = await supabase.from('announcements').insert([{ text }]);
  if (error) return console.error(error);
  return data;
}

async function fetchAnnouncements() {
  const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
  if (error) return console.error(error);
  return data;
}

async function renderAnnouncements() {
  const list = $('#annList');
  if (!list) return;
  const announcements = await fetchAnnouncements();
  list.innerHTML = announcements.map(a => `
    <div class="bg-white p-3 rounded shadow mb-2">
      ${a.text}<br>
      <span class="text-xs text-gray-500">${new Date(a.created_at).toLocaleString()}</span>
    </div>
  `).join('');
}

/* ============================================
   8. FILE UPLOAD
   ============================================ */
async function uploadFile(file) {
  const user = supabase.auth.user();
  const { data, error } = await supabase.storage.from('uploads').upload(`${user.id}/${file.name}`, file);
  if (error) return console.error(error);
  return data;
}

/* ============================================
   9. STUDENT PAGE RENDERS
   ============================================ */
async function renderStudentAssignments() {
  const list = $('#assignList');
  if (!list) return;
  const assignments = await fetchAssignments();
  list.innerHTML = assignments.map(a => `
    <div class="bg-white p-4 rounded shadow mb-4">
      <h3 class="font-semibold">${a.title}</h3>
      <p class="text-sm text-gray-600">Due: ${a.due_date}</p>
      <input type="file" id="file-${a.id}" class="mt-2 block">
      <button onclick="submitAssignment('${a.id}')"
        class="mt-2 bg-indigo-600 text-white px-4 py-2 rounded">Submit</button>
    </div>
  `).join('');
}

async function submitAssignment(id) {
  const fileInput = document.querySelector(`#file-${id}`);
  const file = fileInput.files[0];
  if (!file) return alert('Choose a file');
  await uploadFile(file);

  const user = supabase.auth.user();
  await supabase.from('submissions').insert([{
    assignment_id: id,
    student_id: user.id,
    file_name: file.name
  }]);
  alert('Submitted!');
}

/* ============================================
   10. TEACHER PAGE RENDERS
   ============================================ */
async function renderSubmissions() {
  const list = $('#subList');
  if (!list) return;

  const { data: subs, error } = await supabase.from('submissions').select(`
    id, file_name, assignment_id, student_id,
    assignments(title),
    profiles(full_name)
  `).eq('assignments.created_by', supabase.auth.user().id);

  if (error) return console.error(error);

  list.innerHTML = subs.map((s, i) => `
    <div class="bg-white p-4 rounded shadow mb-4">
      <h3 class="font-semibold">${s.assignments.title}</h3>
      <p>Student: ${s.profiles.full_name} — File: ${s.file_name}</p>
      <input id="grade-${i}" placeholder="Grade A-F" class="mt-2 border p-1 rounded block">
      <input id="feed-${i}" placeholder="Feedback" class="mt-2 border p-1 rounded block">
      <button onclick="saveGrade('${s.student_id}', '${s.assignment_id}', ${i})"
        class="mt-2 bg-green-600 text-white px-4 py-1 rounded">Save</button>
    </div>
  `).join('');
}

async function saveGrade(student_id, assignment_id, i) {
  const grade = $(`#grade-${i}`).value;
  const feedback = $(`#feed-${i}`).value;
  await gradeSubmission(student_id, assignment_id, grade, feedback);
  renderSubmissions();
}

/* ============================================
   11. Realtime Announcements
   ============================================ */
supabase.from('announcements').on('INSERT', payload => renderAnnouncements()).subscribe();

/* ============================================
   12. Realtime Submissions (Teacher)
   ============================================ */
supabase.from('submissions').on('INSERT', payload => {
  if (dir === 'teacher') renderSubmissions();
}).subscribe();

/* ============================================
   13. INIT PAGE RENDER
   ============================================ */
if (page === 'assignments' && dir === 'student') renderStudentAssignments();
if (page === 'announcements') renderAnnouncements();
if (page === 'grade_submissions' && dir === 'teacher') renderSubmissions();
