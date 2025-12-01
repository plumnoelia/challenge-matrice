const API_BASE_URL = "http://localhost:8000/api";

/**
 * @returns {Promise<Array>}
 */
export const getServers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener servidores: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getServers:", error);
    throw error;
  }
};

/**
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getServerById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Servidor no encontrado");
      }
      throw new Error(`Error al obtener servidor: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getServerById:", error);
    throw error;
  }
};

/**
 * @param {Object} formData
 * @returns {Promise<Object>}
 */
export const createServer = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(errorBody?.message || "Error al crear servidor");
    }

    return await response.json();
  } catch (error) {
    console.log("Creating server with formData:", formData);
    console.error("Error en createServer:", error);
    throw error;
  }
};

/**
 * @param {string} id
 * @param {Object} serverData
 * @returns {Promise<Object>}
 */
export const updateServer = async (id, serverData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/${id}`, {
      method: "PUT",
      body: serverData,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Servidor no encontrado");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al actualizar servidor: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en updateServer:", error);
    throw error;
  }
};

/**
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteServer = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Servidor no encontrado");
      }
      throw new Error(`Error al eliminar servidor: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en deleteServer:", error);
    throw error;
  }
};

export const reorderServers = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/reorder/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ servers: payload }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error al sincronizar orden:", err);
  }
};
