const BASE_URL = "http://localhost:8000";

/*export const profile = (datos) => {
    try {
        const resp = async fetch(BASE_URL + '/profile', {

        })
    } catch (error) {
        
    }
}*/

export const username_get = async (datos) => {
    try {
        const respuesta = await fetch(`${BASE_URL}/users/get_user_by_username/{Username}?user=${datos}`);
        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener movimiento:", error);
        throw error;
    }
}

export const login = async (datos) => {
    try {
        console.log(datos)
        const resp = await fetch(BASE_URL + "/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: datos
        });
        return await resp.json()
    } catch (error) {
        console.error("Error al agregar movimiento:", error);
        throw error;
    }
}

export const create_user = async (datos) => {
    try {
        const resp = await fetch(BASE_URL + "/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });
        return await resp.json()
    } catch (error) {
        console.error("Error al agregar movimiento:", error);
        throw error;
    }
}