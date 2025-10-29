// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('loginForm')) {
        initializeLogin();
    }
    
    if (document.getElementById('signupLink')) {
        document.getElementById('signupLink').addEventListener('click', showSignup);
    }
});

function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Simulate login
        if (loginUser(email, password)) {
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });
}

function loginUser(email, password) {
    // Simulate user authentication
    // In a real app, this would make an API call
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => (u.email === email || u.phone === email) && u.password === password);
    
    if (user) {
        // Store current user
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
        }));
        return true;
    }
    
    // Demo login for testing
    if (email === 'demo@shop.com' && password === 'demo123') {
        localStorage.setItem('currentUser', JSON.stringify({
            id: 'demo',
            name: 'Demo User',
            email: 'demo@shop.com'
        }));
        return true;
    }
    
    return false;
}

function showSignup(e) {
    e.preventDefault();
    
    // Create signup form
    const authContainer = document.querySelector('.auth-container');
    authContainer.innerHTML = `
        <div class="auth-header">
            <h1>ShopEasy</h1>
            <p>Create your account to start selling.</p>
        </div>
        
        <form class="auth-form" id="signupForm">
            <div class="form-group">
                <label for="fullName">Full Name</label>
                <input type="text" id="fullName" placeholder="Enter your full name" required>
            </div>
            
            <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" placeholder="Enter phone number" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Enter email address" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <div class="password-input">
                    <input type="password" id="password" placeholder="Create password" required>
                    <button type="button" class="toggle-password">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            
            <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" placeholder="Confirm password" required>
            </div>
            
            <button type="submit" class="auth-btn">Sign Up</button>
        </form>
        
        <div class="auth-footer">
            <p>Already have an account? <a href="login.html">Login</a></p>
        </div>
    `;
    
    // Initialize signup form
    initializeSignup();
}

function initializeSignup() {
    const signupForm = document.getElementById('signupForm');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Handle signup form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Validate password strength
        if (password.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: fullName,
            phone: phone,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };

        // Store user
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login
        localStorage.setItem('currentUser', JSON.stringify({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }));

        // Redirect to home
        window.location.href = 'index.html';
    });
}