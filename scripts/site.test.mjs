import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p,root),'utf8');
const html = read('src/templates/index.html');
const cfg = JSON.parse(read('public/site-config.json'));
test('only one H1 and all main sections exist', () => {
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  for (const section of ['trayectoria','especialidades','empresas','contacto','preguntas']) assert.match(html,new RegExp(`id="${section}"`));
});
test('configuration has unverified contact fields empty', () => {
  for (const key of ['whatsapp','phone','email','siteUrl','serviceArea','portraitUrl']) assert.equal(cfg[key], '');
});
test('no fictional partnerships or 24-hour service claims', () => {
  assert.doesNotMatch(html, /atención 24 horas|servicio 24\/7|certificad[oa]s por|representante oficial/i);
});
test('functional script and hero asset are present', () => {
  for (const file of ['public/assets/main.js','public/assets/styles.css','public/assets/hero-industrial.webp','src/render.ts','src/pages/sitemap.xml.ts']) assert.equal(existsSync(new URL(file,root)),true);
});
test('no required form fields, and description is optional', () => {
  assert.match(html,/id="problem"[^>]*maxlength="500"/);
  assert.doesNotMatch(html,/<input[^>]*required|<select[^>]*required/);
});
