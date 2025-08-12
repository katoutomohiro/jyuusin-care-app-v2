// 追加: devサーバーの重要ルートをチェック
import http from "node:http";

function checkUrl(url, expect, label) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        if (res.statusCode !== 200) {
          errs.push(`[SMOKE] ${label} status ${res.statusCode}`);
        } else if (expect && !data.includes(expect)) {
          errs.push(`[SMOKE] ${label} missing: ${expect}`);
        }
        resolve();
      });
    }).on("error", () => {
      errs.push(`[SMOKE] ${label} unreachable`);
      resolve();
    });
  });
}

async function runChecks() {
  await checkUrl("http://127.0.0.1:3005/__diag.txt", "repo_path=", "__diag.txt");
  await checkUrl("http://127.0.0.1:3005/daily-log", "日誌入力", "daily-log");
  await checkUrl("http://127.0.0.1:3005/daily-log/__probe", "Dev Probe Route", "daily-log/__probe");
  if (errs.length) {
    console.error("[SMOKE] failed\n" + errs.map(e => " - " + e).join("\n"));
    process.exit(1);
  }
}

runChecks().then(() => {
  if (!errs.length) console.log("[SMOKE] ok");
});
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
