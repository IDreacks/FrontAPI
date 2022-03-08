function connexion() {
    $.ajax({
        url: `http://127.0.0.1:8000/api/login_check`,
        dataType: 'json',
        type: 'POST',
        succes: (response) => {
            console.log("aa", response);
        }
    });
}

document.getElementById("formco").addEventListener('submit', ($event) => {
    $event.preventDefault();
    connexion()

})