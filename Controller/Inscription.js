document.getElementById("envoieform").addEventListener('submit', ($event) => {
    $event.preventDefault();
    inscription()

})

function inscription() {
    let token = getToken().then(res => res);
    if (!token) {
        return false;
    }

    let email = $("#email").val();
    let username = $("#email").val();
    let password = $("#password").val();

    let data = JSON.stringify({
        email: email,
        username: username,
        password: password,
        createdAt: ( new Date()),
        updateAt: (new Date()),

    });
    $.ajax({
        url: "http://127.0.0.1:8000/api/mois",
        dataType: 'json',
        type: 'POST',
        data: data,
        contentType: 'application/ld+json',
        headers: {
            Authorization: 'Bearer' + token
        },
        succes: (response) => {
            console.log(response);
            return response?.token ?? false;



        },
        error: () => {
            console.log("Error invalid adress");
            $('#notification').html(" <div id='notification-2'> <span class='closebtn' onclick=\"this.parentElement.style.display='none';\">&times;</span> L'adresse mail est déjà utilisé </div></div>" )
        }

    });
}

async function getToken() {
    let data = JSON.stringify({
        username: "max@gmail.com",
        password: "max",
    });

     let token;

     await $.ajax({
        url: "http://127.0.0.1:8000/api/login_check",
        dataType: 'json',
        type: 'POST',
        data: data,
        contentType: 'application/json',
        success: (response) => {
            console.log(response);
            return response?.token ?? false;

        },
        error: () => {
            console.log("Erreur");
        }

    });
    return token;
}

