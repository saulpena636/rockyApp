const BASE_URL = "http://localhost:8000";

export const getCategorias = async (id) => {
    try {
        const respuesta = await fetch(`${BASE_URL}/categoria`);
        return await respuesta.json();
    } catch (error) {
        console.error("Error al cargar los movimientos:", error);
        throw error;
    }
};

export const agregarCategoria = async (datos) => {
    try {
        const resp = await fetch(BASE_URL + '/categoria', {
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
        const respuesta = await fetch(`${BASE_URL}/categoria/${id}`);
        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener movimiento:", error);
        throw error;
    }
};