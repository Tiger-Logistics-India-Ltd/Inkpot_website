/**
 * Pretty-prints the prerendered HTML that Next.js writes to .next/server/app.
 *
 * React's server renderer streams markup with no whitespace between elements,
 * so `view-source` shows one very long line. Nothing in Next.js config changes
 * that (verified: building with turbopackMinify + serverMinification disabled
 * still emits a single line), so the only place to intervene is after the build.
 *
 * The rule that keeps this safe: whitespace is only ever inserted between
 * sibling elements when the parent contains NO direct text and NO inline
 * children. In that situation the added text nodes are whitespace-only, which
 * block, flex and grid containers all discard during layout. Anywhere text or
 * inline elements are involved — where whitespace would collapse into a visible
 * space and shift the rendering — the original markup is emitted untouched.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";

const BUILD_DIR = ".next/server/app";
const INDENT = "  ";

// Content of these is opaque: reformatting it would corrupt the RSC payload,
// CSS, or preformatted text.
const OPAQUE = new Set(["script", "style", "pre", "textarea"]);

// Whitespace between these renders as a visible space, so never break around them.
const INLINE = new Set([
  "a", "abbr", "b", "bdi", "bdo", "br", "button", "cite", "code", "data",
  "dfn", "em", "i", "img", "input", "kbd", "label", "mark", "q", "s", "samp",
  "select", "small", "span", "strong", "sub", "sup", "svg", "textarea", "time",
  "u", "var", "wbr",
]);

const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
  "param", "source", "track", "wbr",
]);

/** Tokenize into tags, text and opaque blocks without disturbing their bytes. */
function tokenize(html) {
  const tokens = [];
  let i = 0;

  while (i < html.length) {
    const lt = html.indexOf("<", i);
    if (lt === -1) {
      if (i < html.length) tokens.push({ type: "text", raw: html.slice(i) });
      break;
    }
    if (lt > i) tokens.push({ type: "text", raw: html.slice(i, lt) });

    // Comments and doctype pass through verbatim.
    if (html.startsWith("<!--", lt)) {
      const end = html.indexOf("-->", lt);
      const stop = end === -1 ? html.length : end + 3;
      tokens.push({ type: "comment", raw: html.slice(lt, stop) });
      i = stop;
      continue;
    }
    if (html.startsWith("<!", lt)) {
      const end = html.indexOf(">", lt);
      const stop = end === -1 ? html.length : end + 1;
      tokens.push({ type: "doctype", raw: html.slice(lt, stop) });
      i = stop;
      continue;
    }

    const gt = html.indexOf(">", lt);
    if (gt === -1) {
      tokens.push({ type: "text", raw: html.slice(lt) });
      break;
    }

    const raw = html.slice(lt, gt + 1);
    const m = /^<\/?\s*([a-zA-Z][a-zA-Z0-9-]*)/.exec(raw);
    if (!m) {
      tokens.push({ type: "text", raw });
      i = gt + 1;
      continue;
    }

    const name = m[1].toLowerCase();
    const closing = raw[1] === "/";

    // Swallow opaque elements whole so their contents are never reindented.
    if (!closing && OPAQUE.has(name)) {
      const closeTag = `</${name}`;
      const ci = html.toLowerCase().indexOf(closeTag, gt);
      if (ci !== -1) {
        const ce = html.indexOf(">", ci);
        const stop = ce === -1 ? html.length : ce + 1;
        tokens.push({ type: "opaque", name, raw: html.slice(lt, stop) });
        i = stop;
        continue;
      }
    }

    const selfClosing = VOID.has(name) || /\/>$/.test(raw);
    tokens.push({
      type: closing ? "close" : "open",
      name,
      raw,
      selfClosing,
    });
    i = gt + 1;
  }

  return tokens;
}

/** Build a tree so each element can be asked whether it is safe to break. */
function parse(tokens) {
  const root = { children: [] };
  const stack = [root];

  for (const t of tokens) {
    const parent = stack[stack.length - 1];
    if (t.type === "open" && !t.selfClosing) {
      const node = { ...t, children: [] };
      parent.children.push(node);
      stack.push(node);
    } else if (t.type === "close") {
      // Only unwind to a matching ancestor; stray closers are kept as-is.
      const idx = stack.findLastIndex((n) => n.name === t.name);
      if (idx > 0) stack.length = idx;
      else parent.children.push({ ...t, children: [] });
    } else {
      parent.children.push({ ...t, children: [] });
    }
  }

  return root;
}

/**
 * Breaking is safe only when every child is an element, none of them inline,
 * and there is no direct text. Otherwise added whitespace could render.
 */
function canBreak(node) {
  const kids = node.children;
  if (kids.length === 0) return false;

  for (const k of kids) {
    if (k.type === "text" && k.raw.trim() !== "") return false;
    if (k.type === "opaque" && INLINE.has(k.name)) return false;
    if ((k.type === "open" || k.type === "close") && INLINE.has(k.name)) return false;
  }
  return kids.some((k) => k.type === "open" || k.type === "opaque" || k.type === "close");
}

function render(node, depth, out) {
  const pad = INDENT.repeat(depth);
  const broken = canBreak(node);

  for (const child of node.children) {
    if (child.type === "text") {
      // Whitespace-only text between elements is replaced by our own indenting.
      if (broken && child.raw.trim() === "") continue;
      out.push(child.raw);
      continue;
    }

    if (broken) out.push("\n" + pad);

    if (child.type === "open" && !child.selfClosing) {
      out.push(child.raw);
      render(child, depth + 1, out);
      if (canBreak(child)) out.push("\n" + pad);
      out.push(`</${child.name}>`);
    } else {
      out.push(child.raw);
    }
  }
}

function format(html) {
  const tree = parse(tokenize(html));
  const out = [];
  render(tree, 0, out);
  return out.join("").replace(/^\n+/, "") + "\n";
}

/** Structural guard: the tag sequence and visible text must be unchanged. */
function tagSequence(html) {
  return (html.match(/<\/?[a-zA-Z][a-zA-Z0-9-]*/g) || [])
    .map((s) => s.toLowerCase())
    .join(",");
}

function visibleText(html) {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function* htmlFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (extname(e.name) === ".html") yield p;
  }
}

let changed = 0;
let skipped = 0;

for await (const file of htmlFiles(BUILD_DIR)) {
  const original = await readFile(file, "utf8");
  const formatted = format(original);

  // Refuse to write anything that altered structure or copy.
  if (
    tagSequence(original) !== tagSequence(formatted) ||
    visibleText(original) !== visibleText(formatted)
  ) {
    console.warn(`  skipped (would alter content): ${file}`);
    skipped += 1;
    continue;
  }

  await writeFile(file, formatted, "utf8");
  changed += 1;
}

console.log(`format-html: reformatted ${changed} file(s), skipped ${skipped}`);
