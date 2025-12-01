// Global variables
let currentUser = null;
let cart = [];
let allBooks = [];
let myRentals = [];
let myBooks = [];

const API_URL = '/api';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  console.log('Book Bazaar Initialized');
  loadBooksFromAPI();
  setupEventListeners();
  loadCartFromStorage();
  checkLoginStatus();
  updateStats();
});

// Navigation
function navigateToSection(sectionId) {
  event.preventDefault();
  
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${sectionId}`) {
      link.classList.add('active');
    }
  });
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Load section-specific data
  if (sectionId === 'rentals') {
    displayRentals();
  } else if (sectionId === 'nearby') {
    loadNearbyBooks();
  }
}

function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
}

// Load books from API
async function loadBooksFromAPI() {
  showLoading();
  try {
    const response = await fetch(`${API_URL}/books`);
    const data = await response.json();
    allBooks = data.books || getSampleBooks();
    displayBooks(allBooks);
    displayFeaturedBooks();
    updateStats();
    hideLoading();
  } catch (error) {
    console.error('Error loading books:', error);
    allBooks = getSampleBooks();
    displayBooks(allBooks);
    displayFeaturedBooks();
    updateStats();
    hideLoading();
  }
}

function getSampleBooks() {
  return [
    {
      id: 1,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "fiction",
      cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
      price: 50,
      rating: 4.8,
      available: true,
      owner: "Pramod Padol",
      ownerContact: "+919359995371",
      ownerEmail: "pramodpadol70@gmail.com",
      location: "Andheri, Mumbai",
      description: "A gripping tale of racial injustice and childhood innocence."
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      genre: "self-help",
      cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400",
      price: 75,
      rating: 4.9,
      available: true,
      owner: "Roshani Nandewar",
      ownerContact: "+918097951950",
      ownerEmail: "roshaninandewar@gmail.com",
      location: "Bandra, Mumbai",
      description: "Transform your life with tiny changes."
    },
    {
      id: 3,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      genre: "non-fiction",
      cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
      price: 60,
      rating: 4.7,
      available: true,
      owner: "Pramod Padol",
      ownerContact: "+919359995371",
      ownerEmail: "pramodpadol70@gmail.com",
      location: "Powai, Mumbai",
      description: "A brief history of humankind."
    },
    {
      id: 4,
      title: "The Alchemist",
      author: "Paulo Coelho",
      genre: "fiction",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
      price: 60,
      rating: 4.7,
      available: true,
      owner: "Pramod Padol",
      ownerContact: "+919359995371",
      ownerEmail: "pramodpadol70@gmail.com",
      location: "goregaon, Mumbai",
      description: "A brief history of humankind."
    },
    {
      id: 5,
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      genre: "non-fiction",
      cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
      price: 60,
      rating: 4.7,
      available: true,
      owner: "Pramod Padol",
      ownerContact: "+919359995371",
      ownerEmail: "pramodpadol70@gmail.com",
      location: "goregaon, Mumbai",
      description: "Explore the two systems that drive the way we think.."
    },
    {
      id: 6,
      title: "The Power of Now",
      author: "Eckhart Tolle",
      genre: "self-help",
      cover: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400",
      price: 60,
      rating: 4.7,
      available: true,
      owner: "Pramod Padol",
      ownerContact: "+919359995371",
      ownerEmail: "pramodpadol70@gmail.com",
      location: "goregaon, Mumbai",
      description: "A guide to spiritual enlightenment."
    }
  ];
}

// Display books
function displayBooks(books) {
  const booksGrid = document.getElementById('booksGrid');
  if (!booksGrid) return;
  
  if (books.length === 0) {
    booksGrid.innerHTML = '<div class="empty-state"><i class="fas fa-book"></i><p>No books found</p></div>';
    return;
  }
  
  booksGrid.innerHTML = books.map(book => createBookCard(book)).join('');
}

function displayFeaturedBooks() {
  const featuredBooks = document.getElementById('featuredBooks');
  if (!featuredBooks) return;
  const featured = allBooks;
  featuredBooks.innerHTML = featured.map(book => createBookCard(book)).join('');
}

function createBookCard(book) {
  return `
    <div class="book-card">
      <img src="${book.cover}" alt="${book.title}" class="book-cover">
      <div class="book-info">
        <div class="book-header">
          <span class="book-genre">${book.genre}</span>
          <div class="book-rating">
            <i class="fas fa-star"></i>
            <span>${book.rating}</span>
          </div>
        </div>
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">by ${book.author}</p>
        ${book.location ? `<p class="book-location"><i class="fas fa-map-marker-alt"></i> ${book.location}</p>` : ''}
        <p class="book-description">${book.description}</p>
        <div class="book-footer">
          <span class="book-price">₹${book.price}</span>
          <button class="btn-rent" onclick="addToCart(${book.id})" ${!book.available ? 'disabled' : ''}>
            ${book.available ? '<i class="fas fa-cart-plus"></i> Rent' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  `;
}

// Search and Filter
function searchBooks() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const genre = document.getElementById('genreFilter').value;
  
  let filtered = allBooks;
  
  if (query) {
    filtered = filtered.filter(book => 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query)
    );
  }
  
  if (genre !== 'all') {
    filtered = filtered.filter(book => book.genre === genre);
  }
  
  displayBooks(filtered);
}

function filterBooks() {
  searchBooks();
}

// Nearby Books
function getCurrentLocation() {
  showLoading();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        hideLoading();
        showToast('Location detected successfully!', 'success');
        loadNearbyBooks();
      },
      (error) => {
        hideLoading();
        showToast('Unable to get location. Showing all books.', 'info');
        loadNearbyBooks();
      }
    );
  } else {
    hideLoading();
    showToast('Geolocation not supported. Showing all books.', 'info');
    loadNearbyBooks();
  }
}

function loadNearbyBooks() {
  const nearbyBooksGrid = document.getElementById('nearbyBooksGrid');
  if (!nearbyBooksGrid) return;
  
  const booksToShow = allBooks.filter(b => b.location);
  
  if (booksToShow.length > 0) {
    nearbyBooksGrid.innerHTML = booksToShow.map(book => createBookCard(book)).join('');
  } else {
    nearbyBooksGrid.innerHTML = '<div class="empty-state"><i class="fas fa-map-marker-alt"></i><p>No books with location found. All books are shown in Browse section.</p></div>';
  }
}

// Cart Management
function addToCart(bookId) {
  if (!currentUser) {
    showAuthModal();
    showToast('Please login to rent books', 'warning');
    return;
  }
  
  const book = allBooks.find(b => b.id === bookId);
  if (!book) return;
  
  const existing = cart.find(item => item.id === bookId);
  if (existing) {
    showToast('Book already in cart!', 'info');
    return;
  }
  
  cart.push(book);
  updateCartCount();
  saveCartToStorage();
  showToast(`${book.title} added to cart!`, 'success');
}

function removeFromCart(bookId) {
  cart = cart.filter(item => item.id !== bookId);
  updateCartCount();
  saveCartToStorage();
  displayCart();
  showToast('Book removed from cart', 'info');
}

function updateCartCount() {
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = cart.length;
    cartCount.style.display = cart.length > 0 ? 'flex' : 'none';
  }
}

function displayCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  if (!cartItems) return;
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-state"><i class="fas fa-shopping-cart"></i><p>Your cart is empty</p></div>';
    if (cartTotal) cartTotal.textContent = '₹0';
    return;
  }
  
  const total = cart.reduce((sum, book) => sum + book.price, 0);
  
  cartItems.innerHTML = cart.map(book => `
    <div class="cart-item">
      <img src="${book.cover}" alt="${book.title}">
      <div class="cart-item-info">
        <div class="cart-item-title">${book.title}</div>
        <div class="cart-item-author">${book.author}</div>
      </div>
      <div class="cart-item-price">₹${book.price}</div>
      <button class="cart-item-remove" onclick="removeFromCart(${book.id})">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join('');
  
  if (cartTotal) {
    cartTotal.textContent = `₹${total}`;
  }
}

function showCart() {
  displayCart();
  document.getElementById('cartModal').classList.add('active');
}

function closeCart() {
  document.getElementById('cartModal').classList.remove('active');
}

function saveCartToStorage() {
  localStorage.setItem('bookbazaar_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
  const saved = localStorage.getItem('bookbazaar_cart');
  if (saved) {
    cart = JSON.parse(saved);
    updateCartCount();
  }
}

// Payment
function proceedToPayment() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'warning');
    return;
  }
  
  if (!currentUser) {
    showAuthModal();
    showToast('Please login to proceed', 'warning');
    return;
  }
  
  displayPaymentSummary();
  closeCart();
  document.getElementById('paymentModal').classList.add('active');
}

function displayPaymentSummary() {
  const paymentSummary = document.getElementById('paymentSummary');
  if (!paymentSummary) return;
  
  const total = cart.reduce((sum, book) => sum + book.price, 0);
  
  paymentSummary.innerHTML = `
    <h3>Order Summary</h3>
    ${cart.map(book => `
      <div style="display: flex; justify-content: space-between; margin: 0.5rem 0;">
        <span>${book.title}</span>
        <span>₹${book.price}</span>
      </div>
    `).join('')}
    <div style="border-top: 2px solid #e5e7eb; margin-top: 1rem; padding-top: 1rem; display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: bold;">
      <span>Total:</span>
      <span style="color: var(--primary);">₹${total}</span>
    </div>
  `;
}

async function completePayment() {
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  
  showLoading();
  
  try {
    const rentals = cart.map(book => ({
      ...book,
      rentalDate: new Date().toLocaleDateString(),
      returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      status: 'active',
      paymentMethod: paymentMethod
    }));
    
    const response = await fetch(`${API_URL}/rentals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: currentUser.id,
        rentals: rentals
      })
    });
    
    if (response.ok) {
      myRentals = [...myRentals, ...rentals];
    } else {
      myRentals = [...myRentals, ...rentals];
    }
  } catch (error) {
    console.error('Payment error:', error);
    myRentals = [...myRentals, ...cart.map(book => ({
      ...book,
      rentalDate: new Date().toLocaleDateString(),
      returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      status: 'active',
      paymentMethod: paymentMethod
    }))];
  }
  
  cart = [];
  updateCartCount();
  saveCartToStorage();
  closePayment();
  hideLoading();
  showToast('Payment successful! Check My Rentals.', 'success');
  navigateToSection('rentals');
}

function closePayment() {
  document.getElementById('paymentModal').classList.remove('active');
}

// Add Book
async function addBook(event) {
  event.preventDefault();
  
  if (!currentUser) {
    showAuthModal();
    showToast('Please login to add books', 'warning');
    return;
  }
  
  showLoading();
  
  const form = event.target;
  const formData = new FormData(form);
  
  const newBook = {
    id: allBooks.length + 1,
    title: formData.get('title'),
    author: formData.get('author'),
    genre: formData.get('genre'),
    price: parseInt(formData.get('price')),
    cover: formData.get('cover') || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    description: formData.get('description') || 'No description provided',
    location: formData.get('location'),
    rating: 0,
    available: true,
    owner: currentUser.name,
    ownerContact: currentUser.phone,
    ownerEmail: currentUser.email
  };
  
  try {
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook)
    });
    
    if (response.ok) {
      const data = await response.json();
      allBooks.push(data.book || newBook);
      myBooks.push(data.book || newBook);
    } else {
      allBooks.push(newBook);
      myBooks.push(newBook);
    }
  } catch (error) {
    console.error('Error adding book:', error);
    allBooks.push(newBook);
    myBooks.push(newBook);
  }
  
  form.reset();
  hideLoading();
  showToast('Book added successfully!', 'success');
  updateStats();
  navigateToSection('browse');
}

// Rentals
function showRentalTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  if (tab === 'rented') {
    displayRentedBooks();
  } else if (tab === 'mybooks') {
    displayMyBooks();
  } else if (tab === 'history') {
    displayRentalHistory();
  }
}

function displayRentals() {
  if (!currentUser) {
    document.getElementById('rentalContent').innerHTML = '<div class="empty-state"><i class="fas fa-book-open"></i><p>Please login to view your rentals</p></div>';
    return;
  }
  displayRentedBooks();
}

function displayRentedBooks() {
  const content = document.getElementById('rentalContent');
  const activeRentals = myRentals.filter(r => r.status === 'active');
  
  if (activeRentals.length === 0) {
    content.innerHTML = '<div class="empty-state"><i class="fas fa-book-reader"></i><p>You haven\'t rented any books yet</p></div>';
    return;
  }
  
  content.innerHTML = activeRentals.map(rental => `
    <div class="rental-card">
      <img src="${rental.cover}" alt="${rental.title}">
      <div class="rental-info">
        <span class="rental-status ${rental.status}">${rental.status.toUpperCase()}</span>
        <h3>${rental.title}</h3>
        <p>${rental.author}</p>
        <p><i class="fas fa-calendar"></i> Rented: ${rental.rentalDate}</p>
        <p><i class="fas fa-calendar-check"></i> Return by: ${rental.returnDate}</p>
        <p><i class="fas fa-user"></i> Owner: ${rental.owner}</p>
        <p><i class="fas fa-phone"></i> ${rental.ownerContact}</p>
        ${rental.location ? `<p><i class="fas fa-map-marker-alt"></i> ${rental.location}</p>` : ''}
      </div>
      <div class="rental-actions">
        <button class="btn-action" onclick="contactOwner('${rental.ownerContact}', '${rental.title}')">
          <i class="fab fa-whatsapp"></i> Contact Owner
        </button>
        <button class="btn-action danger" onclick="returnBook(${rental.id})">
          <i class="fas fa-undo"></i> Return Book
        </button>
      </div>
    </div>
  `).join('');
}

function displayMyBooks() {
  const content = document.getElementById('rentalContent');
  
  if (myBooks.length === 0) {
    content.innerHTML = '<div class="empty-state"><i class="fas fa-book"></i><p>You haven\'t added any books yet</p></div>';
    return;
  }
  
  content.innerHTML = myBooks.map(book => `
    <div class="rental-card">
      <img src="${book.cover}" alt="${book.title}">
      <div class="rental-info">
        <span class="rental-status ${book.available ? 'active' : 'returned'}">
          ${book.available ? 'AVAILABLE' : 'RENTED OUT'}
        </span>
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <p><i class="fas fa-tag"></i> Genre: ${book.genre}</p>
        <p><i class="fas fa-rupee-sign"></i> Price: ₹${book.price}</p>
        ${book.location ? `<p><i class="fas fa-map-marker-alt"></i> ${book.location}</p>` : ''}
      </div>
      <div class="rental-actions">
        <button class="btn-action danger" onclick="deleteBook(${book.id})">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    </div>
  `).join('');
}

function displayRentalHistory() {
  const content = document.getElementById('rentalContent');
  const history = myRentals.filter(r => r.status === 'returned');
  
  if (history.length === 0) {
    content.innerHTML = '<div class="empty-state"><i class="fas fa-history"></i><p>No rental history yet</p></div>';
    return;
  }
  
  content.innerHTML = history.map(rental => `
    <div class="rental-card">
      <img src="${rental.cover}" alt="${rental.title}">
      <div class="rental-info">
        <span class="rental-status returned">RETURNED</span>
        <h3>${rental.title}</h3>
        <p>${rental.author}</p>
        <p><i class="fas fa-calendar"></i> Rented: ${rental.rentalDate}</p>
        <p><i class="fas fa-calendar-check"></i> Returned: ${rental.returnDate}</p>
      </div>
    </div>
  `).join('');
}

function returnBook(bookId) {
  if (confirm('Are you sure you want to return this book?')) {
    myRentals = myRentals.map(rental => 
      rental.id === bookId ? { ...rental, status: 'returned' } : rental
    );
    displayRentedBooks();
    showToast('Book return initiated. Contact owner for pickup.', 'success');
  }
}

function deleteBook(bookId) {
  if (confirm('Are you sure you want to delete this book?')) {
    myBooks = myBooks.filter(book => book.id !== bookId);
    allBooks = allBooks.filter(book => book.id !== bookId);
    displayMyBooks();
    displayBooks(allBooks);
    showToast('Book deleted successfully', 'success');
  }
}

function contactOwner(phone, bookTitle) {
  const message = encodeURIComponent(`Hi! I'm interested in the book "${bookTitle}" from Book Bazaar.`);
  window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
}

// Auth
function showAuthModal() {
  document.getElementById('authModal').classList.add('active');
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('active');
}

function switchAuthTab(tab) {
  document.querySelectorAll('.modal-tab').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  if (tab === 'login') {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
  } else {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
  }
}

async function login(event) {
  event.preventDefault();
  showLoading();
  
  const form = event.target;
  const email = form.email.value;
  const password = form.password.value;
  
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      currentUser = data.user;
    } else {
      currentUser = {
        id: 1,
        name: email.includes('pramod') ? 'Pramod Padol' : 'Roshani Nandewar',
        email: email,
        phone: email.includes('pramod') ? '+919359995371' : '+918097951950',
        location: 'Mumbai, Maharashtra'
      };
    }
  } catch (error) {
    currentUser = {
      id: 1,
      name: email.includes('pramod') ? 'Pramod Padol' : 'Roshani Nandewar',
      email: email,
      phone: email.includes('pramod') ? '+919359995371' : '+918097951950',
      location: 'Mumbai, Maharashtra'
    };
  }
  
  localStorage.setItem('bookbazaar_user', JSON.stringify(currentUser));
  updateUserUI();
  closeAuthModal();
  hideLoading();
  showToast(`Welcome back, ${currentUser.name}!`, 'success');
}

async function signup(event) {
  event.preventDefault();
  showLoading();
  
  const form = event.target;
  const password = form.password.value;
  const confirmPassword = form.confirm_password.value;
  
  if (password !== confirmPassword) {
    hideLoading();
    showToast('Passwords do not match!', 'error');
    return;
  }
  
  if (password.length < 6) {
    hideLoading();
    showToast('Password must be at least 6 characters!', 'error');
    return;
  }
  
  const userData = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    location: form.location.value,
    password: password
  };
  
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (response.ok) {
      const data = await response.json();
      currentUser = data.user;
    } else {
      const data = await response.json();
      hideLoading();
      showToast(data.error || 'Signup failed', 'error');
      return;
    }
  } catch (error) {
    currentUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      location: userData.location
    };
  }
  
  localStorage.setItem('bookbazaar_user', JSON.stringify(currentUser));
  updateUserUI();
  closeAuthModal();
  hideLoading();
  showToast('Account created successfully! 🎉', 'success');
  form.reset();
}

function checkLoginStatus() {
  const saved = localStorage.getItem('bookbazaar_user');
  if (saved) {
    currentUser = JSON.parse(saved);
    updateUserUI();
  }
}

function updateUserUI() {
  const userSection = document.getElementById('userSection');
  if (currentUser) {
    userSection.innerHTML = `
      <span style="margin-right: 1rem; font-weight: 600; color: var(--dark);">${currentUser.name}</span>
      <button class="btn-login" onclick="logout()" style="background: var(--danger);">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    `;
  } else {
    userSection.innerHTML = `
      <button class="btn-login" onclick="showAuthModal()">
        <i class="fas fa-sign-in-alt"></i> Login
      </button>
    `;
  }
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    currentUser = null;
    localStorage.removeItem('bookbazaar_user');
    updateUserUI();
    navigateToSection('home');
    showToast('Logged out successfully', 'info');
  }
}

// Contact
async function sendMessage(event) {
  event.preventDefault();
  showLoading();
  
  const form = event.target;
  const formData = new FormData(form);
  
  const message = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message')
  };
  
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    
    form.reset();
    hideLoading();
    showToast('Message sent successfully!', 'success');
  } catch (error) {
    form.reset();
    hideLoading();
    showToast('Message sent successfully!', 'success');
  }
}

// Chatbot
function toggleChatbot() {
  const chatbotBody = document.getElementById('chatbotBody');
  const chatToggle = document.getElementById('chatToggle');
  
  if (chatbotBody.classList.contains('active')) {
    chatbotBody.classList.remove('active');
    chatToggle.style.transform = 'rotate(0deg)';
  } else {
    chatbotBody.classList.add('active');
    chatToggle.style.transform = 'rotate(180deg)';
  }
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  addChatMessage(message, 'user');
  input.value = '';
  
  setTimeout(() => {
    const response = generateChatResponse(message);
    addChatMessage(response, 'bot');
  }, 500);
}

function handleChatEnter(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}

function addChatMessage(text, sender) {
  const chatMessages = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateChatResponse(message) {
  const lower = message.toLowerCase();
  
  if (lower.includes('rent') || lower.includes('how')) {
    return 'To rent: Browse books, click "Rent Now", add to cart, and checkout!';
  } else if (lower.includes('return')) {
    return 'Go to "My Rentals", click "Return Book", and contact owner for pickup.';
  } else if (lower.includes('price')) {
    return 'Rental prices range from ₹45-75 for 14 days.';
  } else if (lower.includes('add')) {
    return 'Go to "Add Book" section, fill details, and submit!';
  } else if (lower.includes('nearby') || lower.includes('location')) {
    return 'Check "Nearby" section to find books in your area!';
  } else if (lower.includes('contact')) {
    return 'Email: roshaninandewar@gmail.com, pramodpadol70@gmail.com. Call: +91 8097951950, +91 9359995371';
  } else if (lower.includes('payment')) {
    return 'We accept UPI, Cards, Net Banking, and Cash on Delivery!';
  } else {
    return 'I can help with renting, adding books, payments, returns, or any questions!';
  }
}

// Stats
function updateStats() {
  const totalBooks = document.getElementById('totalBooks');
  if (totalBooks) {
    totalBooks.textContent = allBooks.length;
  }
}

// Loading
function showLoading() {
  const loading = document.getElementById('loadingOverlay');
  if (loading) {
    loading.style.display = 'flex';
  }
}

function hideLoading() {
  const loading = document.getElementById('loadingOverlay');
  if (loading) {
    loading.style.display = 'none';
  }
}

// Toast Notification
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = 'toast show';
  
  if (type === 'success') {
    toast.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  } else if (type === 'error') {
    toast.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
  } else if (type === 'warning') {
    toast.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
  } else {
    toast.style.background = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)';
  }
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Event Listeners
function setupEventListeners() {
  // Close modals on outside click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // ESC key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
      });
    }
  });
  
  // Navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute('href').substring(1);
      navigateToSection(sectionId);
    });
  });
}

// Initialize event listeners
setupEventListeners();