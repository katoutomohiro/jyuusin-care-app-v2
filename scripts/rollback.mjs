import { execSync } from "node:child_process";
const tag = process.argv[2];
if (!tag) {
  console.error("Usage: npm run rollback <tag>");
  process.exit(1);
}
execSync(`git reset --hard ${tag}`, { stdio: "inherit" });
console.log(`[ROLLBACK] restored to ${tag}`);
