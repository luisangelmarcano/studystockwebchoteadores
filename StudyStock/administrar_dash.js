// Obtener el botón y el iframe por su ID
var refreshButton = document.getElementById('refreshButton');
var iframe = document.getElementById('miIframe');

// Función para refrescar el iframe
function refreshIframe() {
    iframe.src = iframe.src; // Recarga el iframe actualizando la URL
}

// Asociar la función refreshIframe al evento click del botón
refreshButton.addEventListener('click', refreshIframe);
