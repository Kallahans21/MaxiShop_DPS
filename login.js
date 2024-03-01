document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === '1234') {
        $('#loginModal').modal('show');
        $('.progress-bar').css('width', '0%').attr('aria-valuenow', 0);
        setTimeout(function() {
            $('.progress-bar').css('width', '100%').attr('aria-valuenow', 100);
        }, 300); 
        setTimeout(function() {
            window.location.href = 'cart.html';
        }, 2000); 
    } else {
        
        document.querySelector('.modal-body').innerHTML = '<div class="alert alert-danger" role="alert">Usuario o contraseña inválidos. Por favor, inténtalo de nuevo.</div>';
        $('#loginModal').modal('show');
    }
});
