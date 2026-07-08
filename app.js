const STORAGE_KEY_APPOINTMENTS = 'smartClinicAppointments';
const STORAGE_KEY_USER = 'smartClinicUser';
const STORAGE_CIPHER_KEY = 'smartClinicMvpCipher';

const loginSection = document.getElementById('login-section');
const appSection = document.getElementById('app-section');
const loginForm = document.getElementById('login-form');
const appointmentForm = document.getElementById('appointment-form');
const appointmentsBody = document.getElementById('appointments-body');
const statsContainer = document.getElementById('stats');
const message = document.getElementById('message');
const formTitle = document.getElementById('form-title');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const formSection = document.getElementById('form-section');

const loggedUser = document.getElementById('logged-user');
const loggedRole = document.getElementById('logged-role');
const logoutBtn = document.getElementById('logout-btn');

let appointments = readAppointments();
let currentUser = readUser();

initialize();

function initialize() {
  setTodayAsMinimumDate();
  if (currentUser) {
    showApp();
  }

  loginForm.addEventListener('submit', onLogin);
  logoutBtn.addEventListener('click', onLogout);
  appointmentForm.addEventListener('submit', onSaveAppointment);
cancelEditBtn.addEventListener('click', () => {
  resetForm();
  showMessage('Edit canceled.');
});
  appointmentsBody.addEventListener('click', onTableAction);

  render();
}

function onLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const role = document.getElementById('role').value;

  if (!username) {
    showMessage('Username is required.', true);
    return;
  }

  currentUser = { username, role };
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
  showApp();
  showMessage('Logged in successfully.');
}

function onLogout() {
  currentUser = null;
  localStorage.removeItem(STORAGE_KEY_USER);
  loginSection.classList.remove('hidden');
  appSection.classList.add('hidden');
  appointmentForm.reset();
  showMessage('Logged out.');
}

function showApp() {
  loginSection.classList.add('hidden');
  appSection.classList.remove('hidden');

  loggedUser.textContent = currentUser.username;
  loggedRole.textContent = `Role: ${capitalize(currentUser.role)}`;

  const doctorViewOnly = currentUser.role === 'doctor';
  formSection.classList.toggle('hidden', doctorViewOnly);
  render();
}

function onSaveAppointment(event) {
  event.preventDefault();

  const id = document.getElementById('appointment-id').value;
  const appointment = {
    id: id || crypto.randomUUID(),
    patientName: document.getElementById('patientName').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    doctor: document.getElementById('doctor').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
  };

  if (!isAppointmentValid(appointment)) {
    showMessage('Please fill all fields with valid values.', true);
    return;
  }

  if (isDuplicateSlot(appointment)) {
    showMessage('This doctor already has an appointment at that date and time.', true);
    return;
  }

  if (id) {
    appointments = appointments.map((item) => (item.id === id ? appointment : item));
    showMessage('Appointment updated successfully.');
  } else {
    appointments.push(appointment);
    showMessage('Appointment booked successfully.');
  }

  persistAppointments();
  resetForm();
  render();
}

function onTableAction(event) {
  const action = event.target.dataset.action;
  const id = event.target.dataset.id;

  if (!action || !id || currentUser?.role === 'doctor') {
    return;
  }

  const appointment = appointments.find((item) => item.id === id);
  if (!appointment) {
    return;
  }

  if (action === 'edit') {
    document.getElementById('appointment-id').value = appointment.id;
    document.getElementById('patientName').value = appointment.patientName;
    document.getElementById('phone').value = appointment.phone;
    document.getElementById('doctor').value = appointment.doctor;
    document.getElementById('date').value = appointment.date;
    document.getElementById('time').value = appointment.time;
    formTitle.textContent = 'Edit Appointment';
    cancelEditBtn.classList.remove('hidden');
    showMessage('Editing appointment.');
  }

  if (action === 'delete') {
    appointments = appointments.filter((item) => item.id !== id);
    persistAppointments();
    render();
    showMessage('Appointment canceled successfully.');
    resetForm();
  }
}

function render() {
  const sorted = [...appointments].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  appointmentsBody.innerHTML = sorted
    .map((appointment) => {
      const actions =
        currentUser?.role === 'doctor'
          ? '<span>View only</span>'
          : `<div class="table-actions">
              <button data-action="edit" data-id="${appointment.id}" class="secondary" type="button">Edit</button>
              <button data-action="delete" data-id="${appointment.id}" class="danger" type="button">Cancel</button>
             </div>`;

      return `<tr>
        <td>${escapeHTML(appointment.patientName)}</td>
        <td>${escapeHTML(appointment.phone)}</td>
        <td>${escapeHTML(appointment.doctor)}</td>
        <td>${escapeHTML(appointment.date)}</td>
        <td>${escapeHTML(appointment.time)}</td>
        <td>${actions}</td>
      </tr>`;
    })
    .join('');

  if (sorted.length === 0) {
    appointmentsBody.innerHTML = '<tr><td colspan="6">No appointments yet.</td></tr>';
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = appointments.filter((item) => item.date === today).length;
  const doctors = new Set(appointments.map((item) => item.doctor)).size;

  statsContainer.innerHTML = `
    <div class="stat"><strong>Total Appointments</strong><div>${appointments.length}</div></div>
    <div class="stat"><strong>Today's Appointments</strong><div>${todayCount}</div></div>
    <div class="stat"><strong>Active Doctors</strong><div>${doctors}</div></div>
  `;
}

function resetForm() {
  appointmentForm.reset();
  document.getElementById('appointment-id').value = '';
  formTitle.textContent = 'Book Appointment';
  cancelEditBtn.classList.add('hidden');
  setTodayAsMinimumDate();
}

function isDuplicateSlot(appointment) {
  return appointments.some(
    (item) =>
      item.id !== appointment.id &&
      item.doctor === appointment.doctor &&
      item.date === appointment.date &&
      item.time === appointment.time,
  );
}

function isAppointmentValid(appointment) {
  const phoneOk = isValidPhone(appointment.phone);
  return (
    appointment.patientName && appointment.phone && appointment.doctor && appointment.date && appointment.time && phoneOk
  );
}

function isValidPhone(phone) {
  const digitsOnly = phone.replace(/[\s\-()]/g, '');
  return /^\+?[0-9]{7,15}$/.test(digitsOnly);
}

function persistAppointments() {
  localStorage.setItem(STORAGE_KEY_APPOINTMENTS, encodeAppointments(appointments));
}

function readAppointments() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(decodeAppointments(stored));
    } catch {
      return JSON.parse(stored);
    }
  } catch {
    return [];
  }
}

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_USER) || 'null');
  } catch {
    return null;
  }
}

function setTodayAsMinimumDate() {
  const dateInput = document.getElementById('date');
  if (!dateInput) {
    return;
  }
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle('error', isError);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function encodeAppointments(data) {
  const json = JSON.stringify(data);
  let transformed = '';

  for (let index = 0; index < json.length; index += 1) {
    const keyCode = STORAGE_CIPHER_KEY.charCodeAt(index % STORAGE_CIPHER_KEY.length);
    transformed += String.fromCharCode(json.charCodeAt(index) ^ keyCode);
  }

  return btoa(transformed);
}

function decodeAppointments(data) {
  const decoded = atob(data);
  let transformed = '';

  for (let index = 0; index < decoded.length; index += 1) {
    const keyCode = STORAGE_CIPHER_KEY.charCodeAt(index % STORAGE_CIPHER_KEY.length);
    transformed += String.fromCharCode(decoded.charCodeAt(index) ^ keyCode);
  }

  return transformed;
}
