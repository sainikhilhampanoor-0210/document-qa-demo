import { retrieve, documents } from './engine.mjs';
for (const [title, body] of documents) {
  const li = document.createElement('li');
  li.textContent = title + ' — ' + body;
  document.querySelector('#sources').append(li);
}
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = form.querySelector('input').value.trim();
  if (!query) return;
  const output = form.querySelector('output');
  output.textContent = retrieve(query);
});
