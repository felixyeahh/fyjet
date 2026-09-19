importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

async function handleRequest(event) {
	await scramjet.loadConfig();
	if (scramjet.route(event)) {
		console.info("Serving request", event.request.url);
		return scramjet.fetch(event);
	}
	return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
	// if ($checkEligibility()) {
		console.warn("Serving request", event.request.url);
		event.respondWith(handleRequest(event));
	// }
});
