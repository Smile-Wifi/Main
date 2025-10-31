// Municipal Services Portal - Main JavaScript
// Handles all interactive functionality and animations

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeInteractions();
    initializeWizard();
    initializeScrollEffects();
    initializeMobileMenu();
});

// Animation Initialization
function initializeAnimations() {
    // Initialize text splitting for hero title
    if (typeof Splitting !== 'undefined') {
        Splitting();
        
        // Animate hero title letters
        anime({
            targets: '[data-splitting] .char',
            opacity: [0, 1],
            translateY: [50, 0],
            delay: anime.stagger(50),
            duration: 800,
            easing: 'easeOutExpo'
        });
    }
    
    // Initialize typed text effect
    if (typeof Typed !== 'undefined') {
        new Typed('#typed-text', {
            strings: [
                'Simplifying government processes',
                'Your gateway to official documents',
                'Fast, reliable, and accessible services',
                'Streamlined application procedures'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// Interactive Elements
function initializeInteractions() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
    
    // Animate status indicators
    const statusIndicators = document.querySelectorAll('.status-indicator');
    statusIndicators.forEach(indicator => {
        anime({
            targets: indicator,
            scale: [1, 1.2, 1],
            duration: 2000,
            loop: true,
            easing: 'easeInOutSine'
        });
    });
}

// Document Requirements Wizard
function initializeWizard() {
    const wizardData = {
        questions: [
            {
                id: 'purpose',
                question: 'What is your primary purpose for obtaining documents?',
                type: 'radio',
                options: [
                    { value: 'employment', label: 'Employment/Job Application' },
                    { value: 'business', label: 'Business/Entrepreneurship' },
                    { value: 'travel', label: 'Travel/Immigration' },
                    { value: 'personal', label: 'Personal/Legal Matters' },
                    { value: 'education', label: 'Education/School Requirements' }
                ]
            },
            {
                id: 'status',
                question: 'What is your current status?',
                type: 'radio',
                options: [
                    { value: 'student', label: 'Student' },
                    { value: 'employee', label: 'Employee' },
                    { value: 'business_owner', label: 'Business Owner' },
                    { value: 'unemployed', label: 'Currently Unemployed' },
                    { value: 'ofw', label: 'Overseas Filipino Worker' }
                ]
            },
            {
                id: 'age',
                question: 'What is your age range?',
                type: 'radio',
                options: [
                    { value: 'under_18', label: 'Under 18 years old' },
                    { value: '18_25', label: '18-25 years old' },
                    { value: '26_35', label: '26-35 years old' },
                    { value: '36_50', label: '36-50 years old' },
                    { value: 'over_50', label: 'Over 50 years old' }
                ]
            },
            {
                id: 'location',
                question: 'Where are you currently located?',
                type: 'radio',
                options: [
                    { value: 'manila', label: 'Metro Manila' },
                    { value: 'luzon', label: 'Luzon (outside Metro Manila)' },
                    { value: 'visayas', label: 'Visayas' },
                    { value: 'mindanao', label: 'Mindanao' },
                    { value: 'abroad', label: 'Outside Philippines' }
                ]
            }
        ],
        documents: {
            police_clearance: {
                name: 'Police Clearance',
                requirements: [
                    'Valid government-issued ID',
                    'Birth certificate (PSA)',
                    'Application form',
                    'Payment (₱150)'
                ],
                processing_time: '1 business day',
                fees: '₱150',
                applicable: ['employment', 'travel', 'personal']
            },
            cedula: {
                name: 'Community Tax Certificate (Cedula)',
                requirements: [
                    'Valid ID',
                    'Proof of income (if applicable)',
                    'Barangay clearance',
                    'Application form'
                ],
                processing_time: '15-30 minutes',
                fees: '₱5-500 (based on income)',
                applicable: ['employment', 'business', 'personal']
            },
            mayors_permit: {
                name: 'Mayor\'s Permit',
                requirements: [
                    'DTI/SEC registration',
                    'Barangay clearance',
                    'Fire safety certificate',
                    'Sanitary permit',
                    'Zoning clearance',
                    'Contract of lease/land title'
                ],
                processing_time: '3-5 business days',
                fees: '₱200-2000 (based on business type)',
                applicable: ['business']
            },
            barangay_clearance: {
                name: 'Barangay Clearance',
                requirements: [
                    'Valid ID',
                    'Proof of residency',
                    'Application form',
                    'Payment (₱50-500)'
                ],
                processing_time: 'Same day',
                fees: '₱50-500',
                applicable: ['employment', 'business', 'personal']
            },
            business_permit: {
                name: 'Business Permit',
                requirements: [
                    'Mayor\'s permit',
                    'BIR registration',
                    'SSS/PhilHealth/Pag-IBIG registration',
                    'Environmental clearance (if applicable)'
                ],
                processing_time: '5-7 business days',
                fees: 'Variable based on business type',
                applicable: ['business']
            },
            passport: {
                name: 'Philippine Passport',
                requirements: [
                    'Birth certificate (PSA)',
                    'Valid ID',
                    'Application form',
                    'Photos (2x2)'
                ],
                processing_time: '7-15 business days',
                fees: '₱950-1200',
                applicable: ['travel']
            },
            nbi_clearance: {
                name: 'NBI Clearance',
                requirements: [
                    'Valid ID',
                    'Birth certificate',
                    'Application form',
                    'Payment (₱130-200)'
                ],
                processing_time: '1-3 business days',
                fees: '₱130-200',
                applicable: ['employment', 'travel', 'personal']
            },
            birth_certificate: {
                name: 'Birth Certificate (PSA)',
                requirements: [
                    'Valid ID',
                    'Application form',
                    'Payment (₱155-365)'
                ],
                processing_time: '3-7 business days',
                fees: '₱155-365',
                applicable: ['employment', 'travel', 'education', 'personal']
            }
        }
    };
    
    let currentStep = 0;
    let userAnswers = {};
    
    // Start wizard button
    const startWizardBtn = document.getElementById('start-wizard');
    if (startWizardBtn) {
        startWizardBtn.addEventListener('click', function() {
            showWizard();
        });
    }
    
    function showWizard() {
        const wizardSection = document.getElementById('wizard-section');
        const wizardContent = document.getElementById('wizard-content');
        
        if (wizardSection && wizardContent) {
            wizardSection.classList.remove('hidden');
            wizardSection.scrollIntoView({ behavior: 'smooth' });
            renderWizardStep(0);
        }
    }
    
    function renderWizardStep(stepIndex) {
        const wizardContent = document.getElementById('wizard-content');
        const question = wizardData.questions[stepIndex];
        
        if (!question) {
            showResults();
            return;
        }
        
        let optionsHTML = '';
        question.options.forEach(option => {
            optionsHTML += `
                <label class="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <input type="${question.type}" name="${question.id}" value="${option.value}" class="mr-3 text-government-blue">
                    <span class="text-trust-navy">${option.label}</span>
                </label>
            `;
        });
        
        wizardContent.innerHTML = `
            <div class="mb-8">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-semibold text-trust-navy">
                        Step ${stepIndex + 1} of ${wizardData.questions.length}
                    </h3>
                    <div class="w-48 bg-gray-200 rounded-full h-2">
                        <div class="bg-government-blue h-2 rounded-full transition-all duration-300" 
                             style="width: ${((stepIndex + 1) / wizardData.questions.length) * 100}%"></div>
                    </div>
                </div>
                
                <h4 class="text-lg font-medium text-trust-navy mb-4">${question.question}</h4>
                <div class="space-y-3">
                    ${optionsHTML}
                </div>
                
                <div class="flex justify-between mt-8">
                    <button id="wizard-back" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors ${stepIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}" 
                            ${stepIndex === 0 ? 'disabled' : ''}>
                        Back
                    </button>
                    <button id="wizard-next" class="bg-government-blue hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                        ${stepIndex === wizardData.questions.length - 1 ? 'Get Results' : 'Next'}
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('wizard-next').addEventListener('click', handleNextStep);
        if (stepIndex > 0) {
            document.getElementById('wizard-back').addEventListener('click', handleBackStep);
        }
    }
    
    function handleNextStep() {
        const currentQuestion = wizardData.questions[currentStep];
        const selectedOption = document.querySelector(`input[name="${currentQuestion.id}"]:checked`);
        
        if (!selectedOption) {
            alert('Please select an option before continuing.');
            return;
        }
        
        userAnswers[currentQuestion.id] = selectedOption.value;
        currentStep++;
        renderWizardStep(currentStep);
    }
    
    function handleBackStep() {
        if (currentStep > 0) {
            currentStep--;
            renderWizardStep(currentStep);
        }
    }
    
    function showResults() {
        const wizardContent = document.getElementById('wizard-content');
        const wizardResults = document.getElementById('wizard-results');
        const checklistContent = document.getElementById('checklist-content');
        
        // Hide wizard and show results
        wizardContent.style.display = 'none';
        wizardResults.classList.remove('hidden');
        
        // Generate personalized checklist
        const recommendedDocs = generateRecommendations();
        checklistContent.innerHTML = recommendedDocs;
        
        // Add event listeners for result buttons
        document.getElementById('restart-wizard').addEventListener('click', restartWizard);
        document.getElementById('save-checklist').addEventListener('click', saveChecklist);
    }
    
    function generateRecommendations() {
        const purpose = userAnswers.purpose;
        const status = userAnswers.status;
        const age = userAnswers.age;
        const location = userAnswers.location;
        
        let recommendations = '';
        let totalCost = 0;
        let totalTime = 0;
        
        // Generate document recommendations based on user answers
        Object.keys(wizardData.documents).forEach(key => {
            const doc = wizardData.documents[key];
            
            // Check if document is applicable based on purpose
            if (doc.applicable.includes(purpose)) {
                let isRecommended = false;
                
                // Additional logic based on status and other factors
                if (status === 'student' && (key === 'birth_certificate' || key === 'cedula')) {
                    isRecommended = true;
                }
                if (status === 'employee' && (key === 'police_clearance' || key === 'cedula')) {
                    isRecommended = true;
                }
                if (status === 'business_owner' && (key === 'mayors_permit' || key === 'barangay_clearance')) {
                    isRecommended = true;
                }
                if (purpose === 'travel' && (key === 'passport' || key === 'nbi_clearance')) {
                    isRecommended = true;
                }
                if (purpose === 'employment' && (key === 'police_clearance' || key === 'nbi_clearance')) {
                    isRecommended = true;
                }
                
                // Default recommendations for basic documents
                if (key === 'cedula' || key === 'barangay_clearance') {
                    isRecommended = true;
                }
                
                if (isRecommended) {
                    recommendations += `
                        <div class="bg-white p-4 rounded-lg mb-4">
                            <h4 class="font-semibold text-trust-navy mb-2">${doc.name}</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong>Requirements:</strong>
                                    <ul class="list-disc list-inside mt-1 text-gray-600">
                                        ${doc.requirements.map(req => `<li>${req}</li>`).join('')}
                                    </ul>
                                </div>
                                <div>
                                    <p><strong>Processing Time:</strong> ${doc.processing_time}</p>
                                    <p><strong>Fees:</strong> ${doc.fees}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    // Extract numeric values for totals (simplified)
                    const feeMatch = doc.fees.match(/[\d,]+/);
                    if (feeMatch) {
                        totalCost += parseInt(feeMatch[0].replace(/,/g, ''));
                    }
                }
            }
        });
        
        // Add summary
        recommendations = `
            <div class="bg-official-gold text-white p-4 rounded-lg mb-6">
                <h4 class="font-semibold mb-2">Your Personalized Document Checklist</h4>
                <p class="text-sm">Based on your answers, here are the documents you likely need:</p>
            </div>
            ${recommendations}
            <div class="bg-gray-100 p-4 rounded-lg mt-6">
                <div class="flex justify-between items-center">
                    <span class="font-semibold">Estimated Total Cost:</span>
                    <span class="font-bold text-government-blue">₱${totalCost.toLocaleString()}</span>
                </div>
                <p class="text-sm text-gray-600 mt-2">*Actual costs may vary based on specific requirements and location</p>
            </div>
        `;
        
        return recommendations;
    }
    
    function restartWizard() {
        currentStep = 0;
        userAnswers = {};
        
        const wizardContent = document.getElementById('wizard-content');
        const wizardResults = document.getElementById('wizard-results');
        
        wizardResults.classList.add('hidden');
        wizardContent.style.display = 'block';
        
        renderWizardStep(0);
    }
    
    function saveChecklist() {
        // Create a simple text version of the checklist
        const checklistText = generatePlainTextChecklist();
        
        // Create and download a text file
        const blob = new Blob([checklistText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'municipal-documents-checklist.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Show success message
        alert('Your checklist has been saved! Check your downloads folder.');
    }
    
    function generatePlainTextChecklist() {
        let text = 'MUNICIPAL DOCUMENTS CHECKLIST\n';
        text += 'Generated on: ' + new Date().toLocaleDateString() + '\n\n';
        text += 'User Information:\n';
        Object.keys(userAnswers).forEach(key => {
            text += `- ${key}: ${userAnswers[key]}\n`;
        });
        text += '\nRecommended Documents:\n';
        
        // Add document recommendations (simplified)
        Object.keys(wizardData.documents).forEach(key => {
            const doc = wizardData.documents[key];
            text += `\n${doc.name}\n`;
            text += `Processing Time: ${doc.processing_time}\n`;
            text += `Fees: ${doc.fees}\n`;
            text += 'Requirements:\n';
            doc.requirements.forEach(req => {
                text += `- ${req}\n`;
            });
        });
        
        return text;
    }
}

// Scroll Effects
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Add stagger animation for multiple elements
                const siblings = entry.target.parentElement.querySelectorAll('.scroll-reveal');
                siblings.forEach((sibling, index) => {
                    if (sibling === entry.target) {
                        anime({
                            targets: sibling,
                            opacity: [0, 1],
                            translateY: [30, 0],
                            delay: index * 100,
                            duration: 600,
                            easing: 'easeOutQuad'
                        });
                    }
                });
            }
        });
    }, observerOptions);
    
    // Observe all scroll-reveal elements
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Application Status Tracker (for future implementation)
class ApplicationTracker {
    constructor() {
        this.applications = this.loadApplications();
    }
    
    addApplication(applicationData) {
        const application = {
            id: this.generateId(),
            ...applicationData,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.applications.push(application);
        this.saveApplications();
        return application;
    }
    
    updateApplication(id, updates) {
        const index = this.applications.findIndex(app => app.id === id);
        if (index !== -1) {
            this.applications[index] = {
                ...this.applications[index],
                ...updates,
                updatedAt: new Date()
            };
            this.saveApplications();
        }
    }
    
    getApplication(id) {
        return this.applications.find(app => app.id === id);
    }
    
    getAllApplications() {
        return this.applications;
    }
    
    generateId() {
        return 'APP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    
    saveApplications() {
        localStorage.setItem('municipal_applications', JSON.stringify(this.applications));
    }
    
    loadApplications() {
        const saved = localStorage.getItem('municipal_applications');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize tracker
const tracker = new ApplicationTracker();

// Export for use in other pages
window.MunicipalServices = {
    ApplicationTracker: ApplicationTracker,
    tracker: tracker,
    formatCurrency: formatCurrency,
    formatDate: formatDate
};