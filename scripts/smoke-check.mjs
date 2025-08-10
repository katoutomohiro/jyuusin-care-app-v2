// scripts/smoke-check.mjs
import fs from "node:fs";
import path from "node:path";

const mustExist = [
  "index.html",
  "src/main.tsx",
  "src/App.tsx",
  "vite.config.ts"
];

const errs = [];

for (const p of mustExist) {
  if (!fs.existsSync(path.resolve(p))) {
    errs.push(`missing: ${p}`);
  }
}

// env チェック（任意）
const envLocal = ".env.local";
if (fs.existsSync(envLocal)) {
  const txt = fs.readFileSync(envLocal, "utf8");
  if (!txt.includes("VITE_DEV_PORT=3005")) {
    errs.push(`.env.local lacks VITE_DEV_PORT=3005`);
  }
}

if (errs.length) {
  console.error("[SMOKE] failed\n" + errs.map(e => " - " + e).join("\n"));
  process.exit(1);
}
console.log("[SMOKE] ok");
