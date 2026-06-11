// Aktuelles Produktsortiment (Preise und Specials)
const products = [
    { id: 1, name: "Deutschlandburger (WM-Specials)", price: 6.49, category: "wm", icon: "🍔", desc: "Das exklusive Highlight zur Heim-WM mit Spezial-Sauce!" },
    { id: 2, name: "Big Mac®", price: 4.99, category: "burger", icon: "🍔", desc: "Der unschlagbare Klassiker mit zwei Etagen Rindfleisch." },
    { id: 3, name: "Big Tasty® Bacon", price: 6.79, category: "burger", icon: "🥓", desc: "Herzhaftes Rindfleisch mit unverwechselbarer Grill-Sauce." },
    { id: 4, name: "Double Cheeseburger", price: 3.49, category: "burger", icon: "🧀", desc: "Doppelt Fleisch, doppelt Cheddar-Käse, maximaler Geschmack." },
    { id: 5, name: "9 Chicken McNuggets®", price: 4.99, category: "snacks", icon: "🍗", desc: "Knusprige, goldbraune Nuggets inklusive 2 Saucen nach Wahl." },
    { id: 6, name: "Pommes Frites (Groß)", price: 2.69, category: "snacks", icon: "🍟", desc: "Außen knackig, innen soft. Original McFritten." },
    { id: 7, name: "Happy Meal® (FIFA Squishmallows)", price: 4.89, category: "kids", icon: "🎁", desc: "Inklusive 1 von 12 limitierten FIFA Squishmallows!" },
    { id: 8, name: "McFlurry® Original Mix & Match", price: 3.89, category: "snacks", icon: "🍦", desc: "Cremiges Eis mit deinen Lieblings-Toppings gemischt." }
];

// Speicher für den aktuellen Warenkorb
let cart = [];

// Funktion 1: Produkte im Shop-Grid generieren
function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    
    items.forEach(product => {
        grid.innerHTML += `
            <div class="product-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between">
                <div class="p-6 text-center bg-gradient-to-br from-yellow-50 to-white relative">
                    <span class="text-6xl my-4 block transform transition-transform hover:rotate-12">${product.icon}</span>
                    <span class="absolute top-2 right-2 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full capitalize">${product.category}</span>
                </div>
                <div class="p-5 flex-grow flex flex-col justify-between">
                    <div>
                        <h4 class="font-bold text-lg text-gray-900 mb-1">${product.name}</h4>
                        <p class="text-gray-500 text-xs line-clamp-2 mb-4">${product.desc}</p>
                    </div>
                    <div class="flex justify-between items-center pt-2 border-t border-gray-50">
                        <span class="font-black text-xl text-gray-900">${product.price.toFixed(2).replace('.', ',')} €</span>
                        <button onclick="addToCart(${product.id})" class="bg-mcd-gold hover:bg-yellow-500 text-mcd-dark font-bold p-2.5 rounded-xl transition flex items-center space-x-1 shadow-sm">
                            <i class="fa-solid fa-plus text-sm"></i>
                            <span class="text-xs">Hinzufügen</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Funktion 2: Kategorie-Filterung steuern
function filterCategory(category) {
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// Funktion 3: Artikel zum Warenkorb hinzufügen + Animation zünden
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    
    // Badge Pop-Animation auslösen
    const badge = document.getElementById('cart-badge');
    badge.classList.add('badge-pop');
    setTimeout(() => badge.classList.remove('badge-pop'), 300);
}

// Funktion 4: Warenkorb-Oberfläche und Summen aktualisieren
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyText = document.getElementById('empty-cart-text');
    const badge = document.getElementById('cart-badge');
    const totalContainer = document.getElementById('cart-total');

    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.appendChild(emptyText);
        badge.classList.add('hidden');
        totalContainer.innerText = "0,00 €";
        return;
    }

    // Badge-Zähler (oben rechts) aktualisieren
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.innerText = totalItems;
    badge.classList.remove('hidden');

    // Berechnen & Artikel-HTML rendern
    let totalPrice = 0;
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        cartItemsContainer.innerHTML += `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div class="flex items-center space-x-3">
                    <span class="text-2xl">${item.icon}</span>
                    <div>
                        <h5 class="font-bold text-sm text-gray-800">${item.name}</h5>
                        <p class="text-xs text-gray-500">${item.price.toFixed(2).replace('.', ',')} €</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="changeQuantity(${item.id}, -1)" class="w-6 h-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded flex items-center justify-center font-bold text-sm">-</button>
                    <span class="text-sm font-bold w-4 text-center">${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)" class="w-6 h-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded flex items-center justify-center font-bold text-sm">+</button>
                </div>
            </div>
        `;
    });

    totalContainer.innerText = totalPrice.toFixed(2).replace('.', ',') + " €";
}

// Funktion 5: Stückzahlen im Warenkorb anpassen
function changeQuantity(id, change) {
    const item = cart.find(p => p.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }
    updateCartUI();
}

// Funktion 6: Sidebar ein- und ausfahren
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    
    sidebar.classList.toggle('translate-x-full');
    overlay.classList.toggle('hidden');
}

// Funktion 7: Kauf simulieren
function checkout() {
    if (cart.length === 0) {
        alert("Dein Warenkorb ist leer! Wähle zuerst ein Produkt aus. 🍔");
        return;
    }
    
    alert("🎉 Kauf erfolgreich simuliert!\nVielen Dank für deine Bestellung beim virtuellen McDonald's Kiosk.");
    cart = [];
    updateCartUI();
    toggleCart();
}

// Beim allerersten Start Produkte laden
renderProducts(products);
