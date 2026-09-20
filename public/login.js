
const loginForm = document.getElementById("login-form");
const mainPage = document.getElementById("page");

let authCookie = document.cookie.split(";").find((cookie) => cookie.startsWith("auth="));
if (authCookie !== undefined) {
    loginForm.classList.add("hidden");
    mainPage.classList.remove("hidden");
} else {
    loginForm.classList.remove("hidden");
    mainPage.classList.add("hidden");
}


loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const res = await fetch(`${window.__ENV__.API_URL}/meow/login`, {
        method: "POST",   
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),    
    });
    const json = await res.json();
    if (json.success) {
        document.cookie = `auth=${json.token}; path=/; max-age=${60*60*24*7}; SameSite=Lax`;
        loginForm.classList.add("hidden");
        mainPage.classList.remove("hidden");
    } else {
        document.getElementById("login-error").textContent = json.message;
    }
});    
