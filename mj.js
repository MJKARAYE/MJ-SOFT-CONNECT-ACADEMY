//  Navigation 
const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('nav.links [data-page], [data-page]');

// display page based on user select

function showPage(name){
  pages.forEach(p => p.classList.toggle('active', p.id === 'page-'+name));
  document.querySelectorAll('nav.links button[data-page]').forEach(b=>{
    b.classList.toggle('current', b.dataset.page === name);
  });
  document.getElementById('navLinks').classList.remove('open');
  window.scrollTo({top:0, behavior:'instant'});
  if(name === 'courses') renderCourseDetails();
  if(name === 'dashboard') renderDashboard();
}

document.body.addEventListener('click', (e)=>{
  const btn = e.target.closest('[data-page]');
  if(btn){ showPage(btn.dataset.page); }
});

document.getElementById('burgerBtn').addEventListener('click', ()=>{
  document.getElementById('navLinks').classList.toggle('open');
});

/* ---------------- Data ---------------- */
const COURSES = [
  {
    id:'programming', name:'Programming Languages',
    blurb:'Learn programming fundamentals, problem-solving, and software creation.',
    why:'Programming powers websites, apps, games, and modern technology.',
    uses:['Software Development','Automation','Data Analysis','Mobile Applications']
  },
  {
    id:'webdev', name:'Web Development',
    blurb:'Learn HTML, CSS, JavaScript, backend development, and databases.',
    why:'Websites are essential for businesses, organizations, and individuals.',
    uses:['Website Creation','E-commerce','Web Applications','Business Portals']
  },
  {
    id:'softdev', name:'Software Development',
    blurb:'Learn software engineering principles and application development.',
    why:'Software drives businesses, industries, and digital services.',
    uses:['Desktop Applications','Enterprise Systems','Business Solutions']
  },
  {
    id:'design', name:'Graphic Design',
    blurb:'Learn visual communication and digital design.',
    why:'Businesses need professional graphics and branding.',
    uses:['Logo Design','Advertising','Social Media Content','Branding']
  },
  {
    id:'cyber', name:'Cybersecurity',
    blurb:'Learn how to protect systems, networks, and data from threats.',
    why:'Cyber attacks are increasing globally.',
    uses:['Security Analysis','Network Protection','Ethical Hacking','Risk Assessment']
  },
  {
    id:'database', name:'Database Management',
    blurb:'Learn to design, query, and maintain reliable data systems.',
    why:'Every digital product depends on well-managed data.',
    uses:['Data Modeling','SQL Querying','Backup & Recovery','Performance Tuning']
  },
  {
    id:'mobile', name:'Mobile App Development',
    blurb:'Learn to build apps for Android and iOS platforms.',
    why:'Mobile apps connect businesses directly to their users.',
    uses:['Android Apps','iOS Apps','Cross-Platform Apps','App Store Deployment']
  },
  {
    id:'ai', name:'Artificial Intelligence',
    blurb:'Learn machine learning concepts and intelligent system design.',
    why:'AI is reshaping every industry on the planet.',
    uses:['Machine Learning','Data Prediction','Automation','Chatbots']
  }
];

function renderCourseDetails(){
  const list = document.getElementById('courseDetailList');
  list.innerHTML = COURSES.map(c => `
    <div class="detail-card">
      <span class="tag">// ${c.id}</span>
      <h3>${c.name}</h3>
      <p style="color:var(--text-dim);font-size:14.5px;">${c.blurb}</p>
      <div class="detail-grid">
        <div>
          <h4 style="font-size:14px;color:var(--text-dim);font-family:var(--mono);text-transform:uppercase;margin-bottom:6px;">Why Study It?</h4>
          <p style="font-size:14.5px;">${c.why}</p>
        </div>
        <div>
          <h4 style="font-size:14px;color:var(--text-dim);font-family:var(--mono);text-transform:uppercase;margin-bottom:6px;">Uses</h4>
          <div class="uses-list">${c.uses.map(u=>`<span>${u}</span>`).join('')}</div>
        </div>
      </div>
      <div class="cta-row">
        <p>Ready to learn ${c.name}?</p>
        <button class="btn btn-primary" data-page="register" data-precourse="${c.name}">Register Now</button>
      </div>
    </div>
  `).join('');
}

/* ---------------- Safe storage (falls back to memory if localStorage is blocked) ---------------- */
const memoryStore = {};
const storage = {
  get(key, fallback){
    try{
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    }catch(err){
      return (key in memoryStore) ? memoryStore[key] : fallback;
    }
  },
  set(key, value){
    try{
      localStorage.setItem(key, JSON.stringify(value));
    }catch(err){
      memoryStore[key] = value;
    }
  },
  remove(key){
    try{ localStorage.removeItem(key); }catch(err){ delete memoryStore[key]; }
  }
};

/* ---------------- Auth ---------------- */
function getUsers(){ return storage.get('mj_users', []); }
function saveUsers(u){ storage.set('mj_users', u); }
function getSession(){ return storage.get('mj_session', null); }
function setSession(email){ storage.set('mj_session', {email}); }
function clearSession(){ storage.remove('mj_session'); }

function handleRegister(){
  const msg = document.getElementById('regMsg');
  msg.textContent = ''; msg.className = 'form-msg';

  const name = document.getElementById('regName').value.trim();
  const dob = document.getElementById('regDob').value;
  const gender = document.getElementById('regGender').value;
  const phone = document.getElementById('regPhone').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const address = document.getElementById('regAddress').value.trim();
  const course = document.getElementById('regCourse').value;
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;

  if(!name || !dob || !gender || !phone || !email || !address || !course || !password || !confirm){
    msg.textContent = 'Please fill in every field.'; msg.className = 'form-msg err'; return;
  }
  if(!email.includes('@') || !email.includes('.')){
    msg.textContent = 'Please enter a valid email address.'; msg.className = 'form-msg err'; return;
  }
  if(password.length < 4){
    msg.textContent = 'Password should be at least 4 characters.'; msg.className = 'form-msg err'; return;
  }
  if(password !== confirm){
    msg.textContent = 'Passwords do not match.'; msg.className = 'form-msg err'; return;
  }

  const users = getUsers();
  if(users.some(u => u.email === email)){
    msg.textContent = 'An account with this email already exists. Please log in instead.';
    msg.className = 'form-msg err';
    return;
  }

  const user = {
    name, dob, gender, phone, email, address,
    joined: new Date().toISOString().slice(0,10),
    password,
    courses: course ? [{ name: course, progress: 0, status: 'Active' }] : []
  };
  users.push(user);
  saveUsers(users);

  msg.textContent = 'Registration successful! Redirecting to login...';
  msg.className = 'form-msg ok';

  ['regName','regDob','regPhone','regEmail','regAddress','regPassword','regConfirm'].forEach(id=>{
    document.getElementById(id).value = '';
  });
  document.getElementById('regGender').value = '';
  document.getElementById('regCourse').value = '';

  setTimeout(()=>{
    showPage('login');
    const loginEmailEl = document.getElementById('loginEmail');
    if(loginEmailEl) loginEmailEl.value = email;
    document.getElementById('loginPassword').focus();
  }, 900);
}

document.getElementById('registerSubmitBtn').addEventListener('click', handleRegister);
['regConfirm'].forEach(id=>{
  document.getElementById(id).addEventListener('keydown', e=>{ if(e.key === 'Enter') handleRegister(); });
});

function handleLogin(){
  const msg = document.getElementById('loginMsg');
  msg.textContent = ''; msg.className = 'form-msg';

  const email = document.getElementById('loginEmail').value.trim().toLowerCase();

  
   password = document.getElementById('loginPassword').value;

  if(!email || !password){
    msg.textContent = 'Please enter your email and password.'; msg.className = 'form-msg err'; return;
  }
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if(!user){
    msg.textContent = 'No account found with that email. Please register first.';
    msg.className = 'form-msg err';
    return;
  }
  if(user.password !== password){
    msg.textContent = 'Incorrect password.'; msg.className = 'form-msg err'; return;
  }

  setSession(email);
  msg.textContent = 'Welcome back! Redirecting to your dashboard...';
  msg.className = 'form-msg ok';
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  setTimeout(()=> showPage('dashboard'), 500);
}

document.getElementById('loginSubmitBtn').addEventListener('click', handleLogin);
document.getElementById('loginPassword').addEventListener('keydown', e=>{ if(e.key === 'Enter') handleLogin(); });

document.getElementById('logoutBtn').addEventListener('click', ()=>{
  clearSession();
  showPage('home');
});

// pre-select course when "Register Now" clicked from a course card
document.body.addEventListener('click', e=>{
  const btn = e.target.closest('[data-precourse]');
  if(btn){
    setTimeout(()=>{
      const sel = document.getElementById('regCourse');
      if(sel) sel.value = btn.dataset.precourse;
    }, 0);
  }
});

function timeGreeting(){
  const h = new Date().getHours();
  if(h < 12) return 'Good morning';
  if(h < 17) return 'Good afternoon';
  return 'Good evening';
}

function renderDashboard(){
  const session = getSession();
  const loggedOut = document.getElementById('dashLoggedOut');
  const loggedIn = document.getElementById('dashLoggedIn');
  if(!session){
    loggedOut.classList.remove('hide');
    loggedIn.classList.add('hide');
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.email === session.email);

  if(!user){
    // session points to a user that no longer exists — force logout
    clearSession();
    loggedOut.classList.remove('hide');
    loggedIn.classList.add('hide');
    return;
  }

  loggedOut.classList.add('hide');
  loggedIn.classList.remove('hide');

  document.getElementById('dashGreeting').textContent = timeGreeting() + ', ' + user.name.split(' ')[0] + ' 👋';
  document.getElementById('dashName').textContent = user.name.split(' ')[0];
  document.getElementById('dashEmail').textContent = user.email;
  document.getElementById('dashEmail2').textContent = user.email;
  document.getElementById('dashPhone').textContent = user.phone || '—';
  document.getElementById('dashAddress').textContent = user.address || '—';
  document.getElementById('dashJoined').textContent = user.joined || '—';

  const myCourses = (user.courses && user.courses.length) ? user.courses : [];
  const tbody = document.getElementById('dashCourseRows');
  const emptyRow = document.getElementById('dashCoursesEmpty');

  if(myCourses.length === 0){
    tbody.innerHTML = '';
    emptyRow.classList.remove('hide');
  } else {
    emptyRow.classList.add('hide');
    tbody.innerHTML = myCourses.map(c => `
      <tr>
        <td>${c.name}</td>
        <td><div class="bar-bg"><div class="bar-fill" style="width:${c.progress}%"></div></div><span style="font-family:var(--mono);font-size:12px;color:var(--text-dim);">${c.progress}%</span></td>
        <td><span class="status ${c.status.toLowerCase()}">${c.status}</span></td>
      </tr>
    `).join('');
  }
}

['featProgress','featMaterials','featCerts','featProfile','featNotif'].forEach(id=>{
  const el = document.getElementById(id);
  if(el) el.addEventListener('click', ()=> alert('This feature is coming soon!'));
});

/* ---------------- Contact form ---------------- */
document.getElementById('contactSubmitBtn').addEventListener('click', ()=>{
  const msg = document.getElementById('contactMsg');
  const name = document.getElementById('cFullName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const subject = document.getElementById('cSubject').value.trim();
  const message = document.getElementById('cMessage').value.trim();

  if(!name || !email || !subject || !message){
    msg.textContent = 'Please fill in every field.'; msg.className = 'form-msg err'; return;
  }

  msg.textContent = 'Message sent! We will get back to you shortly.';
  msg.className = 'form-msg ok';
  document.getElementById('cFullName').value = '';
  document.getElementById('cEmail').value = '';
  document.getElementById('cSubject').value = '';
  document.getElementById('cMessage').value = '';
});

/* ---------------- Init ---------------- */
renderCourseDetails();
renderDashboard();
