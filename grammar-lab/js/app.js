const $ = (s) => document.querySelector(s),
  A = $("#app");
const E = (s) =>
  String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const norm = (s) =>
    String(s)
      .toLowerCase()
      .replace(/[.,!?;:]/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  shuf = (a) => [...a].sort(() => Math.random() - 0.5);
const ytId = (v) => {
  v = String(v || "");
  const m =
    v.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || v.match(/^[\w-]{11}$/);
  return m ? m[1] || m[0] : "";
};
let C = {};
const load = async () => {
  const [ms, qs, at] = await Promise.all([
    Store.list("materials"),
    Store.list("questions"),
    Store.list("attempts", !Store.me.admin),
  ]);
  ms.sort((a, b) => a.order - b.order);
  C = { ms, qs, at };
  return C;
};
const mine = () =>
  Object.fromEntries(
    C.at.filter((a) => a.userId === Store.me.id).map((a) => [a.kind, a]),
  );
function auth() {
  return `<section class="hero"><p class="demo">She <s>go</s> <mark>goes</mark> to campus every day.</p><h1>Latihan grammar yang kelihatan hasilnya.</h1>
<p>Kerjakan pre-test, belajar di sini, lalu post-test. Skormu dibandingkan supaya perubahannya jelas.</p></section>
<section class="forms"><form data-f="login"><h2>Masuk</h2><input name="email" type="email" placeholder="Email" required><input name="pw" type="password" placeholder="Password" required><button>Masuk</button><p class="err"></p>${Store.live ? "" : '<p class="hint">Mode demo. Admin: admin@demo.id / admin123</p>'}</form>
<form data-f="reg"><h2>Buat akun</h2><input name="fullName" placeholder="Nama lengkap" required><input name="prodi" placeholder="Program studi" required><input name="nim" placeholder="NIM" required>
<input name="email" type="email" placeholder="Email" required><input name="pw" type="password" minlength="6" placeholder="Password (min. 6 karakter)" required><button>Buat akun</button><p class="err"></p></form></section>`;
}
async function dash() {
  await load();
  const a = mine(),
    rd = Store.me.read || [],
    n = C.ms.filter((m) => rd.includes(m.id)).length,
    all = C.ms.length > 0 && n === C.ms.length;
  const st = [
    [
      "Pre-test",
      "#/tes/pre",
      !!a.pre,
      true,
      a.pre ? "Sudah dikerjakan" : "Kerjakan dulu sebelum belajar",
    ],
    [
      "Belajar",
      "#/belajar",
      all,
      !!a.pre,
      `${n} dari ${C.ms.length} materi dibaca`,
    ],
    [
      "Post-test",
      "#/tes/post",
      !!a.post,
      !!a.pre && all,
      a.post ? "Sudah dikerjakan" : "Terbuka setelah semua materi dibaca",
    ],
    ["Hasil", "#/hasil", false, !!a.post, "Lihat perubahan skormu"],
  ];
  return `<h1>Halo, ${E(Store.me.fullName)}</h1><ol class="steps">${st.map((s) => `<li class="${s[2] ? "done" : s[3] ? "open" : "lock"}">${s[3] ? `<a href="${s[1]}">` : "<span>"}<b>${s[0]}</b><small>${s[4]}</small>${s[3] ? "</a>" : "</span>"}</li>`).join("")}</ol>`;
}
async function belajar() {
  await load();
  const rd = Store.me.read || [];
  return `<a href="#/">← Kembali</a><h1>Materi</h1>${C.ms.map((m) => `<a class="row" href="#/m/${m.id}">${E(m.title)}<i>${rd.includes(m.id) ? "sudah dibaca" : "belum"}</i></a>`).join("") || "<p>Belum ada materi.</p>"}`;
}
async function materi(id) {
  await load();
  const m = C.ms.find((x) => x.id === id);
  if (!m) return "<p>Materi tidak ditemukan.</p>";
  const v = ytId(m.youtube);
  return `<a href="#/belajar">← Daftar materi</a><h1>${E(m.title)}</h1>${String(
    m.body || "",
  )
    .split("\n")
    .filter(Boolean)
    .map((l) =>
      l.startsWith(">")
        ? `<p class="ex">${E(l.slice(1).trim())}</p>`
        : `<p>${E(l)}</p>`,
    )
    .join("")}
 ${v ? `<div class="vid"><iframe src="https://www.youtube.com/embed/${v}" allowfullscreen loading="lazy"></iframe></div>` : ""}<button data-a="read" data-id="${m.id}">Tandai selesai</button>`;
}
async function tes(kind) {
  await load();
  const a = mine();
  if (a[kind])
    return `<a href="#/">← Kembali</a><h1>${kind === "pre" ? "Pre-test" : "Post-test"}</h1><p>Kamu sudah mengerjakan tes ini. Tes hanya bisa dikerjakan satu kali.</p>`;
  const qs = C.qs.filter((q) => (q.use || []).includes(kind));
  if (!qs.length) return "<p>Belum ada soal untuk tes ini.</p>";
  return `<a href="#/">← Kembali</a><h1>${kind === "pre" ? "Pre-test" : "Post-test"}</h1><form data-f="test" data-kind="${kind}">${qs
    .map(
      (q, i) =>
        `<fieldset data-id="${q.id}"><legend>${i + 1}. ${E(q.text)}</legend>` +
        (q.type === "mc"
          ? shuf(q.options)
              .map(
                (o) =>
                  `<label class="opt"><input type="radio" name="q${i}" value="${E(o)}">${E(o)}</label>`,
              )
              .join("")
          : q.type === "fill"
            ? `<input name="q${i}" autocomplete="off" placeholder="Jawabanmu">`
            : `<div class="ord" data-i="${i}"><div class="ans"></div><div class="pool">${shuf(
                q.answer.split(/\s+/),
              )
                .map(
                  (w) =>
                    `<button type="button" class="chip" data-a="chip">${E(w)}</button>`,
                )
                .join("")}</div></div>`) +
        `</fieldset>`,
    )
    .join("")}<button>Kirim jawaban</button><p class="err"></p></form>`;
}
async function hasil() {
  await load();
  const a = mine();
  if (!a.pre || !a.post)
    return "<p>Hasil muncul setelah pre-test dan post-test selesai.</p>";
  const p = (a.pre.score / a.pre.total) * 100,
    q = (a.post.score / a.post.total) * 100,
    d = Math.round(q - p);
  return `<a href="#/">← Kembali</a><h1>${d > 0 ? "Skormu naik " + d + " poin" : d < 0 ? "Skormu turun " + Math.abs(d) + " poin" : "Skormu tetap"}</h1>${[
    ["Pre-test", a.pre, p],
    ["Post-test", a.post, q],
  ]
    .map(
      (r) =>
        `<div class="bar"><span>${r[0]}: ${r[1].score}/${r[1].total}</span><div><i style="width:${r[2]}%"></i></div></div>`,
    )
    .join("")}<p class="hint">Terima kasih sudah ikut.</p>`;
}
function csv(rows) {
  const h = Object.keys(rows[0] || {}),
    q = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
  return [
    h.join(","),
    ...rows.map((r) => h.map((k) => q(r[k])).join(",")),
  ].join("\n");
}
async function admin(tab) {
  await load();
  const us = (await Store.list("users")).filter((u) => !u.admin),
    tabs = ["responden", "materi", "soal"];
  tab = tabs.includes(tab) ? tab : "responden";
  let b = "";
  if (tab === "responden") {
    const rows = us.map((u) => {
      const p = C.at.find((a) => a.userId === u.id && a.kind === "pre"),
        o = C.at.find((a) => a.userId === u.id && a.kind === "post"),
        f = (x) => (x ? Math.round((x.score / x.total) * 100) : "");
      return {
        NIM: u.nim,
        Nama: u.fullName,
        Prodi: u.prodi,
        Email: u.email,
        Pre: f(p),
        Post: f(o),
        Selisih: p && o ? f(o) - f(p) : "",
      };
    });
    window._csv = csv(rows);
    b = `<p>${rows.length} responden. Skor dalam persen.</p><button data-a="csv">Ekspor CSV</button><div class="scroll"><table><tr>${["NIM", "Nama", "Prodi", "Pre", "Post", "Selisih"].map((h) => `<th>${h}</th>`).join("")}</tr>${rows.map((r) => `<tr><td>${E(r.NIM)}</td><td>${E(r.Nama)}</td><td>${E(r.Prodi)}</td><td>${r.Pre}</td><td>${r.Post}</td><td>${r.Selisih}</td></tr>`).join("")}</table></div>`;
  } else if (tab === "materi")
    b = `<form data-f="mat"><input type="hidden" name="id"><input name="title" placeholder="Judul materi" required><input name="order" type="number" placeholder="Urutan" required><textarea name="body" rows="6" placeholder="Isi materi. Baris yang diawali > jadi contoh kalimat."></textarea><input name="youtube" placeholder="Link / ID video YouTube (opsional)"><button>Simpan materi</button></form>
  ${C.ms.map((m) => `<div class="row">${E(m.order + ". " + m.title)}<span><button class="ghost" data-a="edit" data-c="ms" data-id="${m.id}">Edit</button> <button class="ghost" data-a="del" data-c="materials" data-id="${m.id}">Hapus</button></span></div>`).join("")}`;
  else
    b = `<form data-f="soal"><input type="hidden" name="id"><select name="type"><option value="mc">Pilihan ganda</option><option value="fill">Isian</option><option value="order">Susun kalimat</option></select><input name="text" placeholder="Teks soal (isian: tulis ___ di bagian kosong)" required>
  <textarea name="options" rows="4" placeholder="Pilihan ganda: satu opsi per baris, BARIS PERTAMA = jawaban benar"></textarea><input name="answer" placeholder="Isian / susun kalimat: jawaban benar (isian boleh beberapa, pisahkan dengan |)">
  <label class="opt"><input type="checkbox" name="pre" checked>Dipakai di pre-test</label><label class="opt"><input type="checkbox" name="post" checked>Dipakai di post-test</label><button>Simpan soal</button></form>
  ${C.qs.map((q) => `<div class="row">${E(q.type + ": " + q.text)}<span><button class="ghost" data-a="edit" data-c="qs" data-id="${q.id}">Edit</button> <button class="ghost" data-a="del" data-c="questions" data-id="${q.id}">Hapus</button></span></div>`).join("")}`;
  return `<h1>Panel admin</h1><div class="tabs">${tabs.map((t) => `<a class="${t === tab ? "on" : ""}" href="#/admin/${t}">${t}</a>`).join("")}<button class="ghost" data-a="seed">Isi data awal</button></div>${b}`;
}
async function view() {
  const [, p, id] = location.hash.split("/"),
    me = Store.me;
  $("#nav").innerHTML = me
    ? (me.admin ? '<a href="#/">Admin</a>' : '<a href="#/">Beranda</a>') +
      '<button class="ghost" data-a="out">Keluar</button>'
    : "";
  try {
    A.innerHTML = !me
      ? auth()
      : me.admin
        ? await admin(p === "admin" ? id : "responden")
        : p === "belajar"
          ? await belajar()
          : p === "m"
            ? await materi(id)
            : p === "tes"
              ? await tes(id)
              : p === "hasil"
                ? await hasil()
                : await dash();
  } catch (e) {
    A.innerHTML = `<p class="err">${E(e.message)}</p>`;
  }
}
document.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target,
    d = Object.fromEntries(new FormData(f)),
    k = f.dataset.f,
    m = f.querySelector(".err");
  try {
    if (m) m.textContent = "";
    if (k === "login") await Store.login(d.email, d.pw);
    else if (k === "reg") {
      const { pw, ...p } = d;
      await Store.register(p, pw);
    } else if (k === "test") {
      const kind = f.dataset.kind,
        qs = [...f.querySelectorAll("fieldset")].map((x) =>
          C.qs.find((q) => q.id === x.dataset.id),
        );
      let sc = 0;
      const detail = qs.map((q, i) => {
        let ok = false;
        if (q.type === "mc") ok = d["q" + i] === q.options[0];
        else if (q.type === "fill")
          ok = String(q.answer)
            .split("|")
            .map(norm)
            .includes(norm(d["q" + i] || ""));
        else
          ok =
            norm(
              [...f.querySelectorAll(`.ord[data-i="${i}"] .ans .chip`)]
                .map((c) => c.textContent)
                .join(" "),
            ) === norm(q.answer);
        sc += ok;
        return { q: q.id, ok };
      });
      await Store.set("attempts", Store.me.id + "_" + kind, {
        userId: Store.me.id,
        kind,
        score: sc,
        total: qs.length,
        detail,
        at: new Date().toISOString(),
      });
      location.hash = "#/";
      await view();
      return;
    } else if (k === "mat") {
      const id = d.id || "m" + Date.now();
      await Store.set("materials", id, {
        title: d.title,
        order: +d.order,
        body: d.body,
        youtube: d.youtube,
      });
    } else if (k === "soal") {
      const id = d.id || "q" + Date.now(),
        o = {
          type: d.type,
          text: d.text,
          use: ["pre", "post"].filter((x) => d[x]),
        };
      if (d.type === "mc")
        o.options = d.options
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      else o.answer = d.answer;
      if (d.type === "mc" && o.options.length < 2)
        throw Error("Isi minimal 2 opsi.");
      await Store.set("questions", id, o);
    }
    view();
  } catch (x) {
    m ? (m.textContent = x.message) : alert(x.message);
  }
});
document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-a]");
  if (!b) return;
  const a = b.dataset.a,
    id = b.dataset.id;
  if (a === "out") {
    await Store.logout();
    location.hash = "#/";
    view();
  }
  if (a === "read") {
    await Store.markRead(id);
    location.hash = "#/belajar";
  }
  if (a === "chip") {
    const o = b.closest(".ord");
    o.querySelector(
      b.parentNode.className === "pool" ? ".ans" : ".pool",
    ).append(b);
  }
  if (a === "seed") {
    await Store.seed();
    view();
  }
  if (a === "del" && confirm("Hapus data ini?")) {
    await Store.del(b.dataset.c, id);
    view();
  }
  if (a === "edit") {
    const r = C[b.dataset.c].find((x) => x.id === id),
      f = $("form");
    for (const k in r) {
      const el = f.elements[k];
      if (el && el.type !== "checkbox")
        el.value = Array.isArray(r[k]) ? r[k].join("\n") : r[k];
    }
    if (f.elements.pre) {
      f.elements.pre.checked = (r.use || []).includes("pre");
      f.elements.post.checked = (r.use || []).includes("post");
    }
    f.elements.id.value = id;
    scrollTo(0, 0);
  }
  if (a === "csv") {
    const u = URL.createObjectURL(
        new Blob([window._csv], { type: "text/csv" }),
      ),
      l = document.createElement("a");
    l.href = u;
    l.download = "responden.csv";
    l.click();
  }
});
addEventListener("hashchange", view);
Store.init().then(view);
