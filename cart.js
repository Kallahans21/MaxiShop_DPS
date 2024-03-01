const predefinedProducts = [
    { name: 'Auriculares inalámbricos Bluetooth Soundcore Liberty Neo', price: 59.99, quantity: 10 },
    { name: 'Ratón gaming Logitech G502 Hero', price: 79.99, quantity: 10 },
    { name: 'Teclado mecánico para juegos Redragon K552', price: 49.99, quantity: 10 },
    { name: 'Adaptador de corriente USB-C Anker PowerPort Atom PD 1', price: 99.99, quantity: 10 },
    { name: 'Disco duro externo portátil Western Digital Elements 1TB', price: 54.99, quantity: 10 },
    { name: 'Cámara de seguridad Wyze Cam Pan', price: 59.99, quantity: 10 },
    { name: 'Lámpara inteligente Philips Hue White and Color Ambiance', price: 99.99, quantity: 10 },
    { name: 'Batería externa Anker PowerCore 10000mAh', price: 29.99, quantity: 10 },
    { name: 'Smartwatch Xiaomi Mi Band 6', price: 49.99, quantity: 10 },
    { name: 'Altavoz Bluetooth portátil JBL Flip 5', price: 119.95, quantity: 10 },
    { name: 'Memoria USB SanDisk Ultra Dual Drive de 128GB', price: 34.99, quantity: 10 },
    { name: 'Base de carga inalámbrica Samsung Fast Charge', price: 59.99, quantity: 10 },
    { name: 'Mini proyector DR.Q con pantalla de 100 pulgadas', price: 89.99, quantity: 10 },
    { name: 'Hub USB Anker 4 en 1', price: 19.99, quantity: 10 },
    { name: 'Impresora fotográfica portátil Canon IVY Mini', price: 129.99, quantity: 10 }
];

document.addEventListener('DOMContentLoaded', function() {
    renderProductList();
    updateCartDisplay();
});

let cart = [];

function renderProductList() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    predefinedProducts.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        const availableQuantity = product.quantity - getCartQuantity(product.name);
        productItem.innerHTML = `
            <div class="product-info">
                <p>${product.name} - $${product.price.toFixed(2)} (<span class="available-quantity" id="available-quantity-${index}">${availableQuantity}</span> available)</p>
                <input type="number" min="1" max="${availableQuantity}" value="" placeholder="Quantity" class="product-quantity" id="quantity-${index}">
            </div>
            <button onclick="addToCart(${index})" class="add-to-cart-btn">Add to Cart</button>
        `;
        productList.appendChild(productItem);
    });
}

function addToCart(index) {
    const product = predefinedProducts[index];
    const quantityInput = document.getElementById(`quantity-${index}`);
    const quantity = parseInt(quantityInput.value, 10);

    if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid quantity.');
        return;
    }

    if (quantity > product.quantity) {
        alert("Cannot add more items to the cart than available in stock.");
        return;
    }

    const cartItemIndex = cart.findIndex(item => item.name === product.name);
    if (cartItemIndex > -1) {
        cart[cartItemIndex].quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    // Reduce la cantidad disponible en predefinedProducts
    product.quantity -= quantity;

    updateCartDisplay(); // Asegúrate de actualizar la visualización del carrito
    renderProductList(); // Re-renderiza la lista de productos para actualizar la cantidad disponible
}


function removeFromCart(index) {
    const removedItem = cart[index];
    // Find the product in predefinedProducts to restore its quantity
    const product = predefinedProducts.find(p => p.name === removedItem.name);
    if (product) {
        product.quantity += removedItem.quantity;
    }
    
    cart.splice(index, 1);

    updateAvailableQuantity();
    updateCartDisplay();
    renderProductList();
}

function updateAvailableQuantity() {
    predefinedProducts.forEach((product, index) => {
        const availableQuantity = product.quantity - getCartQuantity(product.name);
        const availableQuantityElement = document.getElementById(`available-quantity-${index}`);
        availableQuantityElement.textContent = availableQuantity;
    });
}

function getCartQuantity(productName) {
    const item = cart.find(item => item.name === productName);
    return item ? item.quantity : 0;
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <p>${item.name} - $${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
            <button onclick="removeFromCart(${index})" class="remove-from-cart-btn">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    document.getElementById('cart-total').textContent = total.toFixed(2);
    document.getElementById('cart-total-display').textContent = `$${total.toFixed(2)}`;
}

function logout() {
    window.location.href = 'login.html';
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Add some items before checking out.');
        return;
    }

    const invoice = generateInvoice();

    Swal.fire({
        icon: 'success',
        title: 'Checkout complete!',
        html: `<pre>${invoice}</pre>`,
        showCancelButton: true,
        cancelButtonText: 'Close',
    }).then((result) => {
        if (result.isConfirmed) {
            downloadPDF(invoice);
        }
    });

    cart = [];
    updateCartDisplay();
    renderProductList(); // Asegúrate de actualizar la lista de productos después del checkout
}

function generateInvoice() {
    let invoiceText = 'Invoice:\n';

    cart.forEach(item => {
        invoiceText += `${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}\n`;
    });

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    invoiceText += `\nTotal: $${total.toFixed(2)}`;

    return invoiceText;
}

function downloadPDF(invoice) {
    const doc = new jsPDF();
    doc.text(invoice, 10, 10);
    doc.save('invoice.pdf');
}
