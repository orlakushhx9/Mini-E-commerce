let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productList = document.getElementById("productList");
const search = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const cartCount = document.getElementById("cartCount");
const cartSummary = document.getElementById("cartSummary");
const cartItems = document.getElementById("cartItems");
const total = document.getElementById("total");
const loadMore = document.getElementById("loadMore");

document.getElementById("cart").onclick = () => {
  renderCart();
  cartSummary.classList.toggle("hidden");
};

document.getElementById("closeCart").onclick = () => {
  cartSummary.classList.add("hidden");
};

// Array de productos - cargar desde localStorage o usar array vacío
let products = JSON.parse(localStorage.getItem("products")) || [];

const PRODUCTS_PER_LOAD = 6;
let currentIndex = 0;
let filteredProducts = [...products]; // Para filtros

function renderProducts(start, end) {
  console.log('Renderizando productos:', { start, end, total: filteredProducts.length });
  const fragment = document.createDocumentFragment();
  
  if (filteredProducts.length === 0) {
    console.log('No hay productos para mostrar');
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-state';
    emptyDiv.innerHTML = `
      <div class="empty-content">
        <h2>No hay productos</h2>
        <p>Haz clic en el botón "+" para agregar tu primer producto</p>
      </div>
    `;
    fragment.appendChild(emptyDiv);
  } else {
    const productsToShow = filteredProducts.slice(start, end);
    console.log('Productos a mostrar:', productsToShow.length);
    
    productsToShow.forEach(product => {
      const div = document.createElement('div');
      div.className = 'product';
      const stockClass = product.stock <= 3 ? 'low-stock' : '';
      const stockText = product.stock <= 3 ? ` (Solo ${product.stock} disponibles)` : '';
      
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p class="price">Precio: $${product.price}</p>
        <p class="stock ${stockClass}">Stock: ${product.stock}${stockText}</p>
        ${product.description ? `<p class="description">${product.description.substring(0, 50)}${product.description.length > 50 ? '...' : ''}</p>` : ''}
        <div class="product-actions">
          <button class="add-to-cart" data-id="${product.id}" ${product.stock <= 0 ? 'disabled' : ''}>${product.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}</button>
          <button class="delete-product" data-id="${product.id}" title="Eliminar producto">🗑️</button>
        </div>
      `;
      fragment.appendChild(div);
    });
  }
  
  productList.appendChild(fragment);
}

function updateLoadMoreVisibility() {
  loadMore.style.display = currentIndex < filteredProducts.length ? "block" : "none";
}

function loadMoreProducts() {
  if (currentIndex >= filteredProducts.length) return;
  renderProducts(currentIndex, currentIndex + PRODUCTS_PER_LOAD);
  currentIndex += PRODUCTS_PER_LOAD;
  updateLoadMoreVisibility();
}

// Scroll infinito
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    currentIndex < filteredProducts.length
  ) {
    loadMoreProducts();
  }
});

// Filtros
function applyFilters() {
  console.log('Aplicando filtros...');
  const term = search.value.toLowerCase();
  const category = filterCategory.value;
  const min = parseFloat(minPrice.value) || 0;
  const max = parseFloat(maxPrice.value) || Infinity;
  
  console.log('Filtros:', { term, category, min, max, totalProducts: products.length });
  
  filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(term) || 
                         (p.description && p.description.toLowerCase().includes(term));
    const matchesCategory = category === "" || p.category === category;
    const matchesPrice = p.price >= min && p.price <= max;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  console.log('Productos filtrados:', filteredProducts.length);
  
  // Reiniciar catálogo filtrado
  productList.innerHTML = "";
  currentIndex = 0;
  loadMoreProducts();
  updateLoadMoreVisibility();
}

search.addEventListener("input", applyFilters);
filterCategory.addEventListener("change", applyFilters);
minPrice.addEventListener("input", applyFilters);
maxPrice.addEventListener("input", applyFilters);

// Inicializar catálogo
loadMoreProducts();
updateLoadMoreVisibility();

// Delegar evento para botones de productos
productList.addEventListener('click', function(e) {
  if (e.target.classList.contains('add-to-cart') && e.target.dataset.id) {
    addToCart(Number(e.target.dataset.id));
  } else if (e.target.classList.contains('delete-product') && e.target.dataset.id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteProduct(Number(e.target.dataset.id));
    }
  }
});

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(p => p.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartCount();
}

function renderCart() {
  cartItems.innerHTML = "";
  let sum = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)} <button class='remove-from-cart' data-id='${item.id}'>Eliminar</button>`;
    cartItems.appendChild(li);
    sum += item.price * item.quantity;
  });
  total.textContent = sum.toFixed(2);
}

function updateCartCount() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Función para guardar productos en localStorage
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

// Función para obtener categorías únicas
function getUniqueCategories() {
  const categories = products.map(p => p.category).filter(Boolean);
  return [...new Set(categories)];
}

// Delegar evento para eliminar productos del carrito
cartItems.addEventListener('click', function(e) {
  if (e.target.classList.contains('remove-from-cart')) {
    const id = Number(e.target.dataset.id);
    removeFromCart(id);
  }
});

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  updateCartCount();
}

// Función para eliminar productos
function deleteProduct(id) {
  products = products.filter(product => product.id !== id);
  saveProducts();
  applyFilters();
}

updateCartCount();

loadMore.addEventListener("click", loadMoreProducts);

// Inicialización
console.log('Productos cargados:', products.length);
console.log('Productos filtrados:', filteredProducts.length);

// --- MODAL DE PRODUCTO ---
const addProductBtn = document.getElementById('addProductBtn');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const productName = document.getElementById('productName');
const productPrice = document.getElementById('productPrice');
const productImage = document.getElementById('productImage');
const productDescription = document.getElementById('productDescription');
const productStock = document.getElementById('productStock');
const productCategory = document.getElementById('productCategory');
const imagePreview = document.getElementById('imagePreview');
let editingProductId = null;

function openProductModal(mode, product = null) {
  productModal.classList.remove('hidden');
  if (mode === 'edit' && product) {
    modalTitle.textContent = 'Editar producto';
    productName.value = product.name;
    productPrice.value = product.price;
    productImage.value = ''; // Limpiar input de archivo
    productDescription.value = product.description || '';
    productStock.value = product.stock || 1;
    productCategory.value = product.category;
    editingProductId = product.id;
    // Mostrar imagen actual si existe
    if (product.image) {
      imagePreview.innerHTML = `<img src="${product.image}" alt="Vista previa" style="max-width: 150px; max-height: 150px; border-radius: 8px;">`;
      imagePreview.classList.remove('hidden');
    } else {
      imagePreview.classList.add('hidden');
    }
  } else {
    modalTitle.textContent = 'Registrar producto';
    productName.value = '';
    productPrice.value = '';
    productImage.value = '';
    productDescription.value = '';
    productStock.value = '1';
    productCategory.value = '';
    editingProductId = null;
    imagePreview.classList.add('hidden');
  }
}

function closeProductModal() {
  productModal.classList.add('hidden');
}

addProductBtn.addEventListener('click', () => openProductModal('new'));
closeModal.addEventListener('click', closeProductModal);

// Event listeners para botones de estadísticas y datos
const statsBtn = document.getElementById('statsBtn');
const dataBtn = document.getElementById('dataBtn');
const statsModal = document.getElementById('statsModal');
const dataModal = document.getElementById('dataModal');
const closeStatsModal = document.getElementById('closeStatsModal');
const closeDataModal = document.getElementById('closeDataModal');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');

// Elementos del sistema de pago
const checkoutBtn = document.getElementById('checkoutBtn');
const paymentModal = document.getElementById('paymentModal');
const closePaymentModal = document.getElementById('closePaymentModal');
const paymentForm = document.getElementById('paymentForm');
const paymentItems = document.getElementById('paymentItems');
const paymentTotal = document.getElementById('paymentTotal');
const cancelPayment = document.getElementById('cancelPayment');
const cardNumber = document.getElementById('cardNumber');
const cardExpiry = document.getElementById('cardExpiry');
const cardCvv = document.getElementById('cardCvv');
const cardHolder = document.getElementById('cardHolder');
const cardType = document.getElementById('cardType');
// Tarjeta visual
const visualCardNumber = document.getElementById('visualCardNumber');
const visualCardHolder = document.getElementById('visualCardHolder');
const visualCardExpiry = document.getElementById('visualCardExpiry');
const visualCardType = document.getElementById('visualCardType');

// Abrir modal de estadísticas
statsBtn.addEventListener('click', () => {
  updateStats();
  statsModal.classList.remove('hidden');
});

// Cerrar modal de estadísticas
closeStatsModal.addEventListener('click', () => {
  statsModal.classList.add('hidden');
});

// Abrir modal de datos
dataBtn.addEventListener('click', () => {
  dataModal.classList.remove('hidden');
});

// Cerrar modal de datos
closeDataModal.addEventListener('click', () => {
  dataModal.classList.add('hidden');
});

// Exportar productos
exportBtn.addEventListener('click', exportProducts);

// Importar productos
importBtn.addEventListener('click', () => {
  if (importFile.files[0]) {
    importProducts(importFile.files[0]);
    dataModal.classList.add('hidden');
  } else {
    alert('Por favor selecciona un archivo JSON para importar.');
  }
});

// Cerrar modales al hacer click fuera del contenido
statsModal.addEventListener('click', (e) => {
  if (e.target === statsModal) statsModal.classList.add('hidden');
});

dataModal.addEventListener('click', (e) => {
  if (e.target === dataModal) dataModal.classList.add('hidden');
});

// Funciones del sistema de pago
function openPaymentModal() {
  if (cart.length === 0) {
    alert('Tu carrito está vacío. Agrega productos antes de pagar.');
    return;
  }
  
  // Mostrar resumen de compra
  paymentItems.innerHTML = '';
  let total = 0;
  
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'payment-item';
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    div.innerHTML = `
      <span>${item.name} x${item.quantity}</span>
      <span>$${itemTotal.toFixed(2)}</span>
    `;
    paymentItems.appendChild(div);
  });
  
  paymentTotal.textContent = total.toFixed(2);
  paymentModal.classList.remove('hidden');
  
  // Limpiar formulario
  paymentForm.reset();
}

function processPayment(e) {
  e.preventDefault();
  
  // Validaciones básicas
  const cardNum = cardNumber.value.replace(/\s/g, '');
  const expiry = cardExpiry.value;
  const cvv = cardCvv.value;
  const holder = cardHolder.value.trim();
  const type = cardType.value;
  
  if (cardNum.length < 13 || cardNum.length > 19) {
    alert('Número de tarjeta inválido');
    return;
  }
  
  if (!expiry.match(/^\d{2}\/\d{2}$/)) {
    alert('Formato de fecha inválido (MM/AA)');
    return;
  }
  
  if (cvv.length < 3) {
    alert('CVV inválido');
    return;
  }
  
  if (holder.length < 3) {
    alert('Nombre del titular inválido');
    return;
  }
  
  if (!type) {
    alert('Selecciona un tipo de tarjeta');
    return;
  }
  
  // Simular procesamiento de pago
  const processBtn = document.getElementById('processPayment');
  const originalText = processBtn.textContent;
  processBtn.textContent = '⏳ Procesando...';
  processBtn.disabled = true;
  
  setTimeout(() => {
    // Simular éxito del pago
    alert('✅ ¡Pago procesado exitosamente!\n\nGracias por tu compra. Recibirás un email de confirmación.');
    
    // Limpiar carrito
    cart = [];
    saveCart();
    renderCart();
    updateCartCount();
    
    // Cerrar modales
    paymentModal.classList.add('hidden');
    cartSummary.classList.add('hidden');
    
    // Restaurar botón
    processBtn.textContent = originalText;
    processBtn.disabled = false;
  }, 2000);
}

// Reemplaza el event listener de checkoutBtn para abrir una nueva ventana de pago
checkoutBtn.addEventListener('click', function() {
  if (cart.length === 0) {
    alert('Tu carrito está vacío. Agrega productos antes de pagar.');
    return;
  }
  // Calcula el total
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
  });
  // Abre la ventana de pago y pasa el total como query param
  window.open('pago.html?total=' + encodeURIComponent(total.toFixed(2)), '_blank', 'width=500,height=700');
});
// --- Cierre seguro del modal de pago ---
closePaymentModal.addEventListener('click', function() {
  paymentModal.classList.add('hidden');
});
cancelPayment.addEventListener('click', function() {
  paymentModal.classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', function() {
  // Elementos del modal de pago
  const paymentModal = document.getElementById('paymentModal');
  const closePaymentModal = document.getElementById('closePaymentModal');
  const cancelPayment = document.getElementById('cancelPayment');

  // Cerrar con la X
  if (closePaymentModal) {
    closePaymentModal.onclick = function() {
      paymentModal.classList.add('hidden');
    };
  }

  // Cerrar con Cancelar
  if (cancelPayment) {
    cancelPayment.onclick = function() {
      paymentModal.classList.add('hidden');
    };
  }

  // Cerrar haciendo click fuera del contenido
  if (paymentModal) {
    paymentModal.addEventListener('click', function(e) {
      if (e.target === paymentModal) {
        paymentModal.classList.add('hidden');
      }
    });
  }
});

paymentForm.addEventListener('submit', processPayment);

// Tarjeta visual en tiempo real
cardNumber.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  visualCardNumber.textContent = value.padEnd(19, '•');
  // Detectar tipo de tarjeta
  if (value.startsWith('4')) visualCardType.textContent = 'VISA';
  else if (value.startsWith('5')) visualCardType.textContent = 'MASTERCARD';
  else if (value.startsWith('3')) visualCardType.textContent = 'AMEX';
  else visualCardType.textContent = '';
});
cardHolder.addEventListener('input', function(e) {
  visualCardHolder.textContent = e.target.value.toUpperCase() || 'NOMBRE DEL TITULAR';
});
cardExpiry.addEventListener('input', function(e) {
  visualCardExpiry.textContent = e.target.value || 'MM/AA';
});
cardType.addEventListener('change', function(e) {
  visualCardType.textContent = e.target.selectedOptions[0].text.toUpperCase();
});

// Formatear número de tarjeta
cardNumber.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
  value = value.replace(/(\d{4})/g, '$1 ').trim();
  e.target.value = value;
});

// Formatear fecha de vencimiento
cardExpiry.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  e.target.value = value;
});

// Solo números para CVV
cardCvv.addEventListener('input', function(e) {
  e.target.value = e.target.value.replace(/\D/g, '');
});

// Event listener para mostrar vista previa de imagen
productImage.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreview.innerHTML = `<img src="${e.target.result}" alt="Vista previa" style="max-width: 150px; max-height: 150px; border-radius: 8px;">`;
      imagePreview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.classList.add('hidden');
  }
});

// Cerrar modal al hacer click fuera del contenido
productModal.addEventListener('click', (e) => {
  if (e.target === productModal) closeProductModal();
});

// Delegar click en productos para editar (excepto botones)
productList.addEventListener('click', function(e) {
  // Si es cualquier botón, no abrir modal de edición
  if (e.target.tagName === 'BUTTON') return;
  // Buscar la tarjeta de producto
  let productDiv = e.target.closest('.product');
  if (productDiv) {
    // Buscar el producto por ID
    const id = Number(productDiv.querySelector('.add-to-cart').dataset.id);
    const product = products.find(p => p.id === id);
    if (product) openProductModal('edit', product);
  }
});

// Función para convertir imagen a base64
function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Guardar producto (nuevo o editado)
productForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = productName.value.trim();
  const price = parseFloat(productPrice.value);
  const imageFile = productImage.files[0];
  const description = productDescription.value.trim();
  const stock = parseInt(productStock.value) || 0;
  const category = productCategory.value;
  
  if (!name || !price || !imageFile || !category) {
    alert('Por favor completa todos los campos obligatorios');
    return;
  }

  try {
    // Convertir imagen a base64
    const imageBase64 = await convertImageToBase64(imageFile);
    
    if (editingProductId) {
      // Editar producto existente
      const idx = products.findIndex(p => p.id === editingProductId);
      if (idx !== -1) {
        products[idx] = { 
          ...products[idx], 
          name, 
          price: price.toFixed(2), 
          image: imageBase64, 
          description,
          stock,
          category 
        };
      }
    } else {
      // Nuevo producto
      const newProduct = {
        id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        price: price.toFixed(2),
        image: imageBase64,
        description,
        stock,
        category
      };
      products.push(newProduct);
    }
    // Guardar productos en localStorage y recargar catálogo
    saveProducts();
    applyFilters();
    closeProductModal();
  } catch (error) {
    alert('Error al procesar la imagen. Por favor intenta de nuevo.');
    console.error('Error:', error);
  }
});

// Funciones para estadísticas
function updateStats() {
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= 3).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  
  document.getElementById('totalProducts').textContent = totalProducts;
  document.getElementById('lowStockProducts').textContent = lowStockProducts;
  document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
  
  // Estadísticas por categoría con información de stock bajo
  const categoryStats = document.getElementById('categoryStats');
  const categories = getUniqueCategories();
  categoryStats.innerHTML = '';
  
  categories.forEach(category => {
    const categoryProducts = products.filter(p => p.category === category);
    const count = categoryProducts.length;
    const lowStockCount = categoryProducts.filter(p => p.stock <= 3).length;
    const totalStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0);
    
    const div = document.createElement('div');
    div.className = 'category-stat';
    const lowStockIndicator = lowStockCount > 0 ? ` <span class="low-stock-indicator">(${lowStockCount} con stock bajo)</span>` : '';
    div.innerHTML = `<span>${category}:</span> <strong>${count}</strong> productos (${totalStock} unidades)${lowStockIndicator}`;
    categoryStats.appendChild(div);
  });
}

// Funciones para exportar/importar
function exportProducts() {
  const dataStr = JSON.stringify(products, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `productos_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importProducts(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedProducts = JSON.parse(e.target.result);
      if (Array.isArray(importedProducts)) {
        // Generar nuevos IDs para evitar conflictos
        const maxId = products.length ? Math.max(...products.map(p => p.id)) : 0;
        importedProducts.forEach((product, index) => {
          product.id = maxId + index + 1;
        });
        products = [...products, ...importedProducts];
        saveProducts();
        applyFilters();
        alert(`Se importaron ${importedProducts.length} productos exitosamente.`);
      } else {
        alert('El archivo no contiene un array válido de productos.');
      }
    } catch (error) {
      alert('Error al leer el archivo. Asegúrate de que sea un archivo JSON válido.');
      console.error('Error:', error);
    }
  };
  reader.readAsText(file);
}

