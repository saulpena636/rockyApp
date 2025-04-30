import { useEffect, useState } from "react";
import "../cronograma.css"
import { useLocation } from 'react-router-dom';
import { estadoFinanciero, progresoFinanciero } from "../../../services/cronograma";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Reportes() {
    const location = useLocation();
    const { fechaInicio, fechaFinal } = location.state || {};
    const [estado, setEstado] = useState([]);
    const [datos, setDatos] = useState([]);

    console.log(fechaInicio, fechaFinal); // Aquí tienes las fechas
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [estado, datos] = await Promise.all([
                    estadoFinanciero(0, fechaInicio, fechaFinal),
                    progresoFinanciero(0, fechaInicio, fechaFinal)
                ]);
                setEstado(estado);
                setDatos(datos);
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };
        if (fechaInicio && fechaFinal) {
            cargarDatos();
        }
    }, [fechaInicio, fechaFinal]); // 👈 Aquí, dependencias correctas    

    console.log(estado, datos)

    const progresoD = {};
    if (datos && datos.progreso) {
        datos.progreso.forEach(item => {
            progresoD[item.fecha] = item.saldo;
        });
    }

    console.log(progresoD);

    const progresoArray = datos?.progreso
        ? Object.values(datos.progreso.reduce((acc, item) => {
            acc[item.fecha] = item; // Solo guarda el último por fecha
            return acc;
        }, {}))
        : [];

    console.log(progresoArray)

    return (
        <div className="contenedor">
            <div className="nav"></div>
            <div style={{ width: "100%", height: "80px" }}></div>
            <div className="contenedorTabla">
                <h1>{localStorage.getItem('user')}, Este es tu reporte financiero de {fechaInicio} a {fechaFinal}</h1>
                <h2>Tu estado de reporte: {estado.mensaje}</h2>
                <h2 style={{margin:"0"}}>Del {fechaInicio} al {fechaFinal}, tus ingresos han sido de ${estado.total_ingresos}</h2>
                <h2 style={{margin:"0"}}>Del {fechaInicio} al {fechaFinal}, tus egresos han sido de ${estado.total_egresos}</h2>
                <h2 style={{margin:"0"}}>Del {fechaInicio} al {fechaFinal}, tu total es de  ${estado.saldo_final}</h2>
                <div style={{ width: '100%', height: 480 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={progresoArray}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="linear" dataKey="saldo" stroke="#8884d8" strokeWidth={5} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            </div>

        </div>
    );
}

export default Reportes;
