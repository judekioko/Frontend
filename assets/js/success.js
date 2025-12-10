// success.js - PRODUCTION SUCCESS PAGE
// Handles application success with multiple fallbacks

// ================================
//  DEBUG LOGGING
// ================================
console.log('=== SUCCESS PAGE LOADED ===');
console.log('URL:', window.location.href);
console.log('Referrer:', document.referrer);

// ================================
//  DATA EXTRACTION
// ================================
function extractApplicationData() {
    console.log('🔍 Extracting application data...');
    
    let data = null;
    let source = 'unknown';
    
    // METHOD 1: URL Parameters (MOST RELIABLE)
    try {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        const success = params.get('success');
        
        if (ref && success === 'true') {
            console.log('✅ Found data in URL parameters');
            
            data = {
                reference_number: ref,
                full_name: decodeURIComponent(params.get('name') || 'Applicant'),
                email: params.get('email') || '',
                phone_number: params.get('phone') || '',
                institution_name: decodeURIComponent(params.get('institution') || 'Your Institution'),
                amount: params.get('amount') || '0',
                ward: params.get('ward') || '',
                submitted_at: params.get('submitted') || new Date().toISOString(),
                source: 'url_params'
            };
            
            source = 'url_params';
            
            // Save to storage for page refreshes
            try {
                sessionStorage.setItem('applicationSuccessData', JSON.stringify(data));
                console.log('💾 Saved URL data to sessionStorage');
            } catch (e) {
                console.warn('Could not save to sessionStorage:', e);
            }
        }
    } catch (e) {
        console.error('URL extraction error:', e);
    }
    
    // METHOD 2: sessionStorage
    if (!data) {
        try {
            const stored = sessionStorage.getItem('applicationSuccessData');
            if (stored) {
                data = JSON.parse(stored);
                data.source = 'session_storage';
                source = 'session_storage';
                console.log('✅ Found data in sessionStorage');
            }
        } catch (e) {
            console.error('sessionStorage error:', e);
        }
    }
    
    // METHOD 3: localStorage
    if (!data) {
        try {
            const stored = localStorage.getItem('applicationSuccessData');
            if (stored) {
                data = JSON.parse(stored);
                data.source = 'local_storage';
                source = 'local_storage';
                console.log('✅ Found data in localStorage');
            }
        } catch (e) {
            console.error('localStorage error:', e);
        }
    }
    
    // METHOD 4: window variable
    if (!data && window.__appStorage?.applicationSuccessData) {
        data = window.__appStorage.applicationSuccessData;
        data.source = 'window_variable';
        source = 'window_variable';
        console.log('✅ Found data in window variable');
    }
    
    console.log(`📊 Data source: ${source}`);
    console.log('Extracted data:', data);
    
    return data;
}

// ================================
//  PAGE POPULATION
// ================================
function populateSuccessPage(data) {
    if (!data) {
        showErrorMessage('No application data found. Please contact support.');
        return;
    }
    
    console.log('🎨 Populating success page with data:', data);
    
    // Helper function to set text
    const setText = (id, value, fallback = '') => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value || fallback;
        } else {
            console.warn(`Element #${id} not found`);
        }
    };
    
    // Reference number
    setText('reference-number', data.reference_number);
    setText('success-ref-number', data.reference_number);
    
    // Applicant info
    setText('success-full-name', data.full_name, 'Applicant');
    setText('success-applicant-name', data.full_name, 'Applicant');
    setText('success-applicant-email', data.email);
    
    // Application details
    setText('success-institution', data.institution_name, 'Institution');
    
    // Format amount
    const amount = parseInt(data.amount) || 0;
    setText('success-amount', amount.toLocaleString() + ' KSh');
    
    // Format ward
    const ward = data.ward ? data.ward.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';
    setText('success-ward', ward);
    
    // Format date
    try {
        const date = new Date(data.submitted_at);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        setText('success-timestamp', formattedDate);
        setText('success-submission-date', formattedDate);
    } catch (e) {
        setText('success-timestamp', 'Just now');
        setText('success-submission-date', 'Today');
    }
    
    // Set up copy button
    setupCopyButton();
    
    // Show success message
    setTimeout(() => {
        const successBanner = document.querySelector('.success-header-banner');
        if (successBanner) {
            successBanner.style.opacity = '1';
            successBanner.style.transform = 'translateY(0)';
        }
        
        // Trigger confetti if available
        if (typeof confetti === 'function') {
            setTimeout(() => {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }, 500);
        }
    }, 300);
    
    console.log('✅ Success page populated');
}

// ================================
//  COPY BUTTON
// ================================
function setupCopyButton() {
    const copyBtn = document.getElementById('copy-ref-btn');
    if (!copyBtn) return;
    
    copyBtn.addEventListener('click', function() {
        const refElement = document.getElementById('reference-number');
        if (!refElement) return;
        
        const refNumber = refElement.textContent;
        
        navigator.clipboard.writeText(refNumber).then(() => {
            // Visual feedback
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.backgroundColor = '';
            }, 2000);
            
            console.log('📋 Reference number copied:', refNumber);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Please copy the reference number manually: ' + refNumber);
        });
    });
}

// ================================
//  ERROR HANDLING
// ================================
function showErrorMessage(message) {
    console.error('Showing error:', message);
    
    // Hide success content
    const successContainer = document.querySelector('.enhanced-success-container');
    if (successContainer) {
        successContainer.style.display = 'none';
    }
    
    // Show error message
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <div style="color: #dc3545; font-size: 48px; margin-bottom: 20px;">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h3 style="color: #333; margin-bottom: 15px;">Application Status</h3>
                <p style="color: #666; margin-bottom: 30px; font-size: 16px;">
                    ${message}
                </p>
                <div>
                    <a href="bursary-application-form.html" 
                       style="background: #006400; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 4px; margin: 0 10px; display: inline-block;">
                        <i class="fas fa-paper-plane"></i> Submit New Application
                    </a>
                    <a href="status.html" 
                       style="background: #666; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 4px; margin: 0 10px; display: inline-block;">
                        <i class="fas fa-search"></i> Check Application Status
                    </a>
                </div>
            </div>
        `;
        errorDiv.style.display = 'block';
    }
}

// ================================
//  PAGE LOAD
// ================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Success page initialized');
    
    // Extract data
    const applicationData = extractApplicationData();
    
    if (applicationData) {
        populateSuccessPage(applicationData);
    } else {
        showErrorMessage('Your application was submitted successfully, but we could not load the details. Please check your email for confirmation and save your reference number.');
    }
    
    // Analytics tracking
    if (applicationData?.reference_number) {
        console.log('📈 Application completed:', applicationData.reference_number);
        // You can add Google Analytics or other tracking here
    }
});