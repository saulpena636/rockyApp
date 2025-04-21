import "./editModal.css"

export default function EditModal({ movimiento, onClose, onSave }) {
    const [editado, setEditado] = useState({ ...movimiento });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditado((prev) => ({
        ...prev,
        [name]: name.includes("monto") ? parseFloat(value) : value,
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(editado);
    };
  
    return (
      <div className="modal-backdrop">
        <div className="modal">
          <h3>Editar movimiento</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Concepto:
              <input name="concepto" value={editado.concepto} onChange={handleChange} />
            </label>
            <label>
              Presupuestado:
              <input name="monto_presupuestado" type="number" value={editado.monto_presupuestado} onChange={handleChange} />
            </label>
            <label>
              Real:
              <input name="monto_real" type="number" value={editado.monto_real} onChange={handleChange} />
            </label>
            <div className="modal-actions">
              <button type="submit">Guardar</button>
              <button type="button" onClick={onClose}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  