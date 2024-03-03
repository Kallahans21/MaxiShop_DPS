// Array with list of products, price and quantity
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

// Function that renders the list of products in the DOM
function renderProductList() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    predefinedProducts.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        const availableQuantity = product.quantity;
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

    // Validation to not enter more products than exist
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

    // Reduce the quantity available in predefined Products
    product.quantity -= quantity;

    updateCartDisplay(); 
    renderProductList(); 
}


function removeFromCart(index) {
    const removedItem = cart[index];
    // Find the product in predefinedProducts to restore its quantity
    const product = predefinedProducts.find(p => p.name === removedItem.name);
    if (product) {
        product.quantity += removedItem.quantity;
    }
    
    cart.splice(index, 1);

    // To update the user interface
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
        showCancelButton: false,
        confirmButtonText: 'Download checkout'
    }).then((result) => {
        if (result.isConfirmed) {
            downloadPDF(invoice);
            console.log(invoice)
            cart = [];
            updateCartDisplay();
            renderProductList(); 
        }
    });
}

function downloadPDF() {
    var now = new Date();
    // Formats to display in the PDF
    var fechaParaPDF = now.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
    var horaParaPDF = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

    // File name formats
    var fechaParaArchivo = fechaParaPDF.replace(/\//g, '-');
    var horaParaArchivo = horaParaPDF.replace(/:/g, '-');

    var docDefinition = { 
        
        content: [
            { text: 'Maxi Shop', style: 'header', alignment: 'center' },
            { text: `Fecha: ${fechaParaPDF}`, style: 'subheader', alignment: 'right' },
            { text: `Hora: ${horaParaPDF}`, style: 'subheader', alignment: 'right' },
            { text: 'Factura', style: 'invoiceTitle', margin: [0, 20, 0, 10] },
            {
                style: 'itemsTable',
                table: {
                    widths: ['*', 'auto', 'auto', 'auto'],
                    body: [
                        [{ text: 'Item', style: 'itemsTableHeader' }, { text: 'Precio', style: 'itemsTableHeader' }, { text: 'Cantidad', style: 'itemsTableHeader' }, { text: 'Total', style: 'itemsTableHeader' }],
                        ...cart.map(item => ([item.name, `$${item.price.toFixed(2)}`, item.quantity, `$${(item.price * item.quantity).toFixed(2)}`]))
                    ]
                },
                layout: 'lightHorizontalLines'
            },
            {
                columns: [
                    { text: '' },
                    { text: `Total: $${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}`, style: 'total', alignment: 'right' }
                ],
                margin: [0, 20, 0, 0]
            },
            { 
                text: 'Gracias por su compra',
                style: 'thankYou',
                alignment: 'center',
                margin: [0, 20, 0, 0]
            }
        ],
        styles: {
            header: {
                fontSize: 22,
                bold: true
            },
            subheader: {
                fontSize: 10,
                margin: [0, 2, 0, 0]
            },
            invoiceTitle: {
                fontSize: 18,
                bold: true,
                decoration: 'underline',
                color: '#4caf50'
            },
            itemsTable: {
                margin: [0, 5, 0, 15]
            },
            itemsTableHeader: {
                bold: true,
                fontSize: 12,
                color: 'black'
            },
            total: {
                bold: true,
                fontSize: 12
            },
            thankYou: {
                bold: true,
                fontSize: 14,
                color: '#4caf50'
            }
        },
        defaultStyle: {
            columnGap: 20
        }
    };

    var fileName = `Factura(Fecha${fechaParaArchivo})(Hora${horaParaArchivo}).pdf`;
    pdfMake.createPdf(docDefinition).download(fileName);
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
