/* ==
   NAVIGATION
== */

const pages = document.querySelectorAll(".page");

function showPage(name) {
  
  pages.forEach(page => {
    page.classList.toggle("active", page.id === "page-" + name);
  });
  
  document.querySelectorAll("nav.links button[data-page]").forEach(btn => {
    btn.classList.toggle("current", btn.dataset.page === name);
  });
  
  document.getElementById("navLinks").classList.remove("open");
  
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
  
  if (name === "courses") {
    renderCourseDetails();
  }
}

document.body.addEventListener("click", function(e) {
  
  const btn = e.target.closest("[data-page]");
  
  if (btn) {
    showPage(btn.dataset.page);
  }
  
});

/* ==
   MOBILE MENU== */

document.getElementById("burgerBtn").addEventListener("click", function() {
  
  document.getElementById("navLinks").classList.toggle("open");
  
});


/* ==
   COURSE DATA
== */

const COURSES = [
  
  {
    id: "programming",
    name: "Programming Languages",
    blurb: "Learn programming fundamentals, problem-solving, and software creation.",
    why: "Programming powers websites, apps, games, and modern technology.",
    uses: ["Software Development", "Automation", "Data Analysis", "Mobile Applications"]
  },
  
  {
    id: "webdev",
    name: "Web Development",
    blurb: "Learn HTML, CSS, JavaScript, backend development, and databases.",
    why: "Websites are essential for businesses, organizations, and individuals.",
    uses: ["Website Creation", "E-commerce", "Web Applications", "Business Portals"]
  },
  
  {
    id: "softdev",
    name: "Software Development",
    blurb: "Learn software engineering principles and application development.",
    why: "Software drives businesses, industries, and digital services.",
    uses: ["Desktop Applications", "Enterprise Systems", "Business Solutions"]
  },
  
  {
    id: "design",
    name: "Graphic Design",
    blurb: "Learn visual communication and digital design.",
    why: "Businesses need professional graphics and branding.",
    uses: ["Logo Design", "Advertising", "Social Media Content", "Branding"]
  },
  
  {
    id: "cyber",
    name: "Cybersecurity",
    blurb: "Learn how to protect systems, networks, and data from threats.",
    why: "Cyber attacks are increasing globally.",
    uses: ["Security Analysis", "Network Protection", "Ethical Hacking", "Risk Assessment"]
  },
  
  {
    id: "database",
    name: "Database Management",
    blurb: "Learn to design, query, and maintain reliable data systems.",
    why: "Every digital product depends on well-managed data.",
    uses: ["Data Modeling", "SQL Querying", "Backup & Recovery", "Performance Tuning"]
  },
  
  {
    id: "mobile",
    name: "Mobile App Development",
    blurb: "Learn to build apps for Android and iOS platforms.",
    why: "Mobile apps connect businesses directly to their users.",
    uses: ["Android Apps", "iOS Apps", "Cross-Platform Apps", "App Store Deployment"]
  },
  
  {
    id: "ai",
    name: "Artificial Intelligence",
    blurb: "Learn machine learning concepts and intelligent system design.",
    why: "AI is reshaping every industry on the planet.",
    uses: ["Machine Learning", "Data Prediction", "Automation", "Chatbots"]
  }
  
];


/* ==
   DISPLAY COURSES
== */

function renderCourseDetails() {
  
  const list = document.getElementById("courseDetailList");
  
  list.innerHTML = COURSES.map(course => `

    <div class="detail-card">

        <span class="tag">// ${course.id}</span>

        <h3>${course.name}</h3>

        <p style="color:var(--text-dim);font-size:14.5px;">
            ${course.blurb}
        </p>

        <div class="detail-grid">

            <div>

                <h4 style="font-size:14px;color:var(--text-dim);font-family:var(--mono);text-transform:uppercase;margin-bottom:6px;">
                    Why Study It?
                </h4>

                <p>${course.why}</p>

            </div>

            <div>

                <h4 style="font-size:14px;color:var(--text-dim);font-family:var(--mono);text-transform:uppercase;margin-bottom:6px;">
                    Uses
                </h4>

                <div class="uses-list">

                    ${course.uses.map(use => `<span>${use}</span>`).join("")}

                </div>

            </div>

        </div>

        <div class="cta-row">

            <button class="btn btn-primary">
                Coming Soon
            </button>

        </div>

    </div>

    `).join("");
  
}

/* ===
   INITIALIZE
=== */
renderCourseDetails();
