// Ejecutarse cuando el DOM este cargado para que no genere problemas.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ticketForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita volver a cargar la pagina.

    // Obtener los valores del formulario.
    const ticketData = {
      cliente: document.getElementById('cliente').value,
      telefono: document.getElementById('telefono').value,
      email: document.getElementById('email').value,
      modelo: document.getElementById('modelo').value,
      problema: document.getElementById('problema').value,
      diagnostico: document.getElementById('diagnostico').value,
      fecha: document.getElementById('fecha').value,
    };

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticketData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('Ticket creado exitosamente (ID: ' + result.id + ')');
        form.reset(); // Limpia el formulario
        cargarTicketsActivos(); // Recarga los tickets activos
      } else {
        alert('Error creando ticket: ' + result.error);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Error de red al enviar el formulario');
    }
  });

  // Cargar tickets activos al iniciar
  cargarTicketsActivos();
});
// Funcion de marcar como entregado
async function marcarComoEntregado(id) {
  try {
    const response = await fetch(`/api/tickets/${id}/entregar`, {
      method: 'PUT'
    });

    const result = await response.json();

    if (response.ok) {
      alert('Ticket entregado');
      cargarTicketsActivos(); // Recargar tabla
    } else {
      alert('Error al marcar como entregado: ' + result.error);
    }
  } catch (error) {
    console.error('Error al marcar como entregado:', error);
  }
}

// Funcion para cargar los tickets activos desde la base de datos
async function cargarTicketsActivos() {
  try {
    const response = await fetch('/api/tickets/activos');
    const tickets = await response.json();

    const tbody = document.querySelector('#ticketsTable tbody');
    tbody.innerHTML = ''; // Limpia la tabla

    tickets.forEach(ticket => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${ticket.id}</td>
        <td>${ticket.cliente}</td>
        <td>${ticket.telefono}</td>
        <td>${ticket.email || '-'}</td>
        <td>${ticket.modelo}</td>
        <td>${ticket.problema}</td>
        <td>${ticket.diagnostico || '-'}</td>
        <td>${ticket.fecha}</td>
        <td>${ticket.estado}</td>
        <td>
          <button onclick="marcarComoEntregado(${ticket.id})">Entregar</button>
        </td>
      `;
//Lo ingresa a la tabla
      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error('Error al cargar tickets activos:', error);
  }
}
//volver a la naturaleza seria su mayor riquesa.
