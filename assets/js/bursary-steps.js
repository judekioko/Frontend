// ================================
// Step Navigation - Simple & Working
// ================================
let currentStep = 1;
const totalSteps = 5;

function showStep(step) {
    // Hide all steps
    const allSteps = document.querySelectorAll('.form-step');
    allSteps.forEach(el => el.classList.remove('active'));
    
    // Show current step
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    // Update step indicator
    const allIndicators = document.querySelectorAll('.step');
    allIndicators.forEach((el, idx) => {
        const stepNum = idx + 1;
        el.classList.remove('active', 'completed');
        if (stepNum === step) {
            el.classList.add('active');
        } else if (stepNum < step) {
            el.classList.add('completed');
        }
    });
    
    // Update buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    if (prevBtn) prevBtn.style.display = step > 1 ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = step < totalSteps ? 'flex' : 'none';
    if (submitBtn) submitBtn.style.display = step === totalSteps ? 'flex' : 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    // Previous button
    if (prevBtn) {
        prevBtn.onclick = function(e) {
            e.preventDefault();
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        };
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.onclick = function(e) {
            e.preventDefault();
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
            }
        };
    }
    
    // Submit button - REMOVED (handled in bursary.js to prevent double submission)
    // The bursary.js file already has the proper submit handler
    
    // Show first step
    showStep(1);
});
