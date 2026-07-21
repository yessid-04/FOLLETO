
// ===================== NAVEGACIÓN POR PESTAÑAS (sin recargar la página) =====================
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const navTabs = document.getElementById('navTabs');
const menuToggle = document.getElementById('menuToggle');

const VALID_TARGETS = Array.from(panels).map(p => p.id);

function showPanel(id, { updateHash = true, closeMobileMenu = true } = {}) {
  if (!VALID_TARGETS.includes(id)) id = VALID_TARGETS[0];

  panels.forEach(panel => panel.classList.toggle('active', panel.id === id));
  tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.target === id));

  if (updateHash) {
    history.pushState(null, '', `#${id}`);
  }

  // Llevar el foco al inicio del panel para accesibilidad
  const activePanel = document.getElementById(id);
  if (activePanel) activePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (closeMobileMenu) {
    navTabs.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
}

// Clic en cualquier pestaña del menú
tabs.forEach(tab => {
  tab.addEventListener('click', () => showPanel(tab.dataset.target));
});

// Botones internos que también cambian de pestaña (ej. "Ver servicios")
document.querySelectorAll('[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => showPanel(btn.dataset.goto));
});

// Botón hamburguesa (móvil)
menuToggle.addEventListener('click', () => {
  const isOpen = navTabs.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

// Soporta los botones atrás/adelante del navegador
window.addEventListener('popstate', () => {
  showPanel(location.hash.replace('#', ''), { updateHash: false });
});

// Carga inicial: respeta el hash de la URL si viene uno (ej. mecelsa.com/#servicios)
showPanel(location.hash.replace('#', '') || 'inicio', { updateHash: false });


// ===================== FORMULARIO "TRABAJE CON NOSOTROS" =====================
// No hay backend en este sitio estático: al enviar, se arma un mensaje y se abre WhatsApp
// con los datos ya escritos. Si luego conectas un servicio como Formspree o EmailJS,
// solo reemplaza el contenido de esta función por el envío real.
const jobForm = document.getElementById('jobForm');

jobForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(jobForm);
  const nombre = data.get('nombre').trim();
  const correo = data.get('correo').trim();
  const telefono = data.get('telefono').trim();
  const profesion = data.get('profesion').trim();
  const experiencia = data.get('experiencia').trim();
  const ciudad = data.get('ciudad').trim();
 
  const mensaje =
    `Hola, quiero postularme a MECEL S.C.%0A` +
    `Nombre: ${nombre}%0A` +
    `Correo: ${correo}%0A` +
    `Teléfono: ${telefono}%0A` +
    `Profesión: ${profesion}%0A` +
    `Experiencia: ${experiencia}%0A` +
    `Ciudad: ${ciudad}`;
 
  window.open(`https://wa.me/573157674984?text=${mensaje}`, '_blank');
  jobForm.reset();
});

// ===================== MODAL "SOLICITAR INFORMACIÓN" =====================
const servicioModal = document.getElementById('servicioModal');
const modalServicioTexto = document.getElementById('modalServicioTexto');
const modalWhatsapp = document.getElementById('modalWhatsapp');
const modalCorreo = document.getElementById('modalCorreo');
const modalClose = document.getElementById('modalClose');

const NUMERO_WHATSAPP = '573157674984'; // mismo numero que ya usas en el resto del sitio
const CORREO_CONTACTO = 'ismaelosoman@yahoo.es'; // mismo correo que ya usas en Contactenos

document.querySelectorAll('[data-servicio]').forEach(btn => {
  btn.addEventListener('click', () => {
    const servicio = btn.dataset.servicio;
    const mensaje = `Hola, estoy interesado en ${servicio}.`;

    modalServicioTexto.textContent = `${servicio} — ¿cómo prefieres contactarnos?`;
    modalWhatsapp.href = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    modalCorreo.href = `mailto:${CORREO_CONTACTO}?subject=${encodeURIComponent('Interés en ' + servicio)}&body=${encodeURIComponent(mensaje)}`;

    servicioModal.classList.add('open');
  });
});

function cerrarModal() {
  servicioModal.classList.remove('open');
}
modalClose.addEventListener('click', cerrarModal);
servicioModal.addEventListener('click', (e) => {
  if (e.target === servicioModal) cerrarModal(); // clic afuera de la cajita, cierra
});
