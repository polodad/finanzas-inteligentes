document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Función para verificar si hay un usuario logueado
    function checkAuth() {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = 'index.html';
        }
    }

    // Función para mostrar mensaje
    function showMessage(type, message) {
        const messageContainer = document.createElement('div');
        messageContainer.className = `message ${type}`;
        messageContainer.textContent = message;
        const form = document.querySelector('form');
        form.insertBefore(messageContainer, form.firstChild);
        
        // Eliminar mensaje después de 3 segundos
        setTimeout(() => {
            messageContainer.remove();
        }, 3000);
    }

    // Función para generar token
    function generateToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    // Evento submit del formulario de login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(u => u.email === email && u.password === password);

                if (user) {
                    const token = generateToken();
                    localStorage.setItem('token', token);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    showMessage('success', '¡Bienvenido!');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    showMessage('error', 'Correo o contraseña incorrectos');
                }
            } catch (error) {
                showMessage('error', 'Error al iniciar sesión');
            }
        });
    }

    // Evento submit del formulario de registro
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showMessage('error', 'Las contraseñas no coinciden');
                return;
            }

            try {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const existingUser = users.find(u => u.email === email);

                if (existingUser) {
                    showMessage('error', 'Este correo ya está registrado');
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
                    objetivos: [],
                    createdAt: new Date().toISOString()
                };

                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                // Iniciar sesión automáticamente
                const token = generateToken();
                localStorage.setItem('token', token);
                localStorage.setItem('currentUser', JSON.stringify(newUser));

                showMessage('success', '¡Registro exitoso!');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } catch (error) {
                showMessage('error', 'Error al registrar');
            }
        });
    }

    // Verificar autenticación al cargar
    checkAuth();
});
