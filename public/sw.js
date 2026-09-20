importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

async function handleRequest(event) {
	await scramjet.loadConfig();
	if (scramjet.route(event)) {
		return scramjet.fetch(event);
	}
	return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
	/*if (event.request.url.includes(window.__ENV__.API_URL)) {
		return event.respondWith(fetch(event.request));
	}*/
	event.respondWith(handleRequest(event));
});
