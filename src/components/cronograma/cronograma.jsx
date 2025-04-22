import { useNavigate } from "react-router-dom";
import "./cronograma.css"
import { useEffect, useState } from 'react';

function FinanzasTable() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalA, setMostrarModalA] = useState(false);
  const [mostrarModalD, setMostrarModalD] = useState(false);

  const usuario_id = 0
  const navigate = useNavigate();
  const [id, setId] = useState(0);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [tipo, setTipo] = useState("ingreso");
  const [concepto, setConcepto] = useState("");
  const [monto_presupuestado, setMonto_presupuestado] = useState(0);
  const [monto_real, setMonto_real] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8000/movimientoFinanciero")
      .then(res => res.json())
      .then(data => {
        setDatos(data);
        setLoading(false)
      })
      .catch(err => {
        console.error("Error al cargar los datos: ", err)
        setLoading(false)
      })
  }, [])

  console.log(datos);

  const agrupado = datos.reduce((acc, item) => {
    acc[item.fecha] = acc[item.fecha] || { ingreso: [], egreso: [] };
    acc[item.fecha][item.tipo].push(item);
    return acc;
  }, {});

  console.log(agrupado);

  /* Agregar nuevo */
  const agregarN = async (params) => {
    params.preventDefault();
    const datos = {
      usuario_id,
      fecha,
      tipo,
      concepto,
      monto_presupuestado,
      monto_real
    }
    try {
      const resp = await fetch("http://localhost:8000/movimientoFinanciero", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });
      const respuesta = await resp.json();
      console.log(respuesta)
      window.location.reload();
    } catch (error) {
      console.error("Error al obtener el movimiento:", error);
    }

  }

  /* Mostrar Uno */
  const mostrarUNo = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:8000/movimientoFinanciero/${id}`);
      const datos = await respuesta.json();
      console.log(datos)
      const { usuario_id, fecha, tipo, concepto, monto_presupuestado, monto_real } = datos
      setId(id)
      setFecha(fecha)
      setTipo(tipo)
      setConcepto(concepto)
      setMonto_presupuestado(monto_presupuestado)
      setMonto_real(monto_real)
      setMostrarModalA(true)
    } catch (error) {
      console.error("Error al obtener el movimiento:", error);
    }
  }

  /* Actualizar */
  const actualizar = async (params) => {
    params.preventDefault();
    const datos = {
      usuario_id,
      fecha,
      tipo,
      concepto,
      monto_presupuestado,
      monto_real
    }
    try {
      const resp = await fetch(`http://localhost:8000/movimientoFinanciero/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });
      const respuesta = await resp.json();
      console.log(respuesta)
      window.location.reload();
    } catch (error) {
      console.error("Error al obtener el movimiento:", error);
    }

  }

  /* Eliminar */
  const eliminar = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:8000/movimientoFinanciero/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (respuesta.ok) {
        window.location.reload();
      }
    } catch (error) {

    }
  }

  return (
    <div className="contenedor">
      <div className="nav"></div>
      <div style={{ width: "100%", height: "80px" }}></div>
      <div className="contenedorTabla">
        <h1>Tu cronograma de ingresos y egresos</h1>
        <img src="/agregar.png" alt="add" onClick={() => setMostrarModal(true)} className="agregar"/>
        {/*<table border={1}>
          <thead>
            <tr>
              <th>Dia</th>
              <th colSpan={3}>Ingresos</th>
              <th colSpan={3}>Egresos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            
            <tr>
              <td rowSpan={6}>07</td>
              <td>Presupuestado</td>
              <td rowSpan={2}>Prestamo de dinero</td>
              <td>$150</td>
              <td>Presupuestado</td>
              <td rowSpan={2}>Pago de credito</td>
              <td>$750</td>
              <td>Editar</td>
            </tr>
            <tr>
              <td>Real</td>
              <td>$150</td>
              <td>Real</td>
              <td>$750</td>
              <td>Eliminar</td>
            </tr>
            <tr>
              <td>Presupuestado</td>
              <td rowSpan={2}>Prestamo de dinero</td>
              <td>$150</td>
              <td>Presupuestado</td>
              <td rowSpan={2}>Pago de credito</td>
              <td>$750</td>
              <td>Editar</td>
            </tr>
            <tr>
              <td>Real</td>
              <td>$150</td>
              <td>Real</td>
              <td>$750</td>
              <td>Eliminar</td>
            </tr>
            <tr>
              <td rowSpan={2}>Total Ingresos</td>
              <td>Presupuestado</td>
              <td>950</td>
              <td rowSpan={2}>Total egresos</td>
              <td>Presupuestado</td>
              <td>950</td>
            </tr>
            <tr>
              <td>Real</td>
              <td>$950</td>
              <td>Real</td>
              <td>950</td>
            </tr> 
          </tbody>
        </table>*/}
        <table border="1">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Concepto</th>
              <th>Monto presupuestado</th>
              <th>Monto real</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(agrupado).map(([fecha, tipos]) => (
              <>
                {["ingreso", "egreso"].map((tipo) =>
                  tipos[tipo].map((item, index) => (
                    <tr key={`${fecha}-${tipo}-${index}`}>
                      <td>{index === 0 ? fecha : ""}</td> {/* Solo muestra la fecha una vez */}
                      <td>{tipo}</td>
                      <td>{item.concepto}</td>
                      <td>{item.monto_presupuestado}</td>
                      <td>{item.monto_real}</td>
                      <td>
                        <img src="/edit.png" alt="edit" onClick={() => mostrarUNo(item.id)}  style={{ width: "32px", height: "32px" }}/>
                        <img src="/trash.png" alt="trash" onClick={() => eliminar(item.id)}  style={{ width: "32px", height: "32px" }}/>
                      </td>
                    </tr>
                  ))
                )}
              </>
            ))}
          </tbody>
        </table>
        {mostrarModal && (
          <div className="modal">
            <div className="modal-contenido">
              <h2>Formulario de Agregar</h2>
              <form onSubmit={agregarN}>
                <div className="md3-input">
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                    className={fecha ? 'filled' : ''}
                  />
                  <label className={fecha ? 'active' : ''}>Fecha</label>
                </div>
                <div className="md3-input">
                  <label className={tipo ? 'filled' : ''}>Elige una opción:</label>
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={tipo ? 'filled' : ''}>
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                  </select>
                </div>
                <div className="md3-input">
                  <input
                    type="text"
                    value={concepto}
                    onChange={(e) => setConcepto(e.target.value)}
                    required
                    className={concepto ? 'filled' : ''}
                  />
                  <label className={concepto ? 'active' : ''}>Concepto</label>
                </div>
                <div className="md3-input">
                  <input
                    type="number"
                    value={monto_presupuestado}
                    onChange={(e) => setMonto_presupuestado(e.target.value)}
                    step="0.01"
                    required
                    className={monto_presupuestado ? 'filled' : ''}
                  />
                  <label className={monto_presupuestado ? 'active' : ''}>Monto presupuestado</label>
                </div>
                <div className="md3-input">
                  <input
                    type="number"
                    value={monto_real}
                    onChange={(e) => setMonto_real(e.target.value)}
                    step="0.01"
                    required
                    className={monto_real ? 'filled' : ''}
                  />
                  <label className={monto_real ? 'active' : ''}>Monto real</label>
                </div>
                <button type="submit" className="login-button">Enviar</button>
                <button onClick={() => setMostrarModal(false)}>Cerrar</button>
              </form>
            </div>
          </div>
        )}

        {mostrarModalA && (
          <div className="modal">
            <div className="modal-contenido">
              <h2>Formulario de Agregar</h2>
              <form onSubmit={actualizar}>
                <div className="md3-input">
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                    className={fecha ? 'filled' : ''}
                  />
                  <label className={fecha ? 'active' : ''}>Fecha</label>
                </div>
                <div className="md3-input">
                  <label className={tipo ? 'filled' : ''}>Elige una opción:</label>
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={tipo ? 'filled' : ''}>
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                  </select>
                </div>
                <div className="md3-input">
                  <input
                    type="text"
                    value={concepto}
                    onChange={(e) => setConcepto(e.target.value)}
                    required
                    className={concepto ? 'filled' : ''}
                  />
                  <label className={concepto ? 'active' : ''}>Concepto</label>
                </div>
                <div className="md3-input">
                  <input
                    type="number"
                    value={monto_presupuestado}
                    onChange={(e) => setMonto_presupuestado(e.target.value)}
                    step="0.01"
                    required
                    className={monto_presupuestado ? 'filled' : ''}
                  />
                  <label className={monto_presupuestado ? 'active' : ''}>Monto presupuestado</label>
                </div>
                <div className="md3-input">
                  <input
                    type="number"
                    value={monto_real}
                    onChange={(e) => setMonto_real(e.target.value)}
                    step="0.01"
                    required
                    className={monto_real ? 'filled' : ''}
                  />
                  <label className={monto_real ? 'active' : ''}>Monto real</label>
                </div>
                <button type="submit" className="login-button">Actualizar</button>
                <button onClick={() => setMostrarModalA(false)}>Cerrar</button>
              </form>
            </div>
          </div>
        )}

        {mostrarModalD && (
          <div className="modal">
            <div className="modal-contenido">
              <h2>Eliminar</h2>
              <p>Estas seguro de eliminar el elemento?</p>
              <button onClick={() => setMostrarModalD(false)}>Cerrar</button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}

export default FinanzasTable;
