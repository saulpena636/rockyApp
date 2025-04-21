export default function FinanzasTable({ datos, onEditar, onEliminar }) {
    return (
      <table className="finanzas-table">
        <thead>
          <tr>
            <th>Día</th>
            <th colSpan="3">Ingresos</th>
            <th colSpan="3">Egresos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((diaData, index) => {
            const numFilas = Math.max(diaData.ingresos.length, diaData.egresos.length);
            const filas = [];
  
            const totalIngresosPresup = diaData.ingresos.reduce((acc, item) => acc + item.presupuestado, 0);
            const totalIngresosReal = diaData.ingresos.reduce((acc, item) => acc + item.real, 0);
            const totalEgresosPresup = diaData.egresos.reduce((acc, item) => acc + item.presupuestado, 0);
            const totalEgresosReal = diaData.egresos.reduce((acc, item) => acc + item.real, 0);
  
            for (let i = 0; i < numFilas; i++) {
              const ingreso = diaData.ingresos[i];
              const egreso = diaData.egresos[i];
  
              const idIngreso = ingreso?.id;
              const idEgreso = egreso?.id;
  
              // Fila presupuestado
              filas.push(
                <tr key={`${index}-presup-${i}`}>
                  {i === 0 && <td rowSpan={numFilas * 2 + 2}>{diaData.dia}</td>}
  
                  <td>Presupuestado</td>
                  <td>{ingreso?.concepto || ''}</td>
                  <td>${ingreso?.presupuestado || 0}</td>
  
                  <td>Presupuestado</td>
                  <td>{egreso?.concepto || ''}</td>
                  <td>${egreso?.presupuestado || 0}</td>
  
                  <td rowSpan="2"></td> {/* vacío, botones vienen abajo */}
                </tr>
              );
  
              // Fila real con acciones
              filas.push(
                <tr key={`${index}-real-${i}`}>
                  <td>Real</td>
                  <td></td>
                  <td>${ingreso?.real || 0}</td>
  
                  <td>Real</td>
                  <td></td>
                  <td>${egreso?.real || 0}</td>
  
                  <td>
                    {egreso && (
                      <>
                        <button onClick={() => onEditar(egreso)}>Editar</button>
                        <button onClick={() => onEliminar(egreso.id)}>Eliminar</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            }
  
            // Totales
            filas.push(
              <tr key={`${index}-total-presup`}>
                <td colSpan="2">Total Presupuestado</td>
                <td>${totalIngresosPresup}</td>
  
                <td colSpan="2">Total Presupuestado</td>
                <td>${totalEgresosPresup}</td>
                <td></td>
              </tr>,
              <tr key={`${index}-total-real`}>
                <td colSpan="2">Total Real</td>
                <td>${totalIngresosReal}</td>
  
                <td colSpan="2">Total Real</td>
                <td>${totalEgresosReal}</td>
                <td></td>
              </tr>
            );
  
            return filas;
          })}
        </tbody>
      </table>
    );
  }
  