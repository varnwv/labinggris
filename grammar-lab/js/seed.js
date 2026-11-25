// DATA AWAL. Edit file ini di GitHub, lalu di panel admin klik "Isi data awal" (hanya mengisi yang belum ada).
// Materi: baris yang diawali ">" ditampilkan sebagai contoh kalimat. youtube: link atau ID video.
// Soal: type mc (options[0] = jawaban benar, urutan diacak otomatis) | fill (answer; beberapa jawaban pakai "|", tulis ___ di text) | order (answer = kalimat benar).
window.SEED = {
  materials: [
    {
      id: "m1",
      order: 1,
      title: "Simple Present Tense",
      youtube: "",
      body: "Dipakai untuk kebiasaan dan fakta umum.\nRumus: S + V1 (+s/es untuk he/she/it).\n> She goes to campus every day.\n> Water boils at 100°C.",
    },
    {
      id: "m2",
      order: 2,
      title: "Simple Past Tense",
      youtube: "",
      body: "Dipakai untuk kejadian yang sudah selesai di masa lalu.\nRumus: S + V2.\n> I visited Bandung last year.\n> They did not finish the report.",
    },
  ],
  questions: [
    {
      id: "q1",
      type: "mc",
      text: "She ___ to campus every day.",
      options: ["goes", "go", "going", "gone"],
      use: ["pre", "post"],
    },
    {
      id: "q2",
      type: "fill",
      text: "Yesterday, we ___ (watch) a documentary.",
      answer: "watched",
      use: ["pre", "post"],
    },
    {
      id: "q3",
      type: "order",
      text: "Susun kalimat yang benar.",
      answer: "He does not like coffee.",
      use: ["pre", "post"],
    },
  ],
};
