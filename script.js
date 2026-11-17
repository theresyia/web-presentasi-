/* =========================================================
   DompetKu — Logika presentasi (JavaScript)
   Edit data di bagian "DATA" untuk memperbarui progres.
   ========================================================= */

/* ---------- DATA ---------- */

// Halaman wireframe (gambar di folder assets/)
const wireframes = [
  { nama: "Login",      file: "assets/wireframe-login.png",      ket: "Halaman masuk dengan ringkasan keuangan." },
  { nama: "Dashboard",  file: "assets/wireframe-dashboard.png",  ket: "Saldo, pemasukan, pengeluaran, arus kas, dan transaksi terbaru." },
  { nama: "Transaksi",  file: "assets/wireframe-transaksi.png",  ket: "Daftar transaksi dan form Tambah Transaksi." },
  { nama: "Kategori",   file: "assets/wireframe-kategori.png",   ket: "Kategori pemasukan & pengeluaran beserta form tambah kategori." },
  { nama: "Laporan",    file: "assets/wireframe-laporan.png",    ket: "Laporan keuangan bulanan dan rincian per kategori." },
  { nama: "Pencarian",  file: "assets/wireframe-pencarian.png",  ket: "Cari transaksi dengan filter kategori, jenis, tanggal, dan nominal." },
  { nama: "Profil",     file: "assets/wireframe-profil.png",     ket: "Informasi pribadi, keamanan, notifikasi, dan preferensi." }
];

// Hasil implementasi (screenshot aplikasi di folder assets/, memakai data contoh)
const hasil = [
  { nama: "Login",           file: "assets/hasil-login.png",           ket: "Halaman masuk dengan ringkasan keuangan dan tautan Daftar / Lupa sandi." },
  { nama: "Dashboard",       file: "assets/hasil-dashboard.png",       ket: "Saldo, total pemasukan & pengeluaran, grafik 6 bulan, dan transaksi terbaru." },
  { nama: "Transaksi",       file: "assets/hasil-transaksi.png",       ket: "Daftar transaksi dengan filter serta tambah, ubah, dan hapus transaksi." },
  { nama: "Kategori",        file: "assets/hasil-kategori.png",        ket: "Kategori pemasukan & pengeluaran milik pengguna." },
  { nama: "Laporan",         file: "assets/hasil-laporan.png",         ket: "Laporan per bulan dengan tombol Cetak dan Unduh CSV." },
  { nama: "Profil",          file: "assets/hasil-profil.png",          ket: "Pengaturan profil pengguna." },
  { nama: "Admin",           file: "assets/hasil-admin.png",           ket: "Dashboard Admin dengan menu khusus admin." },
  { nama: "Kelola Pengguna", file: "assets/hasil-admin-pengguna.png",  ket: "Admin mengubah data, reset password, dan menghapus pengguna." }
];

// Progres pengembangan. status: "done" | "progress" | "todo"
// (Sesuaikan persentase dengan kondisi proyekmu yang sebenarnya.)
const tugas = [
  { nama: "Analisis masalah & solusi",            persen: 100, status: "done" },
  { nama: "Business logic, role & access matrix", persen: 100, status: "done" },
  { nama: "SRS & diagram UML (use case, activity, sequence, class)", persen: 100, status: "done" },
  { nama: "Wireframe 7 halaman",                  persen: 100, status: "done" },
  { nama: "HTML — struktur halaman",              persen: 100, status: "done" },
  { nama: "CSS — tema & responsif",               persen: 90,  status: "progress" },
  { nama: "JavaScript — validasi & hitung saldo", persen: 90,  status: "progress" },
  { nama: "Pengujian & perbaikan",                persen: 40,  status: "progress" }
];

// Rencana selanjutnya
const rencana = [
  "Menguji seluruh fitur User dan Admin, lalu memperbaiki bug yang ditemukan.",
  "Menyempurnakan tampilan responsif di layar HP.",
  "Menambahkan fitur pencarian & filter lanjutan sesuai SRS (FR-11).",
  "Menambahkan pengaturan notifikasi dan preferensi tampilan (FR-14, FR-15).",
  "Menyiapkan demo dan laporan akhir sebelum dikumpulkan."
];

/* ---------- ELEMEN ---------- */
const slides  = [...document.querySelectorAll(".slide")];
const topBar  = document.getElementById("topBar");
const counter = document.getElementById("counter");
const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");
const dotsEl  = document.getElementById("dots");
let index = 0;

/* ---------- EFEK MASUK BERTAHAP (stagger, memakai keyframes Animate.css) ---------- */
slides.forEach(s => {
  s.querySelectorAll(".head, .intro, .card, .steps li, .act li, .next li, .pills span, .thanks, .lead, .chip, h1")
    .forEach((el, k) => el.style.setProperty("--i", Math.min(k, 14)));
});

/* ---------- NAVIGASI SLIDE ---------- */
function goTo(n) {
  index = Math.max(0, Math.min(slides.length - 1, n));
  slides.forEach((s, i) => {
    s.classList.toggle("active", i === index);
    s.classList.toggle("past", i < index);
  });
  counter.textContent = `${index + 1} / ${slides.length}`;
  topBar.style.width = `${((index + 1) / slides.length) * 100}%`;
  btnPrev.disabled = index === 0;
  btnNext.disabled = index === slides.length - 1;
  [...dotsEl.children].forEach((d, i) => d.classList.toggle("on", i === index));
  slides[index].scrollTop = 0;
  if (location.hash !== `#${index + 1}`) history.replaceState(null, "", `#${index + 1}`);
  if (slides[index].dataset.title === "Progres") animasiProgres();
}

slides.forEach((s, i) => {
  const d = document.createElement("button");
  d.setAttribute("aria-label", `Slide ${i + 1}: ${s.dataset.title}`);
  d.title = s.dataset.title;
  d.addEventListener("click", () => goTo(i));
  dotsEl.appendChild(d);
});

btnPrev.addEventListener("click", () => goTo(index - 1));
btnNext.addEventListener("click", () => goTo(index + 1));

document.addEventListener("keydown", e => {
  if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); goTo(index + 1); }
  else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key))      { e.preventDefault(); goTo(index - 1); }
  else if (e.key === "Home") goTo(0);
  else if (e.key === "End")  goTo(slides.length - 1);
  else if (e.key.toLowerCase() === "f") toggleFullscreen();
});

// Scroll mouse / trackpad: geser slide ke bawah-atas (jika isi slide sudah mentok)
let wheelLock = false;
document.addEventListener("wheel", e => {
  if (wheelLock || Math.abs(e.deltaY) < 20) return;
  const s = slides[index];
  const atBottom = s.scrollTop + s.clientHeight >= s.scrollHeight - 4;
  const atTop = s.scrollTop <= 0;
  if ((e.deltaY > 0 && atBottom) || (e.deltaY < 0 && atTop)) {
    wheelLock = true;
    goTo(index + (e.deltaY > 0 ? 1 : -1));
    setTimeout(() => { wheelLock = false; }, 750);
  }
}, { passive: true });

// Geser (swipe) vertikal di layar sentuh
let startY = null;
document.addEventListener("touchstart", e => { startY = e.touches[0].clientY; }, { passive: true });
document.addEventListener("touchend", e => {
  if (startY === null) return;
  const dy = e.changedTouches[0].clientY - startY;
  const s = slides[index];
  const atBottom = s.scrollTop + s.clientHeight >= s.scrollHeight - 4;
  const atTop = s.scrollTop <= 0;
  if (Math.abs(dy) > 70) {
    if (dy < 0 && atBottom) goTo(index + 1);
    else if (dy > 0 && atTop) goTo(index - 1);
  }
  startY = null;
}, { passive: true });

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}
document.getElementById("full").addEventListener("click", toggleFullscreen);

/* ---------- WIREFRAME ---------- */
const tabsEl = document.getElementById("wfTabs");
const wfImg  = document.getElementById("wfImg");
const wfCap  = document.getElementById("wfCap");

function tampilWireframe(i) {
  const w = wireframes[i];
  wfImg.style.animation = "none"; void wfImg.offsetWidth; wfImg.style.animation = "";
  wfImg.src = w.file;
  wfImg.alt = `Wireframe halaman ${w.nama}`;
  wfCap.textContent = `${i + 1}. ${w.nama} — ${w.ket}`;
  [...tabsEl.children].forEach((t, k) => t.classList.toggle("on", k === i));
}

wireframes.forEach((w, i) => {
  const b = document.createElement("button");
  b.className = "tab";
  b.textContent = w.nama;
  b.addEventListener("click", () => tampilWireframe(i));
  tabsEl.appendChild(b);
});
tampilWireframe(1); // mulai dari Dashboard

/* ---------- HASIL APLIKASI ---------- */
const hsTabs = document.getElementById("hsTabs");
const hsImg  = document.getElementById("hsImg");
const hsCap  = document.getElementById("hsCap");

function tampilHasil(i) {
  const w = hasil[i];
  hsImg.style.animation = "none"; void hsImg.offsetWidth; hsImg.style.animation = "";
  hsImg.src = w.file;
  hsImg.alt = `Tampilan halaman ${w.nama}`;
  hsCap.textContent = `${i + 1}. ${w.nama} — ${w.ket}`;
  [...hsTabs.children].forEach((t, k) => t.classList.toggle("on", k === i));
}

hasil.forEach((w, i) => {
  const b = document.createElement("button");
  b.className = "tab";
  b.textContent = w.nama;
  b.addEventListener("click", () => tampilHasil(i));
  hsTabs.appendChild(b);
});
tampilHasil(1); // mulai dari Dashboard

/* ---------- PROGRES ---------- */
const labelStatus = { done: "Selesai", progress: "Berjalan", todo: "Belum mulai" };
const tasksEl = document.getElementById("tasks");

tugas.forEach(t => {
  const li = document.createElement("li");
  li.innerHTML = `
    <div class="task-top"><span>${t.nama}</span>
      <span><span class="badge ${t.status}">${labelStatus[t.status]}</span> &nbsp;${t.persen}%</span>
    </div>
    <div class="bar"><i data-w="${t.persen}"></i></div>`;
  tasksEl.appendChild(li);
});

const rataRata = Math.round(tugas.reduce((a, t) => a + t.persen, 0) / tugas.length);

function animasiProgres() {
  document.querySelectorAll(".bar i").forEach(el => { el.style.width = "0"; });
  document.getElementById("ring").style.setProperty("--p", 0);
  document.getElementById("ringVal").textContent = "0%";
  setTimeout(() => {
    document.querySelectorAll(".bar i").forEach(el => { el.style.width = el.dataset.w + "%"; });
    document.getElementById("ring").style.setProperty("--p", rataRata);
    // hitung naik pada angka di tengah ring
    let n = 0;
    const timer = setInterval(() => {
      n = Math.min(rataRata, n + 2);
      document.getElementById("ringVal").textContent = n + "%";
      if (n >= rataRata) clearInterval(timer);
    }, 18);
  }, 150);
}

/* ---------- RENCANA ---------- */
document.getElementById("nextList").innerHTML = rencana.map(r => `<li>${r}</li>`).join("");

/* ---------- IKON (Bootstrap Icons via CDN) ---------- */
const ikonSlide = {
  "Deskripsi Masalah": "bi-exclamation-triangle", "Solusi": "bi-lightbulb", "Business Logic": "bi-diagram-3",
  "Role & Access Matrix": "bi-shield-lock", "SRS Fungsional": "bi-list-check", "SRS Nonfungsional": "bi-gear",
  "Use Case": "bi-people", "Activity Diagram": "bi-activity", "Sequence Diagram": "bi-arrow-left-right",
  "Class Diagram": "bi-boxes", "Wireframe": "bi-layout-wtf", "Hasil Aplikasi": "bi-window-desktop",
  "Fitur Terimplementasi": "bi-patch-check", "Progres": "bi-graph-up-arrow", "Pembagian 3 Bahasa": "bi-code-slash",
  "Selanjutnya": "bi-signpost-split"
};
slides.forEach(s => {
  const ik = ikonSlide[s.dataset.title];
  const eb = s.querySelector(".eyebrow");
  if (ik && eb) eb.insertAdjacentHTML("afterbegin", `<i class="bi ${ik}"></i> `);
});
const ikonMasalah = ["bi-pencil-x", "bi-question-circle", "bi-journal-text", "bi-calculator", "bi-bar-chart-line"];
document.querySelectorAll(".num b").forEach((b, i) => { b.innerHTML = `<i class="bi ${ikonMasalah[i] || "bi-dot"}"></i>`; });
const ikonSolusi = ["bi-plus-lg", "bi-tags", "bi-clock-history", "bi-cash-coin", "bi-graph-up"];
document.querySelectorAll(".steps li b").forEach((b, i) => { b.innerHTML = `<i class="bi ${ikonSolusi[i] || "bi-check"}"></i>`; });
document.querySelectorAll(".arrow").forEach(a => { a.innerHTML = '<i class="bi bi-arrow-right"></i>'; });
document.querySelectorAll(".avatar").forEach(a => {
  a.innerHTML = `<i class="bi ${a.classList.contains("admin") ? "bi-person-gear" : "bi-person"}"></i>`;
});

/* ---------- MULAI ---------- */
const awal = parseInt(location.hash.slice(1), 10);
goTo(Number.isNaN(awal) ? 0 : awal - 1);