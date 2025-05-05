import { useEffect, useState } from "react";
import Navbar from "../../navbar";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { obtenerTodos } from "../../services/cronograma";

function Resumen_mensual() {
    const usuario_id = localStorage.getItem('id')
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            if (!usuario_id) return;
            try {
                const data = await obtenerTodos(usuario_id);
                setDatos(data); // Aquí sí guardamos los datos correctamente
                console.log(data)
            } catch (error) {
                console.error("Error al cargar los movimientos:", error);
            }
        };
        cargarDatos();
    }, []);


    const mesActual = 4
    console.log(mesActual)
    const anioActual = new Date().getFullYear(); // 2025

    // 1. Filtrar por mes y año actuales
    const datosFiltrados = datos.filter(dato => {
        const fecha = new Date(dato.fecha);
        return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === anioActual;
    });
    

    // 2. Agrupar por categoria_id y sumar monto_real
    const resumenPorCategoria = {};

    datosFiltrados.forEach(dato => {
        const categoria = `Categoría ${dato.categoria_id}`;
        if (!resumenPorCategoria[categoria]) {
            resumenPorCategoria[categoria] = 0;
        }
        resumenPorCategoria[categoria] += dato.monto_real;
    });

    // 3. Convertir a array para usar en gráfica
    const dataGrafica = Object.entries(resumenPorCategoria).map(([name, value]) => ({
        name,
        value
    }));

    console.log(dataGrafica)

    return (
        <>
            <Navbar />
        </>
    )
}

export default Resumen_mensual