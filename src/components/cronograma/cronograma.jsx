// ...importaciones
import { useNavigate } from "react-router-dom";
import "./cronograma.css"
import { useEffect, useState } from 'react';
import { agregar, mostrarUno, actualizarUno, eliminarUno, obtenerTodos } from "../../services/cronograma";
import Navbar from "../../navbar";

function Cronograma() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalA, setMostrarModalA] = useState(false);
  const [mostrarModalD, setMostrarModalD] = useState(false);
  const [mostrarModalR, setMostrarModalR] = useState(false);

  const usuario_id = localStorage.getItem('id');
  const navigate = useNavigate();
  const [id, setId] = useState(0);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [fechaF, setFechaF] = useState(new Date().toISOString().split('T')[0]);
  const [tipo, setTipo] = useState("ingreso");
  const [concepto, setConcepto] = useState("");
  const [monto_presupuestado, setMonto_presupuestado] = useState(0);
  const [monto_real, setMonto_real] = useState(0);
  const [categoria_id, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState([]);

  const ahora = new Date();
  const hora = ahora.getHours();
  let mensaje = '';
  if (hora >= 18 || hora < 6) mensaje = 'Buena noche, ';
  else if (hora >= 12) mensaje = 'Buena tarde, ';
  else mensaje = 'Buen día, ';

  if (!localStorage.getItem('user')) navigate("/");

  useEffect(() => {
    fetch("http://localhost:8000/categoria")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

  useEffect(() => {
    const cargarDatos = async () => {
      const data = await obtenerTodos(usuario_id);
      setDatos(data);
      setLoading(false);
    };
    cargarDatos();
  }, []);

  const agrupado = datos.reduce((acc, item) => {
    acc[item.fecha] = acc[item.fecha] || { ingreso: [], egreso: [] };
    acc[item.fecha][item.tipo].push(item);
    return acc;
  }, {});

  const agregarN = async (e) => {
    e.preventDefault();
    const nuevo = { usuario_id, fecha, tipo, concepto, monto_presupuestado, monto_real, categoria_id };
    await agregar(nuevo);
    window.location.reload();
  };

  const mostrarUNo = async (id) => {
    const datos = await mostrarUno(id);
    if (!datos) return;
    setId(datos.id);
    setFecha(datos.fecha);
    setTipo(datos.tipo);
    setConcepto(datos.concepto);
    setMonto_presupuestado(datos.monto_presupuestado);
    setMonto_real(datos.monto_real);
    setCategoriaId(datos.categoria_id || "");
    setMostrarModalA(true);
  };

  const actualizar = async (e) => {
    e.preventDefault();
    const actualizado = { usuario_id, fecha, tipo, concepto, monto_presupuestado, monto_real, categoria_id };
    await actualizarUno(id, actualizado);
    window.location.reload();
  };

  const eliminar = async (id) => {
    const ok = await eliminarUno(id);
    if (ok) window.location.reload();
  };

  const irAFinanzas = (e) => {
    e.preventDefault();
    navigate('/reportes', { state: { fechaInicio: fecha, fechaFinal: fechaF } });
  };

  return (
    <div className="contenedor">
      <Navbar />
      <div style={{ width: "100%", height: "80px" }}></div>
      <div className="contenedorTabla">
        <h1>{mensaje}{localStorage.getItem('name')}</h1>
        {datos.length > 0 ? (
          <>
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
                  <th>Categoría</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(agrupado).map(([fecha, tipos]) => (
                  <>
                    {["ingreso", "egreso"].map((tipo) =>
                      tipos[tipo].map((item, index) => (
                        <tr key={`${fecha}-${tipo}-${index}`}>
                          <td>{index === 0 ? fecha : ""}</td>
                          <td>{tipo}</td>
                          <td>{item.concepto}</td>
                          <td>{item.monto_presupuestado}</td>
                          <td>{item.monto_real}</td>
                          <td>{categorias.find(c => c.id === item.categoria_id)?.categoria || "Sin categoría"}</td>
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
          </>
        ) : (
          <div className="mensaje-vacio">
            <h2>No hay movimientos registrados aún.</h2>
            <p>Agrega tu primer ingreso o egreso para comenzar a ver tu cronograma financiero.</p>
            <img src="/agregar.png" alt="add" onClick={() => setMostrarModal(true)} className="agregar" />
          </div>
        )}

        {/* Modal Agregar */}
        {mostrarModal && (
          <div className="modal">
            <div className="modal-contenido">
              <h2>Formulario de Agregar</h2>
              <form onSubmit={agregarN}>
                {/* Campos */}
                <div className="md3-input">
                  <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                  <label>Fecha</label>
                </div>
                <div className="md3-input">
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                  </select>
                  <label>Tipo</label>
                </div>
                <div className="md3-input">
                  <input type="text" value={concepto} onChange={(e) => setConcepto(e.target.value)} required />
                  <label>Concepto</label>
                </div>
                <div className="md3-input">
                  <input type="number" value={monto_presupuestado} onChange={(e) => setMonto_presupuestado(e.target.value)} step="0.01" required />
                  <label>Monto presupuestado</label>
                </div>
                <div className="md3-input">
                  <input type="number" value={monto_real} onChange={(e) => setMonto_real(e.target.value)} step="0.01" required />
                  <label>Monto real</label>
                </div>
                <div className="md3-input">
                  <label>Categoría</label>
                  <select value={categoria_id} onChange={(e) => setCategoriaId(parseInt(e.target.value))}>
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.categoria}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="login-button">Guardar</button>
                <button onClick={() => setMostrarModal(false)}>Cerrar</button>
              </form>
            </div>
          </div>
        )}

        {/* Modal Actualizar */}
        {mostrarModalA && (
          <div className="modal">
            <div className="modal-contenido">
              <h2>Formulario de Actualizar</h2>
              <form onSubmit={actualizar}>
                {/* Mismos campos que el anterior */}
                <div className="md3-input">
                  <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                  <label>Fecha</label>
                </div>
                <div className="md3-input">
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                  </select>
                  <label>Tipo</label>
                </div>
                <div className="md3-input">
                  <input type="text" value={concepto} onChange={(e) => setConcepto(e.target.value)} required />
                  <label>Concepto</label>
                </div>
                <div className="md3-input">
                  <input type="number" value={monto_presupuestado} onChange={(e) => setMonto_presupuestado(e.target.value)} step="0.01" required />
                  <label>Monto presupuestado</label>
                </div>
                <div className="md3-input">
                  <input type="number" value={monto_real} onChange={(e) => setMonto_real(e.target.value)} step="0.01" required />
                  <label>Monto real</label>
                </div>
                <div className="md3-input">
                  <label>Categoría</label>
                  <select value={categoria_id} onChange={(e) => setCategoriaId(parseInt(e.target.value))}>
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.categoria}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="login-button">Actualizar</button>
                <button onClick={() => setMostrarModalA(false)}>Cerrar</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Cronograma;
