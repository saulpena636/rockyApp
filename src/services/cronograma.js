const BASE_URL = "http://localhost:8000/movimientoFinanciero";

export const agregar = async (datos) => {
  try {
    const resp = await fetch(BASE_URL, {
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
    const respuesta = await fetch(`${BASE_URL}/${id}`);
    return await respuesta.json();
  } catch (error) {
    console.error("Error al obtener movimiento:", error);
    throw error;
  }
};

export const actualizarUno = async (id, datos) => {
  try {
    const resp = await fetch(`${BASE_URL}/${id}`, {
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
    const respuesta = await fetch(`${BASE_URL}/${id}`, {
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
