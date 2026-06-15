// Toggle Notifications Dropdown
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.toggle('active');
}

// Toggle Profile Dropdown
function toggleProfile() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('active');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const notificationContainer = document.querySelector('.notification-container');
    const profileContainer = document.querySelector('.profile-container');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const profileDropdown = document.getElementById('profileDropdown');

    if (notificationContainer && !notificationContainer.contains(event.target)) {
        notificationDropdown.classList.remove('active');
    }

    if (profileContainer && !profileContainer.contains(event.target)) {
        profileDropdown.classList.remove('active');
    }
});

// Notification Bell Click Handler
document.getElementById('notificationBell').addEventListener('click', function(e) {
    e.stopPropagation();
    toggleNotifications();
});

// Profile Button Click Handler
document.getElementById('profileBtn').addEventListener('click', function(e) {
    e.stopPropagation();
});

// Animate progress circle on page load
window.addEventListener('load', function() {
    animateProgressCircle();
    animateProgressBars();
});

// Animate the progress circle
function animateProgressCircle() {
    const circle = document.querySelector('.progress-circle');
    if (circle) {
        // The circle will animate via CSS transition when data changes
        // You can update the stroke-dashoffset to change the progress
        circle.style.strokeDashoffset = '141.37'; // 75% progress
    }
}

// Animate mini progress bars
function animateProgressBars() {
    const bars = document.querySelectorAll('.mini-progress-bar');
    bars.forEach((bar, index) => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.transition = 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            bar.style.width = width;
        }, index * 150);
    });
}

// Tutorial card click handlers
document.querySelectorAll('.tutorial-card').forEach(card => {
    card.addEventListener('click', function() {
        const title = this.querySelector('.tutorial-info h3').textContent;
        console.log('Playing tutorial: ' + title);
        // You can add modal or video player functionality here
        alert('Playing: ' + title);
    });
});

// Join button handlers
document.querySelectorAll('.join-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const className = this.parentElement.querySelector('.upcoming-details h3').textContent;
        console.log('Joining: ' + className);
        alert('Joining: ' + className);
        // You can add video call or meeting link functionality here
    });
});

// Message item click handlers
document.querySelectorAll('.message-item').forEach(item => {
    item.addEventListener('click', function() {
        const sender = this.querySelector('.message-sender').textContent;
        console.log('Opening conversation with: ' + sender);
        // You can add chat interface functionality here
    });
});

// Active nav link based on scroll position
window.addEventListener('scroll', function() {
    // You can add active nav highlighting based on scroll position
});

// Update notification badge count
function updateNotificationBadge(count) {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = count;
        if (count === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'flex';
        }
    }
}

// Mark notification as read
document.querySelectorAll('.notification-item').forEach(item => {
    item.addEventListener('click', function() {
        this.classList.remove('unread');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add ripple effect to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        // Optional: Add ripple animation
    });
});

// Responsive menu toggle for mobile
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Example: Update study progress programmatically
function updateStudyProgress(percentage) {
    const circumference = 2 * Math.PI * 90; // radius is 90
    const offset = circumference - (percentage / 100) * circumference;
    
    const circle = document.querySelector('.progress-circle');
    if (circle) {
        circle.style.strokeDashoffset = offset;
    }

    const percentText = document.querySelector('.progress-text');
    if (percentText) {
        percentText.textContent = percentage + '%';
    }
}

// Example: Update individual subject progress
function updateSubjectProgress(subjectIndex, percentage) {
    const progressItems = document.querySelectorAll('.progress-item');
    if (progressItems[subjectIndex]) {
        const bar = progressItems[subjectIndex].querySelector('.mini-progress-bar');
        const percentSpan = progressItems[subjectIndex].querySelector('.progress-percent');
        
        if (bar) {
            bar.style.width = percentage + '%';
        }
        if (percentSpan) {
            percentSpan.textContent = percentage + '%';
        }
    }
}

// Example: Add new message
function addNewMessage(senderName, senderImage, messageText, isUnread = false) {
    const messagesList = document.querySelector('.messages-list');
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item' + (isUnread ? ' unread' : '');
    
    const now = new Date();
    const timeText = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
    
    messageItem.innerHTML = `
        <img src="${senderImage}" alt="${senderName}" class="message-avatar">
        <div class="message-content">
            <div class="message-top">
                <p class="message-sender">${senderName}</p>
                <span class="message-time">just now</span>
            </div>
            <p class="message-text">${messageText}</p>
        </div>
        ${isUnread ? '<span class="unread-indicator"></span>' : ''}
    `;
    
    messagesList.insertBefore(messageItem, messagesList.firstChild);
}

// Example: Add new notification
function addNewNotification(title, message, icon = 'fas fa-bell', isUrgent = false) {
    const notificationsList = document.querySelector('.notifications-list');
    const notificationItem = document.createElement('div');
    notificationItem.className = 'notification-item' + (isUrgent ? ' unread' : '');
    
    notificationItem.innerHTML = `
        <i class="${icon}"></i>
        <div class="notification-content">
            <p class="notification-title">${title}</p>
            <p class="notification-time">just now</p>
        </div>
    `;
    
    notificationsList.insertBefore(notificationItem, notificationsList.firstChild);
    
    // Update badge count
    const badge = document.querySelector('.notification-badge');
    let count = parseInt(badge.textContent) || 0;
    badge.textContent = count + 1;
}

// Example usage in console:
// updateStudyProgress(85);
// updateSubjectProgress(0, 90);
// addNewMessage('John Smith', 'https://via.placeholder.com/45', 'Did you submit the assignment?', true);
// addNewNotification('New Assignment', 'Math homework posted', 'fas fa-assignment', true);
