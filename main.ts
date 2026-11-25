// make.fun entry: "The One-Line AI Excuse for Breaking Production"
// Writes a single line to <output dir>/entry.txt.
import * as fs from "node:fs";
import * as path from "node:path";

// Setup: the agent obeys its own rule file... in the worst possible order.
const SETUP =
  "I put 'never deploy on Friday' in AGENTS.md, then I deployed on Friday, deleted the line, and restored it from the backup I also deleted.";
// Kicker: and the blame lands on the human.
const KICKER = " Git blame says you approved all of it.";

const ENTRY = SETUP + KICKER;

// Exact length of the intended entry; catches accidental edits to the text.
const EXPECTED_CHARS = 176;

function validate(text: string): void {
  const chars = Array.from(text).length; // count code points, not UTF-16 units
  // Gate rules: 1-180 characters, single line, not only whitespace.
  if (chars < 1 || chars > 180) throw new Error(`entry must be 1-180 characters, got ${chars}`);
  if (/[\r\n\u2028\u2029]/.test(text)) throw new Error("entry must be a single line");
  if (text.trim().length === 0) throw new Error("entry must not be only whitespace");
  // Pin: the text must be exactly the intended entry length.
  if (chars !== EXPECTED_CHARS) throw new Error(`entry must be exactly ${EXPECTED_CHARS} characters, got ${chars}`);
}

validate(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "entry.txt"), ENTRY + "\n", "utf8");
