const API_URL = 'https://ujoniobvifxkbhhfopwu.supabase.co/rest/v1/order';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqb25pb2J2aWZ4a2JoaGZvcHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4ODU2NDEsImV4cCI6MjA1NTQ2MTY0MX0.aWD395KJsOXsEZKoV-xWx512ypVkSMkMPhFVOa7IYhc';

// Reservation API configuration
const RESERVATION_API_URL = 'https://ujoniobvifxkbhhfopwu.supabase.co/rest/v1/reservations';
const RESERVATION_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqb25pb2J2aWZ4a2JoaGZvcHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4ODU2NDEsImV4cCI6MjA1NTQ2MTY0MX0.aWD395KJsOXsEZKoV-xWx512ypVkSMkMPhFVOa7IYhc';

// Global reservation data cache
let reservationData = {
    all: [],
    upcoming: [],
    completed: [],
    lastUpdated: null
};

// Fetch order data
async function fetchOrders() {
    try {
        // Fetch pending orders
        const pendingResponse = await fetch(`${API_URL}?apikey=${API_KEY}&order=create_at.asc&order_status=eq.0`);
        const pendingOrders = await pendingResponse.json();
        
        // Fetch completed orders
        const completedResponse = await fetch(`${API_URL}?apikey=${API_KEY}&order=create_at.asc&order_status=eq.1`);
        const completedOrders = await completedResponse.json();
        
        displayOrders(pendingOrders, completedOrders);
    } catch (error) {
        console.error('Failed to fetch orders:', error);
    }
}

// Display orders
function displayOrders(pendingOrders, completedOrders) {
    const pendingContainer = document.getElementById('pending-orders-container');
    const completedContainer = document.getElementById('completed-orders-container');
    
    pendingContainer.innerHTML = '';
    completedContainer.innerHTML = '';

    // Display pending orders
    pendingOrders.forEach(order => {
        const orderCard = createOrderCard(order, true);
        pendingContainer.appendChild(orderCard);
    });

    // Display completed orders
    completedOrders.forEach(order => {
        const orderCard = createOrderCard(order, false);
        completedContainer.appendChild(orderCard);
    });
}

// Create order card
function createOrderCard(order, isPending) {
    const card = document.createElement('div');
    card.className = 'card order-card mb-3';

    const header = document.createElement('div');
    header.className = 'order-header';
    header.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <h6 class="mb-0">Order #${order.order_id}</h6>
            <span class="status-badge ${isPending ? 'status-pending' : 'status-completed'}">
                ${isPending ? 'Pending' : 'Completed'}
            </span>
        </div>
    `;

    const body = document.createElement('div');
    body.className = 'order-body';
    
    // Create order details
    const orderDetails = document.createElement('div');
    orderDetails.className = 'order-details';
    
    // Add product information
    const items = [
        { name: 'Salty Popcorn', quantity: order.salty_popcorn || 0 },
        { name: 'Sweet Popcorn', quantity: order.sweet_popcorn || 0 },
        { name: 'Still Water', quantity: order.still_water || 0 },
        { name: 'Sparkling Water', quantity: order.sparkling_water || 0 },
        { name: 'Coca Cola', quantity: order.coca_cola || 0 },
        { name: 'Fanta', quantity: order.fanta || 0 },
        { name: 'Salty Chips', quantity: order.salty_chips || 0 },
        { name: 'Paprika Chips', quantity: order.paprika_chips || 0 },
        { name: 'M&M', quantity: order.mms || 0 }
    ];

    // Filter out items with quantity 0 and sort by quantity (highest first)
    const orderedItems = items
        .filter(item => item.quantity > 0)
        .sort((a, b) => b.quantity - a.quantity);

    if (orderedItems.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'text-muted';
        emptyMessage.textContent = 'No items in this order';
        orderDetails.appendChild(emptyMessage);
    } else {
        orderedItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <span>${item.name}</span>
                <span>${item.quantity} pcs</span>
            `;
            orderDetails.appendChild(itemElement);
        });
    }

    // Add order time and room information
    const orderInfo = document.createElement('div');
    orderInfo.className = 'order-info mt-3';
    
    try {
        const orderDate = new Date(order.create_at);
        orderInfo.innerHTML = `
            <div class="order-item">
                <span>Room Number</span>
                <span>${order.room_id || 'N/A'}</span>
            </div>
            <div class="order-item">
                <span>Order Time</span>
                <span>${orderDate.toLocaleString()}</span>
            </div>
            <div class="order-item">
                <span>Customer ID</span>
                <span class="text-truncate" style="max-width: 200px;">${order.customer_id || 'N/A'}</span>
            </div>
        `;
    } catch (error) {
        console.error('Error formatting order date:', error);
        orderInfo.innerHTML = `
            <div class="order-item">
                <span>Room Number</span>
                <span>${order.room_id || 'N/A'}</span>
            </div>
            <div class="order-item">
                <span>Order Time</span>
                <span>Invalid Date</span>
            </div>
        `;
    }

    body.appendChild(orderDetails);
    body.appendChild(orderInfo);

    // Add action buttons only for pending orders
    if (isPending) {
        const actions = document.createElement('div');
        actions.className = 'order-actions';
        actions.innerHTML = `
            <button class="btn btn-success btn-sm" onclick="completeOrder(${order.order_id})">Complete Order</button>
        `;
        body.appendChild(actions);
    }

    card.appendChild(header);
    card.appendChild(body);

    return card;
}

// Complete order
async function completeOrder(orderId) {
    try {
        const response = await fetch(`${API_URL}?order_id=eq.${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'apikey': API_KEY,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ order_status: 1 })
        });

        if (response.ok) {
            fetchOrders(); // Refresh order list
        }
    } catch (error) {
        console.error('Failed to update order status:', error);
    }
}

// Fetch and cache reservation data
async function fetchReservations() {
    try {
        showLoadingState();
        
        const response = await fetch(`${RESERVATION_API_URL}?apikey=${RESERVATION_API_KEY}`);
        const reservations = await response.json();
        
        // Sort reservations by start time
        reservations.sort((a, b) => new Date(a.res_start) - new Date(b.res_start));
        
        // Update cache
        const now = new Date();
        reservationData = {
            all: reservations,
            upcoming: reservations.filter(res => new Date(res.res_start) > now && !res.checked),
            completed: reservations.filter(res => res.checked || new Date(res.res_end) < now),
            lastUpdated: now
        };
        
        // Update UI
        updateReservationUI();
    } catch (error) {
        console.error('Failed to fetch reservations:', error);
        showErrorState();
    }
}

// Show loading state
function showLoadingState() {
    const containers = [
        'upcoming-reservations-container',
        'completed-reservations-container'
    ];
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="text-center p-3">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">Loading data...</p>
                </div>
            `;
        }
    });
}

// Show error state
function showErrorState() {
    const containers = [
        'upcoming-reservations-container',
        'completed-reservations-container'
    ];
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="text-center text-danger p-3">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <p class="mt-2">Failed to load data. Please try again.</p>
                    <button class="btn btn-outline-primary btn-sm mt-2" onclick="fetchReservations()">
                        Retry
                    </button>
                </div>
            `;
        }
    });
}

// Update all reservation-related UI components
function updateReservationUI() {
    updateReservationList();
}

// Update reservation list view
function updateReservationList() {
    const upcomingContainer = document.getElementById('upcoming-reservations-container');
    const completedContainer = document.getElementById('completed-reservations-container');
    
    if (!upcomingContainer || !completedContainer) return;
    
    // Clear containers
    upcomingContainer.innerHTML = '';
    completedContainer.innerHTML = '';
    
    // Show empty state if no reservations
    if (reservationData.upcoming.length === 0) {
        upcomingContainer.innerHTML = `
            <div class="text-center p-3 text-muted">
                <i class="bi bi-calendar-x"></i>
                <p class="mt-2">No upcoming reservations</p>
            </div>
        `;
    }
    
    if (reservationData.completed.length === 0) {
        completedContainer.innerHTML = `
            <div class="text-center p-3 text-muted">
                <i class="bi bi-calendar-check"></i>
                <p class="mt-2">No completed reservations</p>
            </div>
        `;
    }
    
    // Display reservations
    reservationData.upcoming.forEach(reservation => {
        upcomingContainer.appendChild(createReservationCard(reservation, true));
    });
    
    reservationData.completed.forEach(reservation => {
        completedContainer.appendChild(createReservationCard(reservation, false));
    });
}

// Create reservation card with improved layout
function createReservationCard(reservation, isUpcoming) {
    const card = document.createElement('div');
    card.className = 'card reservation-card mb-3';
    
    const startDate = new Date(reservation.res_start);
    const endDate = new Date(reservation.res_end);
    
    card.innerHTML = `
        <div class="card-header d-flex justify-content-between align-items-center">
            <div>
                <h6 class="mb-0">Reservation #${reservation.id}</h6>
                <small class="text-muted">${startDate.toLocaleDateString()}</small>
            </div>
            <span class="badge ${isUpcoming ? 'bg-primary' : 'bg-success'}">
                ${isUpcoming ? 'Upcoming' : 'Completed'}
            </span>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <h6 class="text-muted mb-2">Movie Details</h6>
                        <p class="mb-1"><strong>${reservation.movie_name}</strong></p>
                        <p class="mb-0 text-muted">${reservation.duration} hours</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <h6 class="text-muted mb-2">Room & Time</h6>
                        <p class="mb-1">Room ${reservation.room_id}</p>
                        <p class="mb-0">${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
                <div>
                    <span class="text-muted">Total Price:</span>
                    <span class="h5 mb-0 ms-2">$${reservation.price}</span>
                </div>
                ${isUpcoming ? `
                    <button class="btn btn-success btn-sm" onclick="completeReservation(${reservation.id})">
                        <i class="bi bi-check-circle"></i> Complete
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Complete reservation with improved error handling
async function completeReservation(reservationId) {
    try {
        const response = await fetch(`${RESERVATION_API_URL}?id=eq.${reservationId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'apikey': RESERVATION_API_KEY,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ checked: true })
        });

        if (response.ok) {
            // Update local cache
            const reservation = reservationData.all.find(r => r.id === reservationId);
            if (reservation) {
                reservation.checked = true;
            }
            
            // Refresh UI
            updateReservationUI();
            
            // Show success message
            showToast('Reservation completed successfully!', 'success');
        } else {
            throw new Error('Failed to update reservation');
        }
    } catch (error) {
        console.error('Failed to update reservation status:', error);
        showToast('Failed to complete reservation. Please try again.', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    document.body.appendChild(toastContainer);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toastContainer.remove();
    });
}

// Handle navigation between sections
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Initialize data
    fetchOrders();
    fetchReservations();

    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    console.log('Found navigation links:', navLinks.length);
    
    // Add click event listeners to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Navigation link clicked:', this.getAttribute('href'));
            e.preventDefault();
            
            // Hide all sections
            const sections = document.querySelectorAll('.section');
            console.log('Found sections:', sections.length);
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show the selected section
            const targetId = this.getAttribute('href').substring(1);
            console.log('Target section ID:', targetId);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                console.log('Found target section');
                targetSection.style.display = 'block';
                
                // Refresh data based on selected section
                switch(targetId) {
                    case 'reservation-management':
                        fetchReservations();
                        break;
                    case 'order-management':
                        fetchOrders();
                        break;
                }
            } else {
                console.log('Target section not found');
            }
            
            // Update active state of nav links
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Show initial section
    const initialSection = document.getElementById('order-management');
    if (initialSection) {
        console.log('Showing initial section');
        initialSection.style.display = 'block';
        // Show the first tab by default
        const firstOrderTab = document.getElementById('pending-tab');
        if (firstOrderTab) {
            new bootstrap.Tab(firstOrderTab).show();
        }
    }
}); 