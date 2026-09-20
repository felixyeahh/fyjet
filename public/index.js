"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("search");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("error-code");

const { ScramjetController } = $scramjetLoadController();

const scramjet = new ScramjetController({
	files: {
		wasm: "/scram/scramjet.wasm.wasm",
		all: "/scram/scramjet.all.js",
		sync: "/scram/scramjet.sync.js",
	},
});

scramjet.init();

const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	try {
		await registerSW();
	} catch (err) {
		error.textContent = "Failed to register service worker.";
		errorCode.textContent = err.toString();
		throw err;
	}

	const url = search(address.value, searchEngine.value);

	let wispUrl =
		(location.protocol === "https:" ? "wss" : "ws") +
		"://" +
		location.host +
		"/wisp/";
	if ((await connection.getTransport()) !== "/libcurl/index.mjs") {
		await connection.setTransport("/libcurl/index.mjs", [
			{ websocket: wispUrl },
		]);
	}
	const frame = scramjet.createFrame();
	frame.frame.id = "frame";
	document.body.appendChild(frame.frame);
	frame.go(url);
});

async function onLoad() {
	const bgImageRes = await fetch (`${window.__ENV__.API_URL}/meow/random/image`);
	const bgImage = (await bgImageRes.json()).image;
	// const bgElement = document.getElementById("bgImage");
	// bgElement.src = (await bgImage.json()).image;
	const body = document.body;
	body.style.backgroundImage = `url("${bgImage}")`;
	body.style.backgroundSize = "cover";
	body.style.backgroundPosition = "center";
	body.style.backgroundRepeat = "no-repeat";
	body.style.backgroundAttachment = "fixed";
	document.getElementById("search").value = window.__ENV__.DEFAULT_SEARCH_ENGINE + "search?q=%s";
}

window.addEventListener("load", onLoad);

window.addEventListener("pagehide", () => {

  const token = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("auth="))
    ?.split("=")[1];

  if (!token) return;

  const url = `${window.__ENV__.API_URL}/meow/offline`;
  const data = JSON.stringify({ token });

  navigator.sendBeacon(url, data);
});

