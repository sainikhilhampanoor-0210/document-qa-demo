async function ask(query, previous_order = null) {
  const response = await fetch('/api/query', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({query, previous_order})});
  if (!response.ok) throw new Error("Service returned " + response.status);
  return response.json();
}
import { retrieve, documents } from './engine.mjs';
for (const [title, body] of documents) {
  const li = document.createElement('li');
  li.textContent = title + ' — ' + body;
  document.querySelector('#sources').append(li);
}
const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const resultBox = event.currentTarget.querySelector('output');
  try {
  const query = form.querySelector('input').value.trim();
  if (!query) return;
  const output = form.querySelector('output');
  const {answer, citations} = await ask(query);
  output.textContent = [answer, ...citations.map(c => 'Source: ' + c.document + ' — ' + c.quote)].join('\n');
  } catch { resultBox.textContent = 'The service is unavailable. Please try again.'; }
});