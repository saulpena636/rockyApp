import { useNavigate } from "react-router-dom";
import "./cronograma.css"
import { useEffect, useState } from 'react';
import { agregar, mostrarUno, actualizarUno, eliminarUno, obtenerTodos } from "../../services/cronograma";

function Cronograma() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalA, setMostrarModalA] = useState(false);
  const [mostrarModalD, setMostrarModalD] = useState(false);
  const [mostrarModalR, setMostrarModalR] = useState(false);

  const usuario_id = 0
  const navigate = useNavigate();
  const [id, setId] = useState(0);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [fechaF, setFechaF] = useState(new Date().toISOString().split('T')[0]);
  const [tipo, setTipo] = useState("ingreso");
  const [concepto, setConcepto] = useState("");
  const [monto_presupuestado, setMonto_presupuestado] = useState(0);
  const [monto_real, setMonto_real] = useState(0);

  const ahora = new Date();
  const hora = ahora.getHours();

  let mensaje = ''
  if (hora >= 18 || hora < 6) {
    mensaje = 'Buena noche, '
  }
  else if (hora >= 12) {
    mensaje = 'Buena tarde, '
  }
  else {
    mensaje = 'Buen dia, '
  }

  if (localStorage.getItem('user') === null) {
    navigate("/")
  }

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerTodos();
        setDatos(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

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
    const datos = { usuario_id, fecha, tipo, concepto, monto_presupuestado, monto_real };
    const respuesta = await agregar(datos);
    console.log(respuesta);
    window.location.reload();

  }

  /* Mostrar Uno */
  const mostrarUNo = async (id) => {
    const datos = await mostrarUno(id);
    const { usuario_id, fecha, tipo, concepto, monto_presupuestado, monto_real } = datos;
    setId(id);
    setFecha(fecha);
    setTipo(tipo);
    setConcepto(concepto);
    setMonto_presupuestado(monto_presupuestado);
    setMonto_real(monto_real);
    setMostrarModalA(true);
  }

  /* Actualizar */
  const actualizar = async (params) => {
    params.preventDefault();
    const datos = { usuario_id, fecha, tipo, concepto, monto_presupuestado, monto_real };
    const respuesta = await actualizarUno(id, datos);
    console.log(respuesta);
    window.location.reload();

  }

  /* Eliminar */
  const eliminar = async (id) => {
    const ok = await eliminarUno(id);
    if (ok) {
      window.location.reload();
    }
  }

  const irAFinanzas = (e) => {
    e.preventDefault();
    navigate('/reportes', { state: { fechaInicio: fecha, fechaFinal: fechaF } });
  };


  return (
    <div className="contenedor">
      <div className="nav"></div>
      <div style={{ width: "100%", height: "80px" }}></div>
      <div className="contenedorTabla">
        <h1>{mensaje}{localStorage.getItem('user')}</h1>
        <h1>Tu cronograma de ingresos y egresos</h1>
        <div className="opciones_gen">
          <img src="/agregar.png" alt="add" onClick={() => setMostrarModal(true)} className="agregar" />
          <img src="/generar_informe.png" alt="generate" onClick={() => setMostrarModalR(true)} className="generar" />
        </div>
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
                        <img src="/edit.png" alt="edit" onClick={() => mostrarUNo(item.id)} style={{ width: "32px", height: "32px" }} />
                        <img src="/trash.png" alt="trash" onClick={() => eliminar(item.id)} style={{ width: "32px", height: "32px" }} />
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

        {mostrarModalR && (
          <div className="modal">
            <div className="modal-contenido">
              <h2>Reporte de finenzas</h2>
              <form onSubmit={irAFinanzas}>
                <div className="md3-input">
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                    className={fecha ? 'filled' : ''}
                  />
                  <label className={fecha ? 'active' : ''}>Fecha de inicio</label>
                </div>
                <div className="md3-input">
                  <input
                    type="date"
                    value={fechaF}
                    onChange={(e) => setFechaF(e.target.value)}
                    required
                    className={fechaF ? 'filled' : ''}
                  />
                  <label className={fechaF ? 'active' : ''}>Fecha final</label>
                </div>
                <button type="submit" className="login-button">Actualizar</button>
                <button onClick={() => setMostrarModalR(false)}>Cerrar</button>
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

export default Cronograma;
