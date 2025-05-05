const BASE_URL = "http://localhost:8000";

export const obtenerTodos = async (id) => {
    try {
        const respuesta = await fetch(`${BASE_URL}/movimientoFinanciero/list/${id}`);
        return await respuesta.json();
    } catch (error) {
        console.error("Error al cargar los movimientos:", error);
        throw error;
    }
};

export const agregar = async (datos) => {
    try {
        const resp = await fetch(BASE_URL + '/movimientoFinanciero', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });
        return await resp.json();
    } catch (error) {
        console.error("Error al agregar movimiento:", error);
        throw error;
    }
};

export const mostrarUno = async (id) => {
    try {
        const respuesta = await fetch(`${BASE_URL}/movimientoFinanciero/${id}`);
        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener movimiento:", error);
        throw error;
    }
};

export const actualizarUno = async (id, datos) => {
    try {
        const resp = await fetch(`${BASE_URL}/movimientoFinanciero/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });
        return await resp.json();
    } catch (error) {
        console.error("Error al actualizar movimiento:", error);
        throw error;
    }
};

export const eliminarUno = async (id) => {
    try {
        const respuesta = await fetch(`${BASE_URL}/movimientoFinanciero/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        return respuesta.ok;
    } catch (error) {
        console.error("Error al eliminar movimiento:", error);
        throw error;
    }
};

export const estadoFinanciero = async (id, fecha, fechaF) => {
    try {
        const respuesta = await fetch(`${BASE_URL}/estado_financiero?usuario_id=${id}&fecha_inicio=${fecha}&fecha_fin=${fechaF}`);
        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener movimiento:", error);
        throw error;
    }
}

export const progresoFinanciero = async (id, fecha, fechaF) => {
    try {
        const respuesta = await fetch(`${BASE_URL}/progreso_financiero?usuario_id=${id}&fecha_inicio=${fecha}&fecha_fin=${fechaF}`);
        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener movimiento:", error);
        throw error;
    }
}
