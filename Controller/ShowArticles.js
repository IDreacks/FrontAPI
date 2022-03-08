document.getElementById("formco").addEventListener("submit", ($e) => {
    $e.preventDefault();
    getToken().then((token) => {
        subscribe(token).then(() => {
            getArticles().then(articles => {
                showArticles(articles)
            })
        })
    });
});

async function getToken() {
    let data = JSON.stringify({
        username: "lory@lory.fr",
        password: "lory",
    });

    let token, refresh_token;


    await $.ajax({
        url: "http://127.0.0.1:8000/api/login_check",
        dataType: "json",
        type: "POST",
        data: data,
        contentType: "application/json",
        success: (response) => {
            token = response?.token;
            sessionStorage.setItem("token", token)
            refresh_token = response?.refresh_token;
            sessionStorage.setItem("refresh_token", refresh_token)
        },
        error: () => {
            console.log("Oups error");
        },
    });

    return token;
}

async function subscribe(token) {
    let email = $("#email").val();
    let username = $("#email").val();
    let password = $("#password").val();

    let data = JSON.stringify({
        email: email,
        username: username,
        password: password,
        createdAt: new Date(),
        updateAt: new Date(),
    });

    await $.ajax({
        url: "http://127.0.0.1:8000/api/mois",
        dataType: "json",
        type: "POST",
        data: data,
        contentType: "application/ld+json",
        headers: {
            Authorization: "Bearer " + token,
        },
        success: (response) => {
            console.log(response.id ?? "Not expected response");
        },
        error: () => {
            console.log(" error 25");
            $("#notification-2").html(
                $('#notification-2').html(" <div id='notification-2'> <span class='closebtn' onclick=\"this.parentElement.style.display='none';\">&times;</span> Username ou mot de passe incorrect </div></div>")
            );
        },
    });
}

async function getArticles() {
    let refresh_token = sessionStorage.getItem("refresh_token")

    return await $.ajax({

        url: "http://localhost:8000/api/articles",
        dataType: "json",
        type: "GET",
        contentType: "application/ld+json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        success: (articles) => {
            if (!articles instanceof Array) {
                return false;
            }
            if (articles.length === 0) {
                return false;
            }
            getPage("./Articles.php", articles)
        },
        error: (response) => {
            if (response.status === 401) {

                $.ajax({
                    url: "http://localhost:8000/api/token/refresh",
                    dataType: "json",
                    type: "POST",
                    data: {
                        "refresh_token": refresh_token
                    },
                    success: (response) => {

                        sessionStorage.setItem("token", response.token)


                        sessionStorage.setItem("refresh_token", response.refresh_token)

                    },



                    error: () => {
                        console.log('erreur réponse')
                    }

                })
            }


        }
    });
}
getArticles()

function getPage(url, articles) {
    $.ajax({
        url: url,
        dataType: "html",
        success: (page) => {
            $("#inscription").html(page)
            showArticles(articles)
        },
    });
}


function showArticles(articles) {
    articles.forEach(article => {
        let html = `
        <div>
          <h2>${article.title}</h2>
          </br>
          <p>${article.content}</p>
        </div>
      `
        $("#inscription").append(html)
    });
}

