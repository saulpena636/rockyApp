export async function getMovimientos() {
    const res = await fetch("http://localhost:8000/api/movimientos");
    const data = await res.json();
    return data;
  }
  
  