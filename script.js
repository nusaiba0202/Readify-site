/* =========================
   Utilities (reusable)
   ========================= */
function saveToLocalStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (e) { console.error("localStorage write failed", e); }
}

function loadFromLocalStorage(key, defaultVal = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    console.error("localStorage read failed", e);
    return defaultVal;
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

function formatDateISO(dateObj = new Date()) {
  return dateObj.toISOString().split("T")[0];
}

function formatDatePretty(dateObj) {
  return dateObj.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/* Reusable animated counter */
function animateNumber(el, from, to, durationMs = 700) {
  if (!el) return;
  const start = performance.now();
  const diff = to - from;

  function frame(now) {
    const t = Math.min(1, (now - start) / durationMs);
    const val = from + diff * t;
    el.textContent = String(Math.round(val));
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* =========================
   Global: Nav toggle 
   ========================= */
function initNavToggle() {
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (!navToggle || !mainNav) return;

  navToggle.addEventListener("click", function () {
    const expanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", String(!expanded));
    const list = mainNav.querySelector(".nav-list");
    if (!list) return;
    list.classList.toggle("show", !expanded);
  });

  document.addEventListener("click", (e) => {
    const list = mainNav.querySelector(".nav-list");
    if (!list) return;
    if (window.innerWidth <= 900 && !mainNav.contains(e.target) && !navToggle.contains(e.target)) {
      list.classList.remove("show");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* =========================
   Global: Newsletter 
   ========================= */
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  const emailEl = document.getElementById("newsletterEmail");
  const msgEl = document.getElementById("newsletterMsg");
  if (!form || !emailEl || !msgEl) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailEl.value.trim();

    if (!validateEmail(email)) {
      msgEl.textContent = "Please enter a valid email address.";
      msgEl.style.color = "#ffb3b3";
      return;
    }

    const saved = loadFromLocalStorage("newsletterEmails", []);
    const list = Array.isArray(saved) ? saved : [];
    if (!list.includes(email)) list.push(email);
    saveToLocalStorage("newsletterEmails", list);

    msgEl.textContent = "Thanks — saved locally.";
    msgEl.style.color = "#9fe6b9";
    form.reset();
    setTimeout(() => (msgEl.textContent = ""), 3000);
  });
}

/* =========================
   HOME: Quotes + Author of day 
   ========================= */
const quotes = [
  { text: "It is only with the heart that one can see rightly; what is essential is invisible to the eye.", author: "Antoine de Saint-Exupéry — The Little Prince" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien — The Fellowship of the Ring" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle / Will Durant" }
];

const authors = [
  { name: "Jane Austen", born: "1775", notable: "Pride and Prejudice", bio: "English novelist known for her sharp observations of social manners and morality." },
  { name: "George Orwell", born: "1903", notable: "1984, Animal Farm", bio: "English novelist and essayist, remembered for his lucid prose and social criticism." },
  { name: "Toni Morrison", born: "1931", notable: "Beloved", bio: "American novelist exploring themes of Black identity and history." },
  { name: "Haruki Murakami", born: "1949", notable: "Norwegian Wood", bio: "Japanese writer blending magical realism and mundane life." },
  { name: "Chinua Achebe", born: "1930", notable: "Things Fall Apart", bio: "Nigerian novelist who wrote about post-colonial identity and culture." }
];

const bookCovers = [
  "img_book/book1.png",
  "img_book/book2.png",
  "img_book/book3.png",
  "img_book/book4.png",
  "img_book/book5.png"
];

let currentQuoteIndex = 0;
let quoteTimer = null;
const QUOTE_INTERVAL_MS = 6000;

function updateQuoteIndicator(index) {
  const indicator = document.getElementById("quoteIndicator");
  if (!indicator) return;

  indicator.innerHTML = "";
  quotes.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.style.display = "inline-block";
    dot.style.width = i === index ? "10px" : "6px";
    dot.style.height = "6px";
    dot.style.margin = "0 4px";
    dot.style.borderRadius = "6px";
    dot.style.background = i === index
      ? "linear-gradient(90deg, var(--accent), var(--accent-2))"
      : "rgba(255,255,255,0.06)";
    indicator.appendChild(dot);
  });
}

function renderQuote(index) {
  const quoteTextEl = document.getElementById("quoteText");
  const quoteAuthorEl = document.getElementById("quoteAuthor");
  if (!quoteTextEl || !quoteAuthorEl) return;

  const q = quotes[index];
  quoteTextEl.textContent = `“${q.text}”`;
  quoteAuthorEl.textContent = `— ${q.author}`;

  const coverEl = document.getElementById("bookCover");
  if (coverEl) {
    coverEl.classList.remove("fade-in");
    coverEl.classList.add("fade-out");
    setTimeout(() => {
      coverEl.src = bookCovers[index % bookCovers.length];
      coverEl.classList.remove("fade-out");
      coverEl.classList.add("fade-in");
    }, 250);
  }

  updateQuoteIndicator(index);
}

function nextQuote() {
  currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
  renderQuote(currentQuoteIndex);
}
function prevQuote() {
  currentQuoteIndex = (currentQuoteIndex - 1 + quotes.length) % quotes.length;
  renderQuote(currentQuoteIndex);
}
function startQuoteRotation() {
  clearInterval(quoteTimer);
  quoteTimer = setInterval(nextQuote, QUOTE_INTERVAL_MS);
}

function saveCurrentQuote() {
  const btn = document.getElementById("saveQuote");
  const quoteTextEl = document.getElementById("quoteText");
  if (!quoteTextEl) return;

  const saved = loadFromLocalStorage("savedQuotes", []);
  const list = Array.isArray(saved) ? saved : [];
  list.push({ ...quotes[currentQuoteIndex], savedAt: formatDateISO(new Date()) });
  saveToLocalStorage("savedQuotes", list);

  if (btn) {
    btn.textContent = "Saved ✓";
    setTimeout(() => (btn.textContent = "Save"), 1400);
  }
}

function getAuthorOfDay(date = new Date(), list = authors) {
  const dayIndex = Math.floor(date.valueOf() / (1000 * 60 * 60 * 24));
  return list[dayIndex % list.length];
}

function renderAuthorOfDay() {
  const nameEl = document.getElementById("authorName");
  if (!nameEl) return;

  const a = getAuthorOfDay(new Date(), authors);
  document.getElementById("authorName").textContent = a.name;
  document.getElementById("authorBio").textContent = a.bio;
  document.getElementById("authorBorn").textContent = `Born: ${a.born}`;
  document.getElementById("authorNotable").textContent = `Notable: ${a.notable}`;

  const avatar = document.getElementById("authorAvatar");
  if (avatar) avatar.textContent = a.name.split(" ").map(s => s[0]).slice(0, 2).join("");
}

/* =========================
   TRACKER: Reading progress
   ========================= */
function initTrackerPage() {
  const form = document.getElementById("trackerForm");
  if (!form) return;

  const totalEl = document.getElementById("totalPages");
  const readEl = document.getElementById("pagesRead");
  const speedEl = document.getElementById("speed");

  const msgEl = document.getElementById("trackerMsg");
  const percentEl = document.getElementById("percentCounter");
  const finishEl = document.getElementById("finishDate");
  const fillEl = document.getElementById("progressFill");
  const detailsEl = document.getElementById("progressDetails");

  const saveBtn = document.getElementById("saveProgressBtn");
  const clearBtn = document.getElementById("clearProgressBtn");

  const STORAGE_KEY = "readingProgress";

  function setMsg(text, type) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.style.color =
      type === "error" ? "#ffb3b3" :
      type === "success" ? "#9fe6b9" :
      "var(--muted)";
  }

  function validate(total, read, speed) {
    if (!Number.isFinite(total) || total <= 0) return "Total pages must be greater than 0.";
    if (!Number.isFinite(read) || read < 0) return "Pages read must be 0 or more.";
    if (read > total) return "Pages read cannot exceed total pages.";
    if (!Number.isFinite(speed) || speed <= 0) return "Reading speed must be greater than 0.";
    return null;
  }

  function calculate(total, read, speed) {
    const percent = Math.round((read / total) * 100);
    const remaining = total - read;
    const daysLeft = remaining === 0 ? 0 : Math.ceil(remaining / speed);
    const finish = new Date();
    finish.setDate(finish.getDate() + daysLeft);
    return { percent, remaining, daysLeft, finish };
  }

  function render(result) {
    const current = parseInt((percentEl && percentEl.textContent) || "0", 10);
    animateNumber(percentEl, current, result.percent, 650);
    if (fillEl) fillEl.style.width = `${result.percent}%`;
    if (finishEl) finishEl.textContent = result.remaining === 0 ? "Finished 🎉" : formatDatePretty(result.finish);
    if (detailsEl) {
      detailsEl.textContent = result.remaining === 0
        ? "You’ve completed the book!"
        : `Remaining pages: ${result.remaining}. Estimated days left: ${result.daysLeft}.`;
    }
  }

  function run(showMsg) {
    const total = Number(totalEl.value);
    const read = Number(readEl.value);
    const speed = Number(speedEl.value);

    const err = validate(total, read, speed);
    if (err) {
      if (showMsg) setMsg(err, "error");
      return null;
    }

    const result = calculate(total, read, speed);
    render(result);
    if (showMsg) setMsg("Calculation updated.", "success");
    return { total, read, speed, ...result, savedAt: formatDateISO(new Date()) };
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    run(true);
  });

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const payload = run(false);
      if (!payload) return setMsg("Fix the form errors before saving.", "error");
      saveToLocalStorage(STORAGE_KEY, payload);
      setMsg("Progress saved to localStorage.", "success");
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      if (fillEl) fillEl.style.width = "0%";
      if (percentEl) percentEl.textContent = "0";
      if (finishEl) finishEl.textContent = "—";
      if (detailsEl) detailsEl.textContent = "Enter values to see progress.";
      setMsg("Saved progress cleared.", "success");
    });
  }

  const saved = loadFromLocalStorage(STORAGE_KEY, null);
  if (saved) {
    totalEl.value = saved.total;
    readEl.value = saved.read;
    speedEl.value = saved.speed;
    render(saved);
    setMsg("Loaded saved progress from localStorage.", "success");
  } else {
    setMsg("No saved progress yet. Enter values and calculate.", "info");
  }
}

/* =========================
   RECOMMENDER: Random Book + reading list
   ========================= */
const recommenderBooks = [
  { id: "r1", title: "The Little Prince", author: "Antoine de Saint-Exupéry", genre: "Fable", pages: 96, cover: "img_book/book1.png", synopsis: "A poetic tale about friendship, wonder, and seeing with the heart." },
  { id: "r2", title: "The Fellowship of the Ring", author: "J.R.R. Tolkien", genre: "Fantasy", pages: 423, cover: "img_book/book2.png", synopsis: "An epic journey begins as a small fellowship sets out to destroy the One Ring." },
  { id: "r3", title: "Norwegian Wood", author: "Haruki Murakami", genre: "Fiction", pages: 296, cover: "img_book/book3.png", synopsis: "A nostalgic coming-of-age story exploring love, loss, and memory in 1960s Tokyo." },
  { id: "r4", title: "Beloved", author: "Toni Morrison", genre: "Historical Fiction", pages: 324, cover: "img_book/book4.png", synopsis: "A haunting story of memory, trauma, and the cost of freedom." },
  { id: "r5", title: "Things Fall Apart", author: "Chinua Achebe", genre: "Classic", pages: 209, cover: "img_book/book5.png", synopsis: "A portrait of community, identity, and colonial disruption." },
  { id: "r6", title: "Signal to Noise", author: "Mira Ainsley", genre: "Sci-Fi", pages: 180, cover: "img_book/book3.png", synopsis: "A short sci-fi mystery where messages from the future threaten to rewrite the present." }
];

function getLengthBucket(pages) {
  if (pages <= 200) return "short";
  if (pages <= 400) return "medium";
  return "long";
}
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function initRecommenderPage() {
  const genreEl = document.getElementById("recGenre");
  const lengthEl = document.getElementById("recLength");
  const pickBtn = document.getElementById("pickAgainBtn");
  const saveBtn = document.getElementById("saveRecBtn");
  if (!genreEl || !lengthEl || !pickBtn || !saveBtn) return;

  const coverEl = document.getElementById("recCover");
  const titleEl = document.getElementById("recTitle");
  const authorEl = document.getElementById("recAuthor");
  const metaEl = document.getElementById("recMeta");
  const synopsisEl = document.getElementById("recSynopsis");
  const msgEl = document.getElementById("recMsg");

  const listEl = document.getElementById("readingList");
  const emptyEl = document.getElementById("readingListEmpty");
  const clearBtn = document.getElementById("clearReadingListBtn");

  const STORAGE_KEY = "readingList";
  let currentRecommendation = null;

  function setMsg(text, type) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.style.color =
      type === "error" ? "#ffb3b3" :
      type === "success" ? "#9fe6b9" :
      "var(--muted)";
  }

  function getFiltered() {
    const g = genreEl.value;
    const l = lengthEl.value;
    return recommenderBooks.filter(b => {
      const okG = g ? b.genre === g : true;
      const okL = l ? getLengthBucket(b.pages) === l : true;
      return okG && okL;
    });
  }

  function renderReadingList() {
    if (!listEl || !emptyEl) return;
    const saved = loadFromLocalStorage(STORAGE_KEY, []);
    const arr = Array.isArray(saved) ? saved : [];

    listEl.innerHTML = "";
    if (!arr.length) { emptyEl.style.display = "block"; return; }
    emptyEl.style.display = "none";

    arr.forEach(item => {
      const li = document.createElement("li");
      li.className = "reading-item";
      li.innerHTML = `
        <div>
          <strong>${item.title}</strong>
          <p class="muted small" style="margin:0;">${item.author} • ${item.genre} • ${getLengthBucket(item.pages)}</p>
        </div>
      `;

      const rm = document.createElement("button");
      rm.className = "btn ghost";
      rm.type = "button";
      rm.textContent = "Remove";
      rm.addEventListener("click", () => {
        const updated = arr.filter(x => x.id !== item.id);
        saveToLocalStorage(STORAGE_KEY, updated);
        renderReadingList();
      });

      const right = document.createElement("div");
      right.appendChild(rm);
      li.appendChild(right);
      listEl.appendChild(li);
    });
  }

  function renderRecommendation(book) {
    currentRecommendation = book;

    // optional animations if CSS exists
    pickBtn.classList.remove("wiggle");
    void pickBtn.offsetWidth;
    pickBtn.classList.add("wiggle");

    const recCard = document.getElementById("recCard");
    if (recCard) {
      recCard.classList.remove("pop-in");
      void recCard.offsetWidth;
      recCard.classList.add("pop-in");
    }

    if (coverEl) coverEl.src = book.cover;
    if (titleEl) titleEl.textContent = book.title;
    if (authorEl) authorEl.textContent = book.author;
    if (metaEl) metaEl.textContent = `Genre: ${book.genre} • Length: ${getLengthBucket(book.pages)} • Pages: ${book.pages}`;
    if (synopsisEl) synopsisEl.textContent = book.synopsis || "";
  }

  function pickBook() {
    const filtered = getFiltered();
    if (!filtered.length) return setMsg("No books match those filters. Try another selection.", "error");
    renderRecommendation(pickRandom(filtered));
    setMsg("Here’s your recommendation!", "success");
  }

  function saveCurrent() {
    if (!currentRecommendation) return setMsg("Pick a book first, then save it.", "error");

    const saved = loadFromLocalStorage(STORAGE_KEY, []);
    const list = Array.isArray(saved) ? saved : [];

    if (list.some(x => x.id === currentRecommendation.id)) return setMsg("Already in your reading list.", "info");

    list.unshift({ ...currentRecommendation, savedAt: formatDateISO(new Date()) });
    saveToLocalStorage(STORAGE_KEY, list);
    renderReadingList();
    setMsg("Saved to your reading list.", "success");
  }

  pickBtn.addEventListener("click", pickBook);
  saveBtn.addEventListener("click", saveCurrent);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      saveToLocalStorage(STORAGE_KEY, []);
      renderReadingList();
      setMsg("Reading list cleared.", "success");
    });
  }

  renderReadingList();
  pickBook();
}

/* =========================
   FLOW: Cozy sounds + completed books
   ========================= */
function initFlowPage() {
  const soundBtns = document.querySelectorAll(".sound-btn");
  const volumeEl = document.getElementById("soundVolume");
  const stopAllBtn = document.getElementById("stopAllSounds");
  const soundMsg = document.getElementById("soundMsg");

  const completedForm = document.getElementById("completedForm");
  const completedTitle = document.getElementById("completedTitle");
  const completedAuthor = document.getElementById("completedAuthor");
  const completedDate = document.getElementById("completedDate");
  const completedList = document.getElementById("completedList");
  const completedEmpty = document.getElementById("completedEmpty");
  const completedMsg = document.getElementById("completedMsg");
  const clearCompletedBtn = document.getElementById("clearCompletedBtn");

  if (!soundBtns.length && !completedForm) return;

  /* Sounds */
  const SOUND_KEY = "flowSounds";
  const VOL_KEY = "flowVolume";

  const sounds = {
    rain:   new Audio("audio/rain.mp3"),
    fire:   new Audio("audio/fireplace.mp3"),
    cafe:   new Audio("audio/cafe.mp3"),
    forest: new Audio("audio/forest.mp3")
  };

  Object.values(sounds).forEach(a => {
    a.loop = true;
    a.preload = "auto";
    a.volume = 0.5;
  });

  function setSoundMsg(text) {
    if (!soundMsg) return;
    soundMsg.textContent = text;
  }

  function getSoundState() {
    const state = loadFromLocalStorage(SOUND_KEY, {});
    return state && typeof state === "object" ? state : {};
  }

  function applyVolume(v) {
    Object.values(sounds).forEach(a => a.volume = v);
  }

  function toggleSound(name, btn) {
    const state = getSoundState();
    const audio = sounds[name];
    if (!audio) return;

    const isOn = !!state[name];
    if (isOn) {
      audio.pause();
      state[name] = false;
      btn.setAttribute("aria-pressed", "false");
      setSoundMsg(`${name} stopped.`);
    } else {
      audio.play().catch(() => {
        setSoundMsg("Audio blocked or missing file. Check audio paths, then click again.");
      });
      state[name] = true;
      btn.setAttribute("aria-pressed", "true");
      setSoundMsg(`${name} playing…`);
    }
    saveToLocalStorage(SOUND_KEY, state);
  }

  function stopAll() {
    const state = getSoundState();
    Object.keys(sounds).forEach(k => {
      sounds[k].pause();
      state[k] = false;
    });
    saveToLocalStorage(SOUND_KEY, state);
    soundBtns.forEach(b => b.setAttribute("aria-pressed", "false"));
    setSoundMsg("All sounds stopped.");
  }

  const savedVol = loadFromLocalStorage(VOL_KEY, 0.5);
  if (volumeEl) volumeEl.value = String(savedVol);
  applyVolume(Number(savedVol) || 0.5);

  const savedState = getSoundState();
  soundBtns.forEach(btn => {
    const name = btn.dataset.sound;
    const on = !!savedState[name];
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    if (on && sounds[name]) sounds[name].play().catch(() => {});
    btn.addEventListener("click", () => toggleSound(name, btn));
  });

  if (volumeEl) {
    volumeEl.addEventListener("input", () => {
      const v = Number(volumeEl.value);
      applyVolume(v);
      saveToLocalStorage(VOL_KEY, v);
    });
  }

  if (stopAllBtn) stopAllBtn.addEventListener("click", stopAll);

  /* Completed Books */
  const COMPLETED_KEY = "completedBooks";

  function setCompletedMsg(text, type) {
    if (!completedMsg) return;
    completedMsg.textContent = text;
    completedMsg.style.color = type === "error" ? "#ffb3b3" : "#9fe6b9";
    setTimeout(() => { if (completedMsg) completedMsg.textContent = ""; }, 3500);
  }

  function getCompleted() {
    const list = loadFromLocalStorage(COMPLETED_KEY, []);
    return Array.isArray(list) ? list : [];
  }

  function saveCompleted(list) {
    saveToLocalStorage(COMPLETED_KEY, list);
  }

  function renderCompleted() {
    if (!completedList || !completedEmpty) return;
    const list = getCompleted();
    completedList.innerHTML = "";

    if (!list.length) {
      completedEmpty.style.display = "block";
      return;
    }
    completedEmpty.style.display = "none";

    list.forEach(item => {
      const li = document.createElement("li");
      li.className = "completed-item";

      const left = document.createElement("div");
      left.innerHTML = `
        <strong>${item.title}</strong>
        <p class="muted small meta" style="margin:0;">${item.author} • Completed: ${item.date}</p>
      `;

      const right = document.createElement("div");
      const rm = document.createElement("button");
      rm.className = "btn ghost";
      rm.type = "button";
      rm.textContent = "Remove";
      rm.addEventListener("click", () => {
        const updated = getCompleted().filter(x => x.id !== item.id);
        saveCompleted(updated);
        renderCompleted();
      });
      right.appendChild(rm);

      li.appendChild(left);
      li.appendChild(right);
      completedList.appendChild(li);
    });
  }

  if (completedForm) {
    if (completedDate && !completedDate.value) completedDate.value = formatDateISO(new Date());

    completedForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = (completedTitle?.value || "").trim();
      const author = (completedAuthor?.value || "").trim();
      const date = (completedDate?.value || formatDateISO(new Date()));

      if (!title || !author) {
        setCompletedMsg("Please enter both title and author.", "error");
        return;
      }

      const list = getCompleted();
      const id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now());

      list.unshift({ id, title, author, date });
      saveCompleted(list);
      renderCompleted();

      completedForm.reset();
      if (completedDate) completedDate.value = formatDateISO(new Date());
      setCompletedMsg("Completed book added!", "success");
    });
  }

  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener("click", () => {
      saveCompleted([]);
      renderCompleted();
      setCompletedMsg("Completed list cleared.", "success");
    });
  }

  renderCompleted();
}

/* =========================
   FEEDBACK: Form validation + localStorage + FAQ accordion
   ========================= */
function initFeedbackPage() {
  const form = document.getElementById("feedbackForm");
  const nameEl = document.getElementById("fbName");
  const emailEl = document.getElementById("fbEmail");
  const msgEl = document.getElementById("fbMessage");
  const outEl = document.getElementById("feedbackMsg");
  const clearBtn = document.getElementById("clearFeedbackBtn");

  const faqRoot = document.getElementById("faq");

  if (!form && !faqRoot) return;

  const STORAGE_KEY = "feedbackEntries";

  function setStatus(text, type) {
    if (!outEl) return;
    outEl.textContent = text;
    outEl.style.color =
      type === "error" ? "#ffb3b3" :
      type === "success" ? "#9fe6b9" :
      "var(--muted)";
  }

  function getFeedbackList() {
    const list = loadFromLocalStorage(STORAGE_KEY, []);
    return Array.isArray(list) ? list : [];
  }

  function saveFeedback(entry) {
    const list = getFeedbackList();
    list.unshift(entry);
    saveToLocalStorage(STORAGE_KEY, list);
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = (nameEl?.value || "").trim();
      const email = (emailEl?.value || "").trim();
      const message = (msgEl?.value || "").trim();

      if (name.length < 2) return setStatus("Please enter your name (at least 2 characters).", "error");
      if (!validateEmail(email)) return setStatus("Please enter a valid email address.", "error");
      if (message.length < 10) return setStatus("Message is too short. Please write at least 10 characters.", "error");

      const id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now());

      saveFeedback({
        id,
        name,
        email,
        message,
        submittedAt: new Date().toISOString()
      });

      setStatus("✅ Thanks! Your feedback was submitted and saved locally.", "success");
      form.reset();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      saveToLocalStorage(STORAGE_KEY, []);
      setStatus("Saved feedback cleared.", "success");
    });
  }

  // FAQ Accordion
  if (faqRoot) {
    const items = faqRoot.querySelectorAll(".faq-item");
    items.forEach((btn) => {
      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        const panel = btn.nextElementSibling;

        // close others
        items.forEach((other) => {
          if (other !== btn) {
            other.setAttribute("aria-expanded", "false");
            const otherPanel = other.nextElementSibling;
            if (otherPanel) otherPanel.hidden = true;
          }
        });

        // toggle current
        btn.setAttribute("aria-expanded", String(!expanded));
        if (panel) panel.hidden = expanded;
      });
    });
  }
}

/* =========================
   Initiate everything
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initNewsletter();

  // Home-only
  renderQuote(currentQuoteIndex);
  startQuoteRotation();
  renderAuthorOfDay();

  // Home controls
  const nextBtn = document.getElementById("nextQuote");
  const prevBtn = document.getElementById("prevQuote");
  const saveBtn = document.getElementById("saveQuote");
  if (nextBtn) nextBtn.addEventListener("click", () => { nextQuote(); startQuoteRotation(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prevQuote(); startQuoteRotation(); });
  if (saveBtn) saveBtn.addEventListener("click", saveCurrentQuote);

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Page modules
  initTrackerPage();
  initRecommenderPage();
  initFlowPage();
  initFeedbackPage();
});
