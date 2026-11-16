#!/usr/bin/env node
/*
 * Concatenates the per-module stylesheets into css/layout.css.
 *
 *     node tools/build-css.js
 *
 * Needs no compiler, unlike onyx: layout ships plain .css, not .less, so this
 * is concatenation and nothing else. It exists so that a page can link one
 * file instead of ten, which is what enyo-dev used to produce.
 *
 * Order is recomputed from the ES module import graph, so a module's
 * stylesheet follows those of the modules it imports. Only one selector
 * (.enyo-locale-right-to-left) appears in more than one file today, but the
 * ordering is free and keeps the output stable.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function walk (dir, out) {
	out = out || [];
	for (const e of fs.readdirSync(dir, {withFileTypes: true}).sort((a, b) => a.name < b.name ? -1 : 1)) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) walk(p, out);
		else if (e.name.endsWith('.js')) out.push(path.relative(ROOT, p));
	}
	return out;
}

const files = walk(path.join(ROOT, 'src'));
const deps = {};
for (const f of files) {
	deps[f] = [];
	const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
	for (const m of src.matchAll(/^import(?:\s[^;\n]*from)?\s*['"](\.[^'"]+)['"]\s*;/gm)) {
		const t = path.relative(ROOT, path.resolve(path.dirname(path.join(ROOT, f)), m[1]));
		if (files.indexOf(t) !== -1) deps[f].push(t);
	}
}

const seen = {}, order = [];
function visit (f) {
	if (seen[f]) return;
	seen[f] = true;
	for (const d of deps[f] || []) visit(d);
	order.push(f);
}
files.forEach(visit);

const pieces = [];
for (const f of order) {
	const pj = path.join(path.dirname(path.join(ROOT, f)), 'package.json');
	if (!fs.existsSync(pj)) continue;
	for (const s of JSON.parse(fs.readFileSync(pj, 'utf8')).styles || []) {
		const rel = path.relative(ROOT, path.join(path.dirname(pj), s));
		if (pieces.indexOf(rel) === -1) pieces.push(rel);
	}
}

const header = '/* Generated from the per-module stylesheets by tools/build-css.js. Do not edit. */\n';
const out = pieces.map(function (p) {
	return '/* ' + p + ' */\n' + fs.readFileSync(path.join(ROOT, p), 'utf8').replace(/\s*$/, '') + '\n';
}).join('\n');

fs.mkdirSync(path.join(ROOT, 'css'), {recursive: true});
fs.writeFileSync(path.join(ROOT, 'css', 'layout.css'), header + out);
console.log('css/layout.css written from ' + pieces.length + ' stylesheets');
