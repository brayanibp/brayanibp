import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const staticDirectory = path.join(process.cwd(), ".next", "static");

const serverOnlyNames = [
  "RESEND_SECRET_KEY",
  "RECAPTCHA_SECRET_KEY",
  "UPSTASH_REDIS_REST_TOKEN",
  "UPSTASH_REDIS_REST_URL",
  "RATE_LIMIT_SALT",
  "CONTACT_TO_EMAIL",
];

const secretValues = [
  process.env.RESEND_SECRET_KEY,
  process.env.RECAPTCHA_SECRET_KEY,
  process.env.UPSTASH_REDIS_REST_TOKEN,
  process.env.RATE_LIMIT_SALT,
].filter((value) => typeof value === "string" && value.length >= 8);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (entry.isFile() && /\.(js|css|html|json)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

let files;

try {
  files = await walk(staticDirectory);
} catch {
  console.error(
    `Client secret scan failed: ${staticDirectory} does not exist. Run "pnpm build" first.`,
  );
  process.exit(1);
}

if (files.length === 0) {
  console.error("Client secret scan failed: no client assets found.");
  process.exit(1);
}

const violations = [];

for (const file of files) {
  const content = await readFile(file, "utf8");

  for (const name of serverOnlyNames) {
    if (content.includes(name)) {
      violations.push(`${path.relative(process.cwd(), file)} contains ${name}`);
    }
  }

  for (const value of secretValues) {
    if (content.includes(value)) {
      violations.push(
        `${path.relative(process.cwd(), file)} contains a server-only secret value`,
      );
    }
  }
}

if (violations.length > 0) {
  console.error("Client secret scan failed:");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(`Client secret scan passed (${files.length} files checked).`);
