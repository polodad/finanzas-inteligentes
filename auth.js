// auth.js - Manejo de autenticación

// Verificar autenticación
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && !window.location.pathname.endsWith('login.html') && 
        !window.location.pathname.endsWith('register.html')) {
        window.location.href = 'login.html';
    }
    return token;
}

// Registrar nuevo usuario
function setupRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validaciones
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (!email.includes('@')) {
            alert('Por favor ingresa un email válido');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.email === email)) {
            alert('Este correo ya está registrado');
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            nombre,
            email,
            password,
            gastos: [],
            ingresos: [],
            patrimonio: [],
            objetivos: []
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        localStorage.setItem('token', 'dummy-token');

        window.location.href = 'index.html';
    });
}

// Iniciar sesión
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', 'dummy-token');
            window.location.href = 'index.html';
        } else {
            alert('Credenciales incorrectas');
        }
    });
}

// Cerrar sesión
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
}

// Inicializar autenticación
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupRegisterForm();
    setupLoginForm();
    setupLogoutButton();
});