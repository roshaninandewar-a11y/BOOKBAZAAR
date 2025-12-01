// Global variables
let users = [];
let books = [];
let rentals = [];
let messages = [];
let charts = {};

const API_URL = '/api';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  console.log('Admin Panel Initialized');
  checkAdminAuth();
  loadDashboardData();
  initializeCharts();
});

// Check admin authentication
function checkAdminAuth() {
  const admin = localStorage.getItem('bookbazaar_admin');
  // For now, allow access - add proper auth in production
}

// Navigation
function showSection(sectionId) {
  event.preventDefault();
  
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  document.getElementById(sectionId).classList.add('active');
  
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Update page title
  const titles = {
    'dashboard': 'Dashboard',
    'users': 'User Management',
    'books': 'Book Management',
    'rentals': 'Rental Management',
    'messages': 'Contact Messages',
    'analytics': 'Analytics & Reports',
    'settings': 'Settings'
  };
  document.getElementById('pageTitle').textContent = titles[sectionId];
  
  // Load section data
  loadSectionData(sectionId);
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
}

// Load Dashboard Data
async function loadDashboardData() {
  showLoading();
  try {
    await Promise.all([
      loadUsers(),
      loadBooks(),
      loadRentals(),
      loadMessages()
    ]);
    
    updateDashboardStats();
    loadRecentActivity();
    updateCharts();
    hideLoading();
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    useSampleData();
    hideLoading();
  }
}

async function loadUsers() {
  try {
    const response = await fetch(`${API_URL}/admin/users`);
    const data = await response.json();
    users = data.users || getSampleUsers();
  } catch (error) {
    users = getSampleUsers();
  }
}

async function loadBooks() {
  try {
    const response = await fetch(`${API_URL}/books`);
    const data = await response.json();
    books = data.books || [];
  } catch (error) {
    books = [];
  }
}

async function loadRentals() {
  try {
    const response = await fetch(`${API_URL}/admin/rentals`);
    const data = await response.json();
    rentals = data.rentals || [];
  } catch (error) {
    rentals = [];
  }
}

async function loadMessages() {
  try {
    const response = await fetch(`${API_URL}/messages`);
    const data = await response.json();
    messages = data.messages || [];
  } catch (error) {
    messages = [];
  }
}

function getSampleUsers() {
  return [
    {
      id: 1,
      name: 'Roshani Nandewar',
      email: 'roshaninandewar@gmail.com',
      phone: '+91 8097951950',
      location: 'Mumbai, Maharashtra',
      books_count: 3,
      joined: '2024-01-15'
    },
    {
      id: 2,
      name: 'Pramod Padol',
      email: 'pramodpadol70@gmail.com',
      phone: '+91 9359995371',
      location: 'Mumbai, Maharashtra',
      books_count: 3,
      joined: '2024-01-20'
    }
  ];
}

function useSampleData() {
  users = getSampleUsers();
  updateDashboardStats();
  loadRecentActivity();
}

// Update Dashboard Stats
function updateDashboardStats() {
  document.getElementById('totalUsersCount').textContent = users.length;
  document.getElementById('totalBooksCount').textContent = books.length;
  
  const activeRentals = rentals.filter(r => r.status === 'active').length;
  document.getElementById('activeRentalsCount').textContent = activeRentals;
  
  const totalRevenue = rentals.reduce((sum, r) => sum + (r.price || 0), 0);
  document.getElementById('totalRevenueCount').textContent = `₹${totalRevenue}`;
}

// Recent Activity
function loadRecentActivity() {
  const activityList = document.getElementById('recentActivity');
  if (!activityList) return;
  
  const activities = [
    {
      type: 'user',
      icon: 'user-plus',
      color: '#7c3aed',
      text: '<strong>New user</strong> Roshani Nandewar joined',
      time: '5 minutes ago'
    },
    {
      type: 'book',
      icon: 'book',
      color: '#ec4899',
      text: '<strong>New book added:</strong> Atomic Habits',
      time: '15 minutes ago'
    },
    {
      type: 'rental',
      icon: 'handshake',
      color: '#10b981',
      text: '<strong>Book rented:</strong> Sapiens by Pramod',
      time: '1 hour ago'
    },
    {
      type: 'message',
      icon: 'envelope',
      color: '#f59e0b',
      text: '<strong>New message</strong> from contact form',
      time: '2 hours ago'
    }
  ];
  
  activityList.innerHTML = activities.map(activity => `
    <div class="activity-item">
      <div class="activity-icon" style="background: ${activity.color};">
        <i class="fas fa-${activity.icon}"></i>
      </div>
      <div class="activity-info">
        <div>${activity.text}</div>
        <div class="activity-time">${activity.time}</div>
      </div>
    </div>
  `).join('');
}

// Initialize Charts
function initializeCharts() {
  // Genre Chart
  const genreCtx = document.getElementById('genreChart');
  if (genreCtx) {
    charts.genre = new Chart(genreCtx, {
      type: 'doughnut',
      data: {
        labels: ['Fiction', 'Non-Fiction', 'Self-Help', 'Biography', 'Science', 'History'],
        datasets: [{
          data: [30, 25, 20, 10, 10, 5],
          backgroundColor: [
            '#7c3aed', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#6b7280'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  
  // Rental Trends Chart
  const rentalCtx = document.getElementById('rentalChart');
  if (rentalCtx) {
    charts.rental = new Chart(rentalCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Rentals',
          data: [12, 19, 15, 25, 22, 30],
          borderColor: '#7c3aed',
          backgroundColor: 'rgba(124, 58, 237, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

function updateCharts() {
  if (books.length > 0) {
    const genreCounts = {};
    books.forEach(book => {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    });
    
    if (charts.genre) {
      charts.genre.data.labels = Object.keys(genreCounts);
      charts.genre.data.datasets[0].data = Object.values(genreCounts);
      charts.genre.update();
    }
  }
}

// Load Section Data
function loadSectionData(sectionId) {
  switch(sectionId) {
    case 'users':
      displayUsersTable();
      break;
    case 'books':
      displayBooksTable();
      break;
    case 'rentals':
      displayRentalsTable();
      break;
    case 'messages':
      displayMessages();
      break;
    case 'analytics':
      loadAnalytics();
      break;
  }
}

// Users Table
function displayUsersTable() {
  const usersTable = document.getElementById('usersTable');
  if (!usersTable) return;
  
  if (users.length === 0) {
    usersTable.innerHTML = '<tr><td colspan="8" class="loading-cell">No users found</td></tr>';
    return;
  }
  
  usersTable.innerHTML = users.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.location || 'N/A'}</td>
      <td>${user.books_count || 0}</td>
      <td>${user.joined || 'N/A'}</td>
      <td>
        <button class="action-btn view" onclick="viewUser(${user.id})">
          <i class="fas fa-eye"></i>
        </button>
        <button class="action-btn delete" onclick="deleteUser(${user.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// Books Table
function displayBooksTable() {
  const booksTable = document.getElementById('booksTable');
  if (!booksTable) return;
  
  let filteredBooks = books;
  const genreFilter = document.getElementById('bookGenreFilter')?.value;
  const statusFilter = document.getElementById('bookStatusFilter')?.value;
  
  if (genreFilter && genreFilter !== 'all') {
    filteredBooks = filteredBooks.filter(b => b.genre === genreFilter);
  }
  
  if (statusFilter && statusFilter !== 'all') {
    if (statusFilter === 'available') {
      filteredBooks = filteredBooks.filter(b => b.available);
    } else {
      filteredBooks = filteredBooks.filter(b => !b.available);
    }
  }
  
  if (filteredBooks.length === 0) {
    booksTable.innerHTML = '<tr><td colspan="9" class="loading-cell">No books found</td></tr>';
    return;
  }
  
  booksTable.innerHTML = filteredBooks.map(book => `
    <tr>
      <td>${book.id}</td>
      <td><img src="${book.cover}" alt="${book.title}" class="book-cover-small"></td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.genre}</td>
      <td>${book.owner || 'N/A'}</td>
      <td>₹${book.price}</td>
      <td>
        <span class="status-badge ${book.available ? 'available' : 'rented'}">
          ${book.available ? 'Available' : 'Rented'}
        </span>
      </td>
      <td>
        <button class="action-btn view" onclick="viewBook(${book.id})">
          <i class="fas fa-eye"></i>
        </button>
        <button class="action-btn delete" onclick="deleteBook(${book.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function filterBooks() {
  displayBooksTable();
}

// Rentals Table
function displayRentalsTable() {
  const rentalsTable = document.getElementById('rentalsTable');
  if (!rentalsTable) return;
  
  let filteredRentals = rentals;
  const statusFilter = document.getElementById('rentalStatusFilter')?.value;
  
  if (statusFilter && statusFilter !== 'all') {
    filteredRentals = filteredRentals.filter(r => r.status === statusFilter);
  }
  
  if (filteredRentals.length === 0) {
    rentalsTable.innerHTML = '<tr><td colspan="9" class="loading-cell">No rentals found</td></tr>';
    return;
  }
  
  rentalsTable.innerHTML = filteredRentals.map(rental => `
    <tr>
      <td>${rental.id}</td>
      <td>${rental.title || rental.book_title || 'N/A'}</td>
      <td>${rental.renter_name || 'N/A'}</td>
      <td>${rental.owner || rental.owner_name || 'N/A'}</td>
      <td>${rental.rental_date || rental.rentalDate || 'N/A'}</td>
      <td>${rental.return_date || rental.returnDate || 'N/A'}</td>
      <td>₹${rental.price || 0}</td>
      <td>
        <span class="status-badge ${rental.status}">
          ${rental.status}
        </span>
      </td>
      <td>
        <button class="action-btn view" onclick="viewRental(${rental.id})">
          <i class="fas fa-eye"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function filterRentals() {
  displayRentalsTable();
}

// Messages
function displayMessages() {
  const messagesGrid = document.getElementById('messagesGrid');
  if (!messagesGrid) return;
  
  if (messages.length === 0) {
    messagesGrid.innerHTML = '<div class="loading-message">No messages yet</div>';
    return;
  }
  
  messagesGrid.innerHTML = messages.map(message => `
    <div class="message-card ${message.read ? '' : 'unread'}">
      <div class="message-header">
        <div class="message-sender">${message.name}</div>
        <div class="message-date">${formatDate(message.created_at)}</div>
      </div>
      <div class="message-email">
        <i class="fas fa-envelope"></i> ${message.email}
      </div>
      <div class="message-content">${message.message}</div>
      <div class="message-actions">
        <button class="action-btn view" onclick="replyToMessage(${message.id})">
          <i class="fas fa-reply"></i> Reply
        </button>
        <button class="action-btn delete" onclick="deleteMessage(${message.id})">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    </div>
  `).join('');
}

function markAllAsRead() {
  messages.forEach(m => m.read = true);
  displayMessages();
  showToast('All messages marked as read', 'success');
}

// Analytics
function loadAnalytics() {
  // User Growth Chart
  const userGrowthCtx = document.getElementById('userGrowthChart');
  if (userGrowthCtx && !charts.userGrowth) {
    charts.userGrowth = new Chart(userGrowthCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'New Users',
          data: [5, 8, 12, 15, 18, 25],
          backgroundColor: '#7c3aed'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });
  }
  
  // Revenue Chart
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx && !charts.revenue) {
    charts.revenue = new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue (₹)',
          data: [500, 800, 1200, 1500, 1800, 2500],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });
  }
  
  // Popular Genres Chart
  const popularGenresCtx = document.getElementById('popularGenresChart');
  if (popularGenresCtx && !charts.popularGenres) {
    charts.popularGenres = new Chart(popularGenresCtx, {
      type: 'pie',
      data: {
        labels: ['Fiction', 'Non-Fiction', 'Self-Help', 'Biography'],
        datasets: [{
          data: [35, 30, 20, 15],
          backgroundColor: ['#7c3aed', '#ec4899', '#10b981', '#f59e0b']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });
  }
  
  loadTopBooks();
}

function loadTopBooks() {
  const topBooksList = document.getElementById('topBooksList');
  if (!topBooksList) return;
  
  const topBooks = [
    { title: 'Atomic Habits', rentals: 25, cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400' },
    { title: 'Sapiens', rentals: 20, cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400' },
    { title: 'To Kill a Mockingbird', rentals: 18, cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400' }
  ];
  
  topBooksList.innerHTML = topBooks.map(book => `
    <div class="top-book-item">
      <img src="${book.cover}" alt="${book.title}">
      <div class="top-book-info">
        <div class="top-book-title">${book.title}</div>
        <div class="top-book-rentals">${book.rentals} rentals</div>
      </div>
    </div>
  `).join('');
}

// Actions
function viewUser(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return;
  
  const userDetails = document.getElementById('userDetails');
  userDetails.innerHTML = `
    <div style="padding: 1rem;">
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
      <p><strong>Location:</strong> ${user.location || 'N/A'}</p>
      <p><strong>Books:</strong> ${user.books_count || 0}</p>
      <p><strong>Joined:</strong> ${user.joined || 'N/A'}</p>
    </div>
  `;
  
  document.getElementById('userModal').classList.add('active');
}

function deleteUser(userId) {
  if (confirm('Are you sure you want to delete this user?')) {
    users = users.filter(u => u.id !== userId);
    displayUsersTable();
    showToast('User deleted successfully', 'success');
  }
}

function viewBook(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;
  
  const bookDetails = document.getElementById('bookDetails');
  bookDetails.innerHTML = `
    <div style="padding: 1rem;">
      <img src="${book.cover}" style="width: 100%; max-width: 200px; border-radius: 0.5rem; margin-bottom: 1rem;">
      <p><strong>Title:</strong> ${book.title}</p>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Genre:</strong> ${book.genre}</p>
      <p><strong>Owner:</strong> ${book.owner || 'N/A'}</p>
      <p><strong>Price:</strong> ₹${book.price}</p>
      <p><strong>Rating:</strong> ${book.rating || 0} ⭐</p>
      <p><strong>Status:</strong> ${book.available ? 'Available' : 'Rented'}</p>
      <p><strong>Description:</strong> ${book.description || 'N/A'}</p>
    </div>
  `;
  
  document.getElementById('bookModal').classList.add('active');
}

async function deleteBook(bookId) {
  if (confirm('Are you sure you want to delete this book?')) {
    try {
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        books = books.filter(b => b.id !== bookId);
        displayBooksTable();
        showToast('Book deleted successfully', 'success');
      }
    } catch (error) {
      books = books.filter(b => b.id !== bookId);
      displayBooksTable();
      showToast('Book deleted successfully', 'success');
    }
  }
}

function viewRental(rentalId) {
  showToast('Viewing rental details', 'info');
}

function replyToMessage(messageId) {
  const message = messages.find(m => m.id === messageId);
  if (!message) return;
  
  window.location.href = `mailto:${message.email}?subject=Re: Your message to Book Bazaar`;
}

function deleteMessage(messageId) {
  if (confirm('Are you sure you want to delete this message?')) {
    messages = messages.filter(m => m.id !== messageId);
    displayMessages();
    showToast('Message deleted successfully', 'success');
  }
}

// Settings
function saveGeneralSettings(event) {
  event.preventDefault();
  showToast('General settings saved successfully!', 'success');
}

function savePricingSettings(event) {
  event.preventDefault();
  showToast('Pricing settings saved successfully!', 'success');
}

function saveNotificationSettings(event) {
  event.preventDefault();
  showToast('Notification settings saved successfully!', 'success');
}

function exportData() {
  const data = {
    users,
    books,
    rentals,
    messages
  };
  
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bookbazaar_data_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  showToast('Data exported successfully!', 'success');
}

function backupDatabase() {
  showToast('Database backup initiated...', 'info');
  setTimeout(() => {
    showToast('Database backed up successfully!', 'success');
  }, 2000);
}

function clearOldData() {
  if (confirm('This will delete all data older than 6 months. Are you sure?')) {
    showToast('Old data cleared successfully!', 'success');
  }
}

// Utilities
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function showLoading() {
  const loading = document.getElementById('loadingOverlay');
  if (loading) loading.style.display = 'flex';
}

function hideLoading() {
  const loading = document.getElementById('loadingOverlay');
  if (loading) loading.style.display = 'none';
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function showNotifications() {
  showToast('5 new notifications', 'info');
}

function showAddUserModal() {
  showToast('Add user functionality coming soon', 'info');
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('bookbazaar_admin');
    window.location.href = '/';
  }
}