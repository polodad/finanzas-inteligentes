document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Obtener datos del usuario actual
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('userName').textContent = currentUser.nombre;

    // Manejar cierre de sesión
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });

    // Inicializar elementos
    const tabs = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const gastoForm = document.getElementById('gastoForm');
    const ingresoForm = document.getElementById('ingresoForm');
    const patrimonioForm = document.getElementById('patrimonioForm');
    const objetivoForm = document.getElementById('objetivoForm');
    const gastosList = document.getElementById('gastosList');
    const ingresosList = document.getElementById('ingresosList');
    const patrimonioList = document.getElementById('patrimonioList');
    const objetivosList = document.getElementById('objetivosList');
    const totalGastos = document.getElementById('totalGastos');
    const totalIngresos = document.getElementById('totalIngresos');
    const totalPatrimonio = document.getElementById('totalPatrimonio');
    const flujoNeto = document.getElementById('flujoNeto');
    const saldoDisponible = document.getElementById('saldoDisponible');
    const ratioAhorro = document.getElementById('ratioAhorro');
    const ratioEndeudamiento = document.getElementById('ratioEndeudamiento');
    const ratioLiquidez = document.getElementById('ratioLiquidez');
    const ratioSolvencia = document.getElementById('ratioSolvencia');
    const recomendacionesList = document.getElementById('recomendacionesList');

    // Inicializar datos del usuario actual
    let gastos = currentUser.gastos || [];
    let ingresos = currentUser.ingresos || [];
    let patrimonio = currentUser.patrimonio || [];
    let objetivos = currentUser.objetivos || [];

    // Guardar cambios en el usuario actual
    function actualizarUsuario() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = {
                ...currentUser,
                gastos,
                ingresos,
                patrimonio,
                objetivos
            };
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
    }
    // Inicializar elementos
    const tabs = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const gastoForm = document.getElementById('gastoForm');
    const ingresoForm = document.getElementById('ingresoForm');
    const patrimonioForm = document.getElementById('patrimonioForm');
    const objetivoForm = document.getElementById('objetivoForm');
    const gastosList = document.getElementById('gastosList');
    const ingresosList = document.getElementById('ingresosList');
    const patrimonioList = document.getElementById('patrimonioList');
    const objetivosList = document.getElementById('objetivosList');
    const totalGastos = document.getElementById('totalGastos');
    const totalIngresos = document.getElementById('totalIngresos');
    const totalPatrimonio = document.getElementById('totalPatrimonio');
    const flujoNeto = document.getElementById('flujoNeto');
    const saldoDisponible = document.getElementById('saldoDisponible');
    const ratioAhorro = document.getElementById('ratioAhorro');
    const ratioEndeudamiento = document.getElementById('ratioEndeudamiento');
    const ratioLiquidez = document.getElementById('ratioLiquidez');
    const ratioSolvencia = document.getElementById('ratioSolvencia');
    const recomendacionesList = document.getElementById('recomendacionesList');

    // Inicializar datos
    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    let ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];
    let patrimonio = JSON.parse(localStorage.getItem('patrimonio')) || [];
    let objetivos = JSON.parse(localStorage.getItem('objetivos')) || [];

    // Manejar cambio de pestañas
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Funciones de análisis financiero
    function calcularIndicadores() {
        const totalG = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
        const totalI = ingresos.reduce((sum, ingreso) => sum + ingreso.monto, 0);
        const totalP = patrimonio.reduce((sum, activo) => sum + activo.valor, 0);
        const pasivos = calcularPasivos();
        const activosLiquidos = calcularActivosLiquidos();
        
        // Ratio de ahorro
        const ratioA = (totalI - totalG) / totalI * 100;
        ratioAhorro.textContent = ratioA.toFixed(1);

        // Ratio de endeudamiento
        const ratioE = (pasivos / totalP) * 100;
        ratioEndeudamiento.textContent = ratioE.toFixed(1);

        // Ratio de liquidez
        const ratioL = (activosLiquidos / pasivos);
        ratioLiquidez.textContent = ratioL.toFixed(2);

        // Ratio de solvencia
        const ratioS = (totalP / pasivos);
        ratioSolvencia.textContent = ratioS.toFixed(2);

        // Saldo disponible
        saldoDisponible.textContent = (totalI - totalG).toFixed(2);

        // Generar recomendaciones
        generarRecomendaciones(ratioA, ratioE, ratioL, ratioS);
    }

    function calcularPasivos() {
        // Aquí podríamos agregar más lógica para calcular pasivos específicos
        return gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
    }

    function calcularActivosLiquidos() {
        return patrimonio.reduce((sum, activo) => {
            if (activo.tipo === 'inversion') return sum + activo.valor;
            return sum;
        }, 0);
    }

    function generarRecomendaciones(ratioA, ratioE, ratioL, ratioS) {
        recomendacionesList.innerHTML = '';
        
        // Ratio de ahorro
        if (ratioA < 20) {
            agregarRecomendacion('Considera aumentar tu ratio de ahorro. Es recomendable ahorrar al menos el 20% de tus ingresos.');
        }

        // Ratio de endeudamiento
        if (ratioE > 30) {
            agregarRecomendacion('Tu ratio de endeudamiento es alto. Considera reducir tus deudas.');
        }

        // Ratio de liquidez
        if (ratioL < 1) {
            agregarRecomendacion('Tu ratio de liquidez es bajo. Considera aumentar tus activos líquidos.');
        }

        // Ratio de solvencia
        if (ratioS < 2) {
            agregarRecomendacion('Tu ratio de solvencia es bajo. Considera mejorar tu estructura de capital.');
        }
    }

    function agregarRecomendacion(texto) {
        const recomendacion = document.createElement('div');
        recomendacion.className = 'recomendacion-item';
        recomendacion.textContent = texto;
        recomendacionesList.appendChild(recomendacion);
    }

    // Funciones para objetivos
    function mostrarObjetivos() {
        objetivosList.innerHTML = '';
        objetivos.forEach((objetivo, index) => {
            const objetivoElement = document.createElement('div');
            objetivoElement.className = 'objetivo-item';
            
            // Calcular progreso
            const diasTotales = Math.ceil((new Date(objetivo.fecha) - new Date()) / (1000 * 60 * 60 * 24));
            const diasPasados = Math.max(0, diasTotales - Math.ceil((new Date() - new Date()) / (1000 * 60 * 60 * 24)));
            const progreso = (diasPasados / diasTotales) * 100;

            objetivoElement.innerHTML = `
                <div>
                    <p><strong>${objetivo.nombre}</strong></p>
                    <p>Monto: $${objetivo.monto}</p>
                    <p>Fecha objetivo: ${new Date(objetivo.fecha).toLocaleDateString()}</p>
                    <div class="progreso">
                        <div class="barra" style="width: ${progreso}%"></div>
                    </div>
                </div>
                <div class="actions">
                    <button onclick="eliminarObjetivo(${index})">Eliminar</button>
                </div>
            `;
            objetivosList.appendChild(objetivoElement);
        });
    }

    // Eventos de formularios
    gastoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const descripcion = document.getElementById('descripcion').value;
        const monto = parseFloat(document.getElementById('monto').value);
        const categoria = document.getElementById('categoria').value;
        
        const nuevoGasto = {
            descripcion,
            monto,
            categoria,
            fecha: new Date().toISOString()
        };

        gastos.push(nuevoGasto);
        guardarDatos();
        mostrarGastos();
        gastoForm.reset();
    });

    ingresoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const descripcion = document.getElementById('ingresoDescripcion').value;
        const monto = parseFloat(document.getElementById('ingresoMonto').value);
        const categoria = document.getElementById('ingresoCategoria').value;
        
        const nuevoIngreso = {
            descripcion,
            monto,
            categoria,
            fecha: new Date().toISOString()
        };

        ingresos.push(nuevoIngreso);
        guardarDatos();
        mostrarIngresos();
        ingresoForm.reset();
    });

    patrimonioForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('activoNombre').value;
        const valor = parseFloat(document.getElementById('activoValor').value);
        const tipo = document.getElementById('activoTipo').value;
        
        const nuevoActivo = {
            nombre,
            valor,
            tipo,
            fecha: new Date().toISOString()
        };

        patrimonio.push(nuevoActivo);
        guardarDatos();
        mostrarPatrimonio();
        patrimonioForm.reset();
    });

    objetivoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('objetivoNombre').value;
        const monto = parseFloat(document.getElementById('objetivoMonto').value);
        const fecha = document.getElementById('objetivoFecha').value;
        
        const nuevoObjetivo = {
            nombre,
            monto,
            fecha,
            fechaCreacion: new Date().toISOString()
        };

        objetivos.push(nuevoObjetivo);
        guardarDatos();
        mostrarObjetivos();
        objetivoForm.reset();
    });

    // Funciones de eliminación
    window.eliminarGasto = (index) => {
        if (confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
            gastos.splice(index, 1);
            guardarDatos();
            mostrarGastos();
        }
    };

    window.eliminarIngreso = (index) => {
        if (confirm('¿Estás seguro de que deseas eliminar este ingreso?')) {
            ingresos.splice(index, 1);
            guardarDatos();
            mostrarIngresos();
        }
    };

    window.eliminarActivo = (index) => {
        if (confirm('¿Estás seguro de que deseas eliminar este activo?')) {
            patrimonio.splice(index, 1);
            guardarDatos();
            mostrarPatrimonio();
        }
    };

    window.eliminarObjetivo = (index) => {
        if (confirm('¿Estás seguro de que deseas eliminar este objetivo?')) {
            objetivos.splice(index, 1);
            guardarDatos();
            mostrarObjetivos();
        }
    };

    // Funciones comunes
    function guardarDatos() {
        localStorage.setItem('gastos', JSON.stringify(gastos));
        localStorage.setItem('ingresos', JSON.stringify(ingresos));
        localStorage.setItem('patrimonio', JSON.stringify(patrimonio));
        localStorage.setItem('objetivos', JSON.stringify(objetivos));
        calcularIndicadores();
    }

    // Mostrar datos al cargar
    mostrarGastos();
    mostrarIngresos();
    mostrarPatrimonio();
    mostrarObjetivos();
    calcularIndicadores();
});
