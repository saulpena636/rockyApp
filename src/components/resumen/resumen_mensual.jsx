import { useEffect, useState } from "react";
import Navbar from "../../navbar";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { obtenerTodos } from "../../services/cronograma";
import { getCategorias } from "../../services/categoria";

function Resumen_mensual() {
    const usuario_id = localStorage.getItem('id')
    const [datos, setDatos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#7D3C98", "#34495E"];

    useEffect(() => {
        const cargarDatos = async () => {
            if (!usuario_id) return;
            try {
                const data = await obtenerTodos(usuario_id);
                setDatos(data); // Aquí sí guardamos los datos correctamente
                console.log(data)
                const data2 = await getCategorias();
                setCategorias(data2)
                console.log(data2)
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



    // Crear un diccionario de id => nombre
const mapaCategorias = {};
categorias.forEach(cat => {
  mapaCategorias[cat.id] = cat.categoria;
});

// Agrupar por nombre de categoría
const resumenPorCategoria = {};

datosFiltrados.forEach(dato => {
  const nombreCategoria = mapaCategorias[dato.categoria_id] || "Sin categoría";
  if (!resumenPorCategoria[nombreCategoria]) {
    resumenPorCategoria[nombreCategoria] = 0;
  }
  resumenPorCategoria[nombreCategoria] += dato.monto_real;
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
            <div style={{ width: "100%", height: 400 }}>
                <h2>Distribución de movimientos por categoría</h2>
                {dataGrafica.length > 0 ? (
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={dataGrafica}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                label
                            >
                                {dataGrafica.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p>No hay movimientos registrados para este mes.</p>
                )}
            </div>
        </>
    )
}

export default Resumen_mensual