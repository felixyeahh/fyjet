export async function checkEligibility() {
    const authCookie = document.cookie.split(";").find((cookie) => cookie.startsWith("auth="));
    if (!authCookie) {
        return false;
    }
    const token = authCookie.split("=")[1];
    const res = await fetch(`http://127.0.0.1:44091/meow/check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({token: token})
    });
    const json = await res.json();
    if (!json.success) {
		logout();
        return false;
    }
    return true;
}

function logout() {
	document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	window.location.reload();
}
