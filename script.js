// DOM Elements
const form = document.getElementById('survey-form');
const submitButton = document.getElementById('submit');

// Form validation and enhancement
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
});

function initializeForm() {
    // Add form submission handler
    form.addEventListener('submit', handleFormSubmit);
    
    // Add real-time validation
    addRealTimeValidation();
    
    // Add interactive enhancements
    addInteractiveEnhancements();
    
    // Focus first input
    document.getElementById('name').focus();
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
        showSuccessMessage();
        // In a real application, you would send the data to a server
        console.log('Form data:', getFormData());
    }
}

function validateForm() {
    let isValid = true;
    const requiredFields = ['name', 'email', 'dropdown'];
    
    // Clear previous errors
    clearErrors();
    
    // Validate required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const inputGroup = field.closest('.input-group');
        
        if (!field.value.trim()) {
            showError(inputGroup, `${getFieldLabel(fieldId)} is required`);
            isValid = false;
        }
    });
    
    // Validate email format
    const email = document.getElementById('email');
    if (email.value && !isValidEmail(email.value)) {
        showError(email.closest('.input-group'), 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate number range
    const number = document.getElementById('number');
    if (number.value && (number.value < 0 || number.value > 50)) {
        showError(number.closest('.input-group'), 'Years of experience must be between 0 and 50');
        isValid = false;
    }
    
    return isValid;
}

function addRealTimeValidation() {
    // Email validation
    const email = document.getElementById('email');
    email.addEventListener('blur', function() {
        const inputGroup = this.closest('.input-group');
        clearFieldError(inputGroup);
        
        if (this.value && !isValidEmail(this.value)) {
            showError(inputGroup, 'Please enter a valid email address');
        }
    });
    
    // Number validation
    const number = document.getElementById('number');
    number.addEventListener('input', function() {
        const inputGroup = this.closest('.input-group');
        clearFieldError(inputGroup);
        
        if (this.value && (this.value < 0 || this.value > 50)) {
            showError(inputGroup, 'Years of experience must be between 0 and 50');
        }
    });
    
    // Required field validation
    const requiredFields = ['name', 'email', 'dropdown'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('blur', function() {
            const inputGroup = this.closest('.input-group');
            clearFieldError(inputGroup);
            
            if (!this.value.trim()) {
                showError(inputGroup, `${getFieldLabel(fieldId)} is required`);
            }
        });
    });
}

function addInteractiveEnhancements() {
    // Add smooth scrolling for form sections
    const legends = document.querySelectorAll('legend');
    legends.forEach(legend => {
        legend.style.cursor = 'pointer';
        legend.addEventListener('click', function() {
            this.parentElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        });
    });
    
    // Add progress indicator
    addProgressIndicator();
    
    // Add character counter for textarea
    addCharacterCounter();
}

function addProgressIndicator() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
        </div>
        <span class="progress-text" id="progress-text">0% Complete</span>
    `;
    
    // Add CSS for progress bar
    const style = document.createElement('style');
    style.textContent = `
        .progress-container {
            margin-bottom: 20px;
            text-align: center;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 8px;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(45deg, #667eea, #764ba2);
            width: 0%;
            transition: width 0.3s ease;
        }
        .progress-text {
            font-size: 0.9rem;
            color: #6c757d;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
    
    form.insertBefore(progressContainer, form.firstChild);
    
    // Update progress on input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('change', updateProgress);
    });
}

function addCharacterCounter() {
    const textarea = document.getElementById('comments');
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.textContent = '0 characters';
    
    const style = document.createElement('style');
    style.textContent = `
        .character-counter {
            text-align: right;
            font-size: 0.8rem;
            color: #6c757d;
            margin-top: 5px;
        }
    `;
    document.head.appendChild(style);
    
    textarea.parentElement.appendChild(counter);
    
    textarea.addEventListener('input', function() {
        const count = this.value.length;
        counter.textContent = `${count} character${count !== 1 ? 's' : ''}`;
    });
}

function updateProgress() {
    const inputs = form.querySelectorAll('input[required], select[required]');
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    const radios = form.querySelectorAll('input[type="radio"]:checked');
    
    let completed = 0;
    let total = inputs.length + 2; // +2 for checkbox and radio groups
    
    // Count completed required fields
    inputs.forEach(input => {
        if (input.value.trim()) completed++;
    });
    
    // Count if at least one checkbox is checked
    if (checkboxes.length > 0) completed++;
    
    // Count if at least one radio is checked
    if (radios.length > 0) completed++;
    
    const percentage = Math.round((completed / total) * 100);
    
    document.getElementById('progress-fill').style.width = `${percentage}%`;
    document.getElementById('progress-text').textContent = `${percentage}% Complete`;
}

function showError(inputGroup, message) {
    inputGroup.classList.add('error');
    
    let errorElement = inputGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        inputGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(inputGroup) {
    inputGroup.classList.remove('error');
    const errorElement = inputGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearErrors() {
    const errorGroups = document.querySelectorAll('.input-group.error');
    errorGroups.forEach(group => {
        clearFieldError(group);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getFieldLabel(fieldId) {
    const labelMap = {
        'name': 'Full Name',
        'email': 'Email Address',
        'dropdown': 'Current Role'
    };
    return labelMap[fieldId] || fieldId;
}

function getFormData() {
    const formData = new FormData(form);
    const data = {};
    
    // Get regular form fields
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            // Handle multiple values (checkboxes)
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    return data;
}

function showSuccessMessage() {
    // Create success overlay
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay';
    overlay.innerHTML = `
        <div class="success-modal">
            <div class="success-icon">✓</div>
            <h2>Survey Submitted Successfully!</h2>
            <p>Thank you for taking the time to complete our developer survey. Your feedback is valuable to us.</p>
            <button onclick="this.parentElement.parentElement.remove()" class="success-button">Close</button>
        </div>
    `;
    
    // Add CSS for success modal
    const style = document.createElement('style');
    style.textContent = `
        .success-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        .success-modal {
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        .success-icon {
            font-size: 4rem;
            color: #28a745;
            margin-bottom: 20px;
        }
        .success-modal h2 {
            color: #333;
            margin-bottom: 15px;
        }
        .success-modal p {
            color: #666;
            margin-bottom: 25px;
            line-height: 1.6;
        }
        .success-button {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(overlay);
}