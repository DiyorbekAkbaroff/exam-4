let token = window.localStorage.getItem("token");
if(token)         window.location.href = "/";   
form.addEventListener("submit", async evt => {
    evt.preventDefault();
    let formData = new FormData(evt.target);
    let userData = Object.fromEntries(formData.entries());
    let req = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(userData)
    });
    let res = await req.json();
    if(res.status == 201){
        let {accessToken} = res;
        window.localStorage.setItem("token", accessToken);
        window.location.href = "/";   
    }
})