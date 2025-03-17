/**
 * Displays the instructions panel and hides other UI elements
 * Shows instructions while ensuring imprint and mobile menu remain hidden
 */
function showInstructions() {
    document.getElementById('instructions').classList.remove('d-none');
    document.getElementById('imprint').classList.add('d-none');
    document.getElementById('mobileMenu').classList.add('d-none');
}

/**
 * Sets up event listeners for mobile menu buttons when DOM is fully loaded
 * Attaches click handlers to the mobile menu toggle and close buttons
 */
document.addEventListener('DOMContentLoaded', function () {
    let menuBtn = document.getElementById('mobileMenuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMobileMenu);
    }
    let closeBtn = document.querySelector('#mobileMenu .mobile-menu-btn:last-child');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileMenu);
    }
});

/**
 * Checks device orientation and displays a message 
 * when the device is held in portrait mode
 */
function checkMobileAlignment() {
    if (isMobileDevice()) {
        let orientationMessage = getOrientationMessageElement();
        if (orientationMessage) {
            setupOrientationHandling(orientationMessage);
        }
    }
}

/**
 * Checks if the current device is a mobile device
 * @returns {boolean} True if mobile device, false otherwise
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 1024;
}

/**
 * Finds the orientation message element in the DOM
 * @returns {HTMLElement|null} The orientation message element or null
 */
function getOrientationMessageElement() {
    let orientationMessage = document.getElementById('orientation-message');
    if (!orientationMessage) {
        console.error('Orientation message element not found');
        return null;
    }
    return orientationMessage;
}

/**
 * Sets up orientation monitoring for a given element
 * @param {HTMLElement} orientationMessage - The orientation message element
 */
function setupOrientationHandling(orientationMessage) {
    function updateOrientation() {
        if (window.innerHeight > window.innerWidth) {
            orientationMessage.classList.remove('d-none');
            orientationMessage.style.display = 'flex';
        } else {
            orientationMessage.classList.add('d-none');
        }
    }

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', () => {
        setTimeout(updateOrientation, 100);
    });
}

/**
 * Toggles the visibility of the mobile menu
 * Shows the menu if it's hidden, hides it if it's visible
 */
function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('d-none');
}

/**
 * Explicitly closes the mobile menu by hiding it
 * Uses both CSS class and inline style to ensure the menu is hidden
 */
function closeMobileMenu() {
    let mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.add('d-none');
        mobileMenu.style.display = 'none';
    }
}