document.addEventListener('DOMContentLoaded', () => {
  // Simulación de usuario logueado (reemplaza por tu lógica real)
  const idUsuario = localStorage.getItem('idUsuario') || 1;

  document.getElementById('btnEntrada').onclick = async () => {
    const res = await fetch('/asistencia/entrada', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idUsuario })
    });
    const data = await res.json();
    document.getElementById('mensaje').innerText = data.mensaje || data.error;
  };

  document.getElementById('btnSalida').onclick = async () => {
    const res = await fetch('/asistencia/salida', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idUsuario })
    });
    const data = await res.json();
    document.getElementById('mensaje').innerText = data.mensaje || data.error;
  };
});
