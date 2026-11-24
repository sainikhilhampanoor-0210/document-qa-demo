# Document Q&A

The Python service splits documents into passages, weights matches by term rarity and title, then returns excerpts with their source titles. You can supply your own plain-text collection in the API explorer.

[Try the browser demo](https://sainikhilhampanoor-0210.github.io/document-qa-demo/) · [Open the Python app](https://document-qa-demo.onrender.com) · [Explore the API](https://document-qa-demo.onrender.com/docs)

## Try it

Ask `What is the return policy?` to see the answer alongside the passage it came from. Try an unrelated topic to see how the service handles missing evidence.

## Inside the repository

- [Python service](service.py) — request validation and passage ranking and citation assembly.
- [Web client](server-client.mjs) — sends requests to the Python service and displays the response.
- [Browser engine](engine.mjs) — powers the standalone GitHub Pages demo.

## Run locally

Follow the [FastAPI and Docker instructions](BACKEND.md). For the standalone browser version, run `python3 -m http.server 8000` from the repository root and open `http://localhost:8000`.

This portfolio demo uses fictional data. The hosted Python service runs on Render’s free tier and may take a moment to wake up.

## Retrieval Evaluation Lab

[Launch the evaluation lab](https://sainikhilhampanoor-0210.github.io/document-qa-demo/retrieval-lab/) · [Read the evaluator](retrieval-lab/engine.mjs). Run the regression suite with `node retrieval-lab/test.mjs`.

## RAG Context Budget Planner

Choose a context budget and compare greedy packing with an exact optimizer. Each fictional passage has an estimated token cost and a relevance score. Edit those estimates to explore the trade-off.

[Open project](https://sainikhilhampanoor-0210.github.io/document-qa-demo/context-budget/) · [Source](context-budget/engine.mjs). Test locally with `node context-budget/test.mjs`.
