<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard - Book Bazaar</title>
  <link rel="stylesheet" href="/static/admin.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
</head>
<body>
  <!-- Toast Notification -->
  <div class="toast" id="toast"></div>

  <!-- Loading Overlay -->
  <div class="loading-overlay" id="loadingOverlay">
    <div class="spinner"></div>
  </div>

  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <i class="fas fa-book"></i>
      <h2>Book Bazaar</h2>
    </div>
    
    <nav class="sidebar-nav">
      <a href="#dashboard" class="nav-item active" onclick="showSection('dashboard')">
        <i class="fas fa-chart-line"></i>
        <span>Dashboard</span>
      </a>
      <a href="#users" class="nav-item" onclick="showSection('users')">
        <i class="fas fa-users"></i>
        <span>Users</span>
      </a>
      <a href="#books" class="nav-item" onclick="showSection('books')">
        <i class="fas fa-book"></i>
        <span>Books</span>
      </a>
      <a href="#rentals" class="nav-item" onclick="showSection('rentals')">
        <i class="fas fa-handshake"></i>
        <span>Rentals</span>
      </a>
      <a href="#messages" class="nav-item" onclick="showSection('messages')">
        <i class="fas fa-envelope"></i>
        <span>Messages</span>
      </a>
      <a href="#analytics" class="nav-item" onclick="showSection('analytics')">
        <i class="fas fa-chart-bar"></i>
        <span>Analytics</span>
      </a>
      <a href="#settings" class="nav-item" onclick="showSection('settings')">
        <i class="fas fa-cog"></i>
        <span>Settings</span>
      </a>
    </nav>

    <div class="sidebar-footer">
      <button class="btn-logout" onclick="logout()">
        <i class="fas fa-sign-out-alt"></i>
        Logout
      </button>
    </div>
  </aside>

  <!-- Main Content -->
  <div class="main-content">
    <!-- Top Bar -->
    <header class="topbar">
      <button class="mobile-menu-btn" onclick="toggleSidebar()">
        <i class="fas fa-bars"></i>
      </button>
      
      <h1 id="pageTitle">Dashboard</h1>
      
      <div class="topbar-actions">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search..." id="globalSearch">
        </div>
        
        <button class="notification-btn" onclick="showNotifications()">
          <i class="fas fa-bell"></i>
          <span class="badge">5</span>
        </button>
        
        <div class="user-profile">
          <img src="https://ui-avatars.com/api/?name=Admin&background=7c3aed&color=fff" alt="Admin">
          <span>Admin</span>
        </div>
      </div>
    </header>

    <!-- Dashboard Section -->
    <section class="content-section active" id="dashboard">
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon purple">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-info">
            <h3 id="totalUsersCount">0</h3>
            <p>Total Users</p>
            <span class="stat-change positive"><i class="fas fa-arrow-up"></i> 12% from last month</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon pink">
            <i class="fas fa-book"></i>
          </div>
          <div class="stat-info">
            <h3 id="totalBooksCount">0</h3>
            <p>Total Books</p>
            <span class="stat-change positive"><i class="fas fa-arrow-up"></i> 8% from last month</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon green">
            <i class="fas fa-handshake"></i>
          </div>
          <div class="stat-info">
            <h3 id="activeRentalsCount">0</h3>
            <p>Active Rentals</p>
            <span class="stat-change positive"><i class="fas fa-arrow-up"></i> 15% from last month</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon orange">
            <i class="fas fa-rupee-sign"></i>
          </div>
          <div class="stat-info">
            <h3 id="totalRevenueCount">₹0</h3>
            <p>Total Revenue</p>
            <span class="stat-change positive"><i class="fas fa-arrow-up"></i> 20% from last month</span>
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <h3><i class="fas fa-pie-chart"></i> Books by Genre</h3>
          <canvas id="genreChart"></canvas>
        </div>
        
        <div class="chart-card">
          <h3><i class="fas fa-chart-line"></i> Rental Trends</h3>
          <canvas id="rentalChart"></canvas>
        </div>
      </div>

      <div class="recent-activity">
        <h3><i class="fas fa-history"></i> Recent Activity</h3>
        <div class="activity-list" id="recentActivity"></div>
      </div>
    </section>

    <!-- Users Section -->
    <section class="content-section" id="users">
      <div class="section-header">
        <h2><i class="fas fa-users"></i> User Management</h2>
        <button class="btn-primary" onclick="showAddUserModal()">
          <i class="fas fa-user-plus"></i> Add User
        </button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Books</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="usersTable">
            <tr>
              <td colspan="8" class="loading-cell">Loading users...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Books Section -->
    <section class="content-section" id="books">
      <div class="section-header">
        <h2><i class="fas fa-book"></i> Book Management</h2>
        <div class="filter-group">
          <select id="bookGenreFilter" onchange="filterBooks()">
            <option value="all">All Genres</option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-Fiction</option>
            <option value="self-help">Self-Help</option>
            <option value="biography">Biography</option>
            <option value="science">Science</option>
            <option value="history">History</option>
          </select>
          <select id="bookStatusFilter" onchange="filterBooks()">
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cover</th>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Owner</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="booksTable">
            <tr>
              <td colspan="9" class="loading-cell">Loading books...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Rentals Section -->
    <section class="content-section" id="rentals">
      <div class="section-header">
        <h2><i class="fas fa-handshake"></i> Rental Management</h2>
        <select id="rentalStatusFilter" onchange="filterRentals()">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="returned">Returned</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Book</th>
              <th>Renter</th>
              <th>Owner</th>
              <th>Rental Date</th>
              <th>Return Date</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="rentalsTable">
            <tr>
              <td colspan="9" class="loading-cell">Loading rentals...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Messages Section -->
    <section class="content-section" id="messages">
      <div class="section-header">
        <h2><i class="fas fa-envelope"></i> Contact Messages</h2>
        <button class="btn-secondary" onclick="markAllAsRead()">
          <i class="fas fa-check-double"></i> Mark All as Read
        </button>
      </div>

      <div class="messages-grid" id="messagesGrid">
        <div class="loading-message">Loading messages...</div>
      </div>
    </section>

    <!-- Analytics Section -->
    <section class="content-section" id="analytics">
      <h2><i class="fas fa-chart-bar"></i> Analytics & Reports</h2>
      
      <div class="analytics-cards">
        <div class="analytics-card">
          <h3><i class="fas fa-users"></i> User Growth</h3>
          <canvas id="userGrowthChart"></canvas>
        </div>
        
        <div class="analytics-card">
          <h3><i class="fas fa-rupee-sign"></i> Revenue Overview</h3>
          <canvas id="revenueChart"></canvas>
        </div>
        
        <div class="analytics-card">
          <h3><i class="fas fa-chart-pie"></i> Popular Genres</h3>
          <canvas id="popularGenresChart"></canvas>
        </div>
        
        <div class="analytics-card">
          <h3><i class="fas fa-trophy"></i> Top Books</h3>
          <div class="top-books-list" id="topBooksList"></div>
        </div>
      </div>
    </section>

    <!-- Settings Section -->
    <section class="content-section" id="settings">
      <h2><i class="fas fa-cog"></i> Settings</h2>
      
      <div class="settings-grid">
        <div class="settings-card">
          <h3><i class="fas fa-cog"></i> General Settings</h3>
          <form class="settings-form" onsubmit="saveGeneralSettings(event)">
            <div class="form-group">
              <label>Site Name</label>
              <input type="text" value="Book Bazaar" name="site_name">
            </div>
            <div class="form-group">
              <label>Contact Email</label>
              <input type="email" value="roshaninandewar@gmail.com" name="contact_email">
            </div>
            <div class="form-group">
              <label>Contact Phone</label>
              <input type="tel" value="+91 8097951950" name="contact_phone">
            </div>
            <button type="submit" class="btn-primary">
              <i class="fas fa-save"></i> Save Changes
            </button>
          </form>
        </div>

        <div class="settings-card">
          <h3><i class="fas fa-rupee-sign"></i> Pricing Settings</h3>
          <form class="settings-form" onsubmit="savePricingSettings(event)">
            <div class="form-group">
              <label>Default Rental Period (days)</label>
              <input type="number" value="14" name="rental_period">
            </div>
            <div class="form-group">
              <label>Late Fee per Day (₹)</label>
              <input type="number" value="10" name="late_fee">
            </div>
            <div class="form-group">
              <label>Platform Commission (%)</label>
              <input type="number" value="10" name="commission">
            </div>
            <button type="submit" class="btn-primary">
              <i class="fas fa-save"></i> Save Changes
            </button>
          </form>
        </div>

        <div class="settings-card">
          <h3><i class="fas fa-bell"></i> Notification Settings</h3>
          <form class="settings-form" onsubmit="saveNotificationSettings(event)">
            <div class="toggle-group">
              <label>Email Notifications</label>
              <input type="checkbox" checked name="email_notifications">
            </div>
            <div class="toggle-group">
              <label>SMS Notifications</label>
              <input type="checkbox" name="sms_notifications">
            </div>
            <div class="toggle-group">
              <label>Rental Reminders</label>
              <input type="checkbox" checked name="rental_reminders">
            </div>
            <button type="submit" class="btn-primary">
              <i class="fas fa-save"></i> Save Changes
            </button>
          </form>
        </div>

        <div class="settings-card">
          <h3><i class="fas fa-database"></i> Data Management</h3>
          <div class="data-actions">
            <button class="btn-secondary" onclick="exportData()">
              <i class="fas fa-download"></i> Export All Data
            </button>
            <button class="btn-secondary" onclick="backupDatabase()">
              <i class="fas fa-database"></i> Backup Database
            </button>
            <button class="btn-danger" onclick="clearOldData()">
              <i class="fas fa-trash"></i> Clear Old Data
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- User Details Modal -->
  <div class="modal" id="userModal">
    <div class="modal-content">
      <button class="modal-close" onclick="closeModal('userModal')">
        <i class="fas fa-times"></i>
      </button>
      <h2><i class="fas fa-user"></i> User Details</h2>
      <div id="userDetails"></div>
    </div>
  </div>

  <!-- Book Details Modal -->
  <div class="modal" id="bookModal">
    <div class="modal-content">
      <button class="modal-close" onclick="closeModal('bookModal')">
        <i class="fas fa-times"></i>
      </button>
      <h2><i class="fas fa-book"></i> Book Details</h2>
      <div id="bookDetails"></div>
    </div>
  </div>

  <script src="/static/admin.js"></script>
</body>
</html>