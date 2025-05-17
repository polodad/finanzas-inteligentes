// app.js - Lógica principal de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar nombre de usuario
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = currentUser.nombre;
        }
    }

    // Aquí va el resto de la lógica de tu aplicación
    // ...
});