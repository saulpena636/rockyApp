import { useState } from "react";
import FinanzasTable from "./finanzastable";
import EditModal from "./EditModal";

export default function Cronograma() {
  const [movimientos, setMovimientos] = useState([]); // Datos ya agrupados
  const [movimientoActivo, setMovimientoActivo] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleEditar = (mov) => {
    setMovimientoActivo(mov);
    setMostrarModal(true);
  };

  const handleGuardar = (editado) => {
    // Acá actualizás la DB y actualizás el estado local
    setMovimientos((prev) =>
      prev.map((dia) => ({
        ...dia,
        ingresos: dia.ingresos.map((m) => (m.id === editado.id ? editado : m)),
        egresos: dia.egresos.map((m) => (m.id === editado.id ? editado : m)),
      }))
    );
    setMostrarModal(false);
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este movimiento?")) {
      setMovimientos((prev) =>
        prev.map((dia) => ({
          ...dia,
          ingresos: dia.ingresos.filter((m) => m.id !== id),
          egresos: dia.egresos.filter((m) => m.id !== id),
        }))
      );
      // También llamás al backend para eliminar
    }
  };

  return (
    <div>
      <h2>Tabla financiera</h2>
      <FinanzasTable datos={movimientos} onEditar={handleEditar} onEliminar={handleEliminar} />
      {mostrarModal && (
        <EditModal
          movimiento={movimientoActivo}
          onClose={() => setMostrarModal(false)}
          onSave={handleGuardar}
        />
      )}
    </div>
  );
}
