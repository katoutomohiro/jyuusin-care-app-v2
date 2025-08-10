import { execSync } from "node:child_process";
const tag = "snap-" + new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0,12);
execSync(`git add -A`, { stdio: "inherit" });
execSync(`git commit -m "chore: snapshot before change (${tag})"`, { stdio: "inherit" });
execSync(`git tag ${tag}`, { stdio: "inherit" });
console.log(`[SNAPSHOT] created tag: ${tag}`);
