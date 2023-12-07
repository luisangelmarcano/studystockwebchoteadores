let mostrador3 = document.getElementById("mostrador");
let seleccion3 = document.getElementById("seleccion");
let imgSeleccionada3 = document.getElementById("img");
let modeloSeleccionado3 = document.getElementById("modelo");
let descripSeleccionada3 = document.getElementById("detalle3");
let precioSeleccionado3 = document.getElementById("precio");
let nombreProducto3 = document.getElementById("nombreproducto3");
let categoria3 = document.getElementById("categoria");

function getMateriales() {
  let queryPrestamos = `query {
    getPrestamos {
      solicitud {
        ticket {
          producto {
            id
          }
        }
      }
    }
  }
  `;
  
  let prestamosActivos = [];
  $.ajax({
    type: "POST",
    url: "http://localhost:8091/graphql",
    contentType: "application/json",
    timeout: 15000,
    data: JSON.stringify({
      query: queryPrestamos,
      variables: {}
    }),
    success: function (response) {
      prestamosActivos = response.data.getPrestamos.map(prestamo => prestamo.solicitud.ticket.producto.id);

      let query = `
        query {
          getProductos {
            id
            nombreproducto
            categoria
            autor
            editorial
            detalle
            imagen
          }
        }
      `;

      $.ajax({
        type: "POST",
        url: "http://localhost:8091/graphql",
        contentType: "application/json",
        timeout: 15000,
        data: JSON.stringify({
          query: query,
          variables: {}
        }),
        success: function (response) {
          console.log(response);
          let catalogoContainer = document.getElementById('container');
          console.log("permisos:", prestamosActivos);
          if (response.data.getProductos.length > 0) {
            // Filtrar productos solo para la categoría "Materiales"
            let productosMateriales = response.data.getProductos.filter(producto => producto.categoria === 'Materiales' && !prestamosActivos.includes(producto.id));
            // Iteración sobre los productos filtrados
            productosMateriales.forEach((producto, index) => {
              let divMostrador = document.createElement('div');
              divMostrador.className = 'item';
              
              divMostrador.onclick = function () {
              divMostrador.dataset.id = producto.id;
                cargar(this, producto);
              };

              let divContenedorFoto = document.createElement('div');
              divContenedorFoto.className = 'catalogo-container';

              let img = document.createElement('img');
              img.src = "http://localhost/dbstudystock/" + producto.imagen;
              img.alt = producto.nombreproducto;
              img.setAttribute('data-id', producto.id);
              divContenedorFoto.appendChild(img);
              divMostrador.appendChild(divContenedorFoto);
              

              catalogoContainer.appendChild(divMostrador);
            });
          } else {
            console.log("No se encontraron productos.");
          }
        }
      });
    }
  });
};
var idProducto3;
var ProductoDetalle3;
var NombreProducto3;

function cargar(item, producto) {
  console.log("Cargo:");
  idProducto3 = producto.id;
  ProductoDetalle3 = producto.detalle;
  console.log(ProductoDetalle3);
  NombreProducto3 = producto.nombreproducto;
  console.log(NombreProducto3);
  quitarBordes();
  mostrador.style.width = "60%";
  seleccion.style.width = "40%";
  seleccion.style.opacity = "1";
  item.style.border = "2px solid red";
    
  imgSeleccionada3.src = item.getElementsByTagName("img")[0].src;
  descripSeleccionada3.innerHTML = ProductoDetalle3;


  let productId = item.dataset.id;

 

  nombreProducto3.innerHTML = NombreProducto3;

 
    

}
function cerrar(){
    mostrador.style.width = "100%";
    seleccion.style.width = "0%";
    seleccion.style.opacity = "0";
    quitarBordes();
}
function quitarBordes(){
    var items = document.getElementsByClassName("item");
    for(i=0;i <items.length; i++){
        items[i].style.border = "none";
    }
}

/* ========================= */
const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');

// Lista de todos los contenedores de productos
const productsList = document.querySelector('.container-items');



	

// Funcion para mostrar  HTML
const showHTML = () => {
	if (!allProducts.length) {
		cartEmpty.classList.remove('hidden');
		rowProduct.classList.add('hidden');
		cartTotal.classList.add('hidden');
	} else {
		cartEmpty.classList.add('hidden');
		rowProduct.classList.remove('hidden');
		cartTotal.classList.remove('hidden');
	}

	// Limpiar HTML
	rowProduct.innerHTML = '';

	let total = 0;
	let totalOfProducts = 0;

	allProducts.forEach(product => {
		const containerProduct = document.createElement('div');
		containerProduct.classList.add('cart-product');

		containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        `;

		rowProduct.append(containerProduct);

		total =
			total + parseInt(product.quantity * product.price.slice(1));
		totalOfProducts = totalOfProducts + product.quantity;
	});

	valorTotal.innerText = `$${total}`;
	countProducts.innerText = totalOfProducts;
};




// script para administrador
const  optionMenu = document.querySelector(".select-menu"),
       selectBtn = optionMenu.querySelector(".select-btn"),
       options = optionMenu.querySelectorAll(".option"),
       sBtn_text = optionMenu.querySelector(".sBtn-text");
selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));       
options.forEach(option =>{
});
// script para administardor inventario

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("inventory-form");
    const inventoryList = document.getElementById("inventory");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const productName = document.getElementById("product-name").value;
        const stockQuantity = document.getElementById("stock-quantity").value;
        const productCategory = document.getElementById("product-category").value;
        const productImage = document.getElementById("product-image").value; // Aquí deberías manejar la imagen de alguna manera

        if (productName && stockQuantity && productCategory) {
            // Crea un nuevo elemento de lista y muestra los detalles del producto
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <strong>Nombre:</strong> ${productName}<br>
                <strong>Cantidad:</strong> ${stockQuantity}<br>
                <strong>Categoría:</strong> ${productCategory}<br>
                <strong>Imagen:</strong> ${productImage}<br>
            `;
            inventoryList.appendChild(listItem);

            // Limpia el formulario después de agregar el producto
            form.reset();
        } else {
            alert("Por favor, complete todos los campos obligatorios.");
        }
    });
});


// administar-usuarios.html
function showPopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "block";
}

function closePopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "none";
}



    const solicitudes = [
      { nombre: 'Tomy', idSolicitud: 1, solicitud: 'Quiero extender la fecha del préstamo', estado: 'Pendiente' },
      // Agrega más solicitudes aquí
    ];

    // Función para cargar las solicitudes en la tabla
    function cargarSolicitudes() {
      const tableBody = document.getElementById('solicitudes-table-body');
      tableBody.innerHTML = ''; // Limpiar la tabla antes de cargar nuevas filas

      solicitudes.forEach((solicitud) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${solicitud.nombre}</td>
          <td>${solicitud.idSolicitud}</td>
          <td>${solicitud.solicitud}</td>
          <td>${solicitud.estado}</td>
        `;
        tableBody.appendChild(row);
      });
    }

    // Llama a la función para cargar las solicitudes al cargar la página
    cargarSolicitudes();






const facturas = [
  { id: 1, factura: "factura1", fecha: "2023-10-23", compra: "Producto A" },
  { id: 2, factura: "factura2", fecha: "2023-10-22", compra: "Producto B" }
  // ... Agrega más facturas aquí si es necesario
];

const tabla = document.getElementById('facturas-table');

function renderizarTabla() {
  tabla.innerHTML = `<tr>
                      <th>Factura</th>
                      <th>Fecha</th>
                      <th>Compra</th>
                      <th>Acciones</th>
                  </tr>`;
  facturas.forEach(factura => {
      const fila = `<tr>
                      <td>${factura.factura}</td>
                      <td>${factura.fecha}</td>
                      <td>${factura.compra}</td>
                      <td><button class="button" onclick="verFactura(${factura.id})">Ver</button></td>
                  </tr>`;
      tabla.innerHTML += fila;
  });
}

function verFactura(id) {
  // Lógica para ver la factura según el ID
  alert(`Ver factura con ID: ${id}`);
}

document.getElementById('agregar').addEventListener('click', function() {
  // Lógica para agregar una nueva factura
  alert('Agregar nueva factura');
});

document.getElementById('eliminar').addEventListener('click', function() {
  // Lógica para eliminar una factura
  alert('Eliminar factura');
});

renderizarTabla();



