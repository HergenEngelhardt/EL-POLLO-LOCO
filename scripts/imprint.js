/**
 * Toggles the visibility of instructions panel
 */
function toggleInstructions() {
    let instructionsElement = document.getElementById('instructions');
    if (!instructionsElement.classList.contains('d-none')) {
        instructionsElement.classList.add('d-none');
    } else {
        hideAllPanels();
        instructionsElement.classList.remove('d-none');
    }
}

/**
 * Toggles the visibility of imprint panel
 */
function toggleImprint() {
    let imprintElement = document.getElementById('imprint');
    
    if (!imprintElement.classList.contains('d-none')) {
        hideImprint(imprintElement);
    } else {
        showImprint(imprintElement);
    }
}

/**
 * Hides the imprint panel and removes outside click handlers
 * @param {HTMLElement} imprintElement - The imprint panel element
 */
function hideImprint(imprintElement) {
    imprintElement.classList.add('d-none');
    if (window.imprintClickOutsideHandler) {
        document.removeEventListener('mousedown', window.imprintClickOutsideHandler);
        document.removeEventListener('touchstart', window.imprintClickOutsideHandler);
        window.imprintClickOutsideHandler = null;
    }
}

/**
 * Shows the imprint panel and loads its content if needed
 * @param {HTMLElement} [imprintElement] - Optional imprint panel element
 */
function showImprint(imprintElement) {
    if (typeof imprintElement === 'string' || !imprintElement) {
        imprintElement = document.getElementById('imprint');
    }
    hideAllPanels();
    document.getElementById('mobileMenu').classList.add('d-none');
    imprintElement.classList.remove('d-none');
    
    if (!imprintElement.classList.contains('loaded')) {
        loadImprintContent(imprintElement);
    }
}

/**
 * Loads the imprint content from the server
 * @param {HTMLElement} imprintElement - The imprint panel element
 */
function loadImprintContent(imprintElement) {
    fetch('imprint.html')
        .then(response => response.text())
        .then(data => {
            appendContentWithBackButton(imprintElement, data);
        })
        .catch(error => {
            console.error('Error loading imprint content:', error);
        });
}

/**
 * Appends content to the imprint element with a back button and close button
 * @param {HTMLElement} imprintElement - The imprint panel element
 * @param {string} data - The content to append
 */
function appendContentWithBackButton(imprintElement, data) {
    let backButtonHTML = '<button class="btn" onclick="showMenu()">Back to Menu</button>';
    let closeButtonHTML = '<button class="close-btn" onclick="hideImprint(document.getElementById(\'imprint\'))">×</button>';
    
    // Add the close button at the beginning of the content
    imprintElement.innerHTML = closeButtonHTML + data + backButtonHTML;
    imprintElement.classList.add('loaded');
    
    // Add click outside listener
    addClickOutsideListener(imprintElement);
}

/**
 * Adds event listener to close imprint when clicking outside
 * @param {HTMLElement} imprintElement - The imprint panel element
 */
function addClickOutsideListener(imprintElement) {
    if (window.imprintClickOutsideHandler) {
        document.removeEventListener('mousedown', window.imprintClickOutsideHandler);
        document.removeEventListener('touchstart', window.imprintClickOutsideHandler);
    }
    
    window.imprintClickOutsideHandler = function(event) {
        if (event.target.closest('#imprint-btn')) {
            return;
        }
        if (!imprintElement.contains(event.target)) {
            hideImprint(imprintElement);
        }
    };
    document.addEventListener('mousedown', window.imprintClickOutsideHandler);
    document.addEventListener('touchstart', window.imprintClickOutsideHandler, {passive: true});
}