// Usage: node scripts/check-locale-parity.js [locale]  (default: id)
const fs = require("fs")
const loc = process.argv[2] || "id"
let bad = 0
const sig = (s) => ({
  ph: (s.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g) || []).map((m) => m.split(",")[0].replace(/[{}\s]/g, "")).sort().join("|"),
  tags: (s.match(/<\/?[a-zA-Z0-9]+[^>]*>/g) || []).sort().join("|"),
})
for (const f of ["client", "server"]) {
  const en = JSON.parse(fs.readFileSync(`locale/en/${f}.json`, "utf8"))
  const t = JSON.parse(fs.readFileSync(`locale/${loc}/${f}.json`, "utf8"))
  const ek = Object.keys(en), tk = Object.keys(t)
  const missing = ek.filter((k) => !(k in t)), extra = tk.filter((k) => !(k in en))
  const empty = ek.filter((k) => k in t && (t[k] === "" || typeof t[k] !== "string"))
  const same = ek.filter((k) => t[k] === en[k]).length
  const mism = ek.filter((k) => k in t && typeof t[k] === "string" && JSON.stringify(sig(en[k])) !== JSON.stringify(sig(t[k])))
  const order = JSON.stringify(ek) === JSON.stringify(tk)
  console.log(`${f}: en=${ek.length} ${loc}=${tk.length} missing=${missing.length} extra=${extra.length} empty=${empty.length} identicalToEn=${same} placeholder/tag mismatches=${mism.length} sameOrder=${order}`)
  ;[...missing.map((k) => "MISSING " + k), ...extra.map((k) => "EXTRA " + k), ...empty.map((k) => "EMPTY " + k), ...mism.map((k) => `MISMATCH ${k}\n  en: ${en[k]}\n  ${loc}: ${t[k]}`)].forEach((l) => console.log(" ", l))
  bad += missing.length + extra.length + empty.length + mism.length
}
process.exit(bad ? 1 : 0)
