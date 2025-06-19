import { useEffect, useState } from "react";
import Navbar from "../../navbar";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { obtenerTodos } from "../../services/cronograma";
import { getCategorias } from "../../services/categoria";
import "./resumen_mensual.css"

function Resumen_mensual() {
    const usuario_id = localStorage.getItem('id')
    const [datos, setDatos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const COLORS = [
        "#D7263D", // rojo carmesí intenso
        "#F46036", // naranja medio
        "#2E294E", // azul violeta profundo
        "#1B998B", // verde azulado equilibrado
        "#C5D86D", // lima desaturada
        "#FF6F61", // coral fuerte
        "#6C5B7B", // púrpura grisáceo
        "#355C7D", // azul grisáceo medio
        "#F9A03F", // naranja dorado
        "#3C91E6", // azul fuerte
        "#9D5C63", // rosa vino apagado
        "#4C956C", // verde natural medio
        "#8D6A9F", // lavanda terroso
        "#FFB627", // ámbar saturado
        "#5C4B51"  // marrón gris medio
    ];

    const MESES = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];




    useEffect(() => {
        const cargarDatos = async () => {
            if (!usuario_id || usuario_id === 0) {
                console.warn("ID de usuario inválido:", usuario_id);
                return;
            }
            try {
                const [data, data2] = await Promise.all([
                    obtenerTodos(usuario_id),
                    getCategorias()
                ]);
                setDatos(data);
                setCategorias(data2);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        };
        cargarDatos();
    }, [usuario_id]);


    const hoy = new Date();
    const [mesActual, setMes] = useState(hoy.getMonth()); // 0-indexed
    const [anioActual, setAnio] = useState(hoy.getFullYear());

    const cambiarMes = (delta) => {
        let nuevoMes = mesActual + delta;
        let nuevoAnio = anioActual;

        if (nuevoMes < 0) {
            nuevoMes = 11;
            nuevoAnio--;
        } else if (nuevoMes > 11) {
            nuevoMes = 0;
            nuevoAnio++;
        }

        setMes(nuevoMes);
        setAnio(nuevoAnio);
    };

    // 1. Filtrar por mes y año actuales
    const datosFiltrados = datos.filter(dato => {
        const fecha = new Date(dato.fecha);
        return fecha.getMonth() + 1 === (mesActual + 1) && fecha.getFullYear() === anioActual;
    });
    console.log(datosFiltrados)

    const totales = datosFiltrados.reduce(
        (acc, item) => {
            if (item.tipo === "ingreso") {
                acc.ingresos += item.monto_real;
            } else if (item.tipo === "egreso") {
                acc.egresos += item.monto_real;
            }
            return acc;
        },
        { ingresos: 0, egresos: 0 }
    );

    console.log(totales);

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
            <div className="contentResumen">
                <h1 style={{ lineHeight: "1.1" }}>{localStorage.getItem('name')}, este es tu distribución de movimientos</h1>
                <div style={{ width: "100%", height: "20px" }}></div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                    <button onClick={() => cambiarMes(-1)}>{"<"}</button>
                    <h2>{MESES[mesActual]} {anioActual}</h2>
                    <button onClick={() => cambiarMes(1)}>{">"}</button>
                </div>
                <div className="graficaContent">
                    <div style={{ width: "50%", height: "auto" }}>
                        <h3>Ingresos totales: {totales.ingresos} ⬆️</h3>
                        <h3>Egresos totales: {totales.egresos} ⬇️</h3>
                        <h2>Tabla de distribución de movimientos por categoría</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Categoría</th>
                                    <th>Monto real</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataGrafica.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ width: "50%", height: 400 }}>
                        <h2>Grafica de distribución de movimientos por categoría</h2>
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
                </div>
            </div>
        </>
    )
}

export default Resumen_mensual