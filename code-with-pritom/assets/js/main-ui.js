// assets/js/main-ui.js - FINAL VERSION

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SITE PRELOADER ---
    const siteLoader = document.getElementById('siteLoader');
    if (siteLoader) {
        window.addEventListener('load', () => {
            siteLoader.classList.add('hidden');
            document.body.classList.remove('preload'); 
        });
        // Fallback for safety
        setTimeout(() => {
            if (!siteLoader.classList.contains('hidden')) {
                siteLoader.classList.add('hidden');
                document.body.classList.remove('preload');
            }
        }, 2500); // Reduced timeout
    } else {
        document.body.classList.remove('preload');
    }

    // --- 2. STICKY HEADER ---
    const siteHeader = document.getElementById('siteHeader');
    if (siteHeader) {
        const stickyHeader = () => {
            if (window.scrollY > 50) { // Add 'scrolled' class after scrolling 50px
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', stickyHeader, { passive: true }); // Use passive listener for scroll
        stickyHeader(); // Initial check on page load
    }

    // --- 3. MOBILE NAVIGATION & 4. DROPDOWN HANDLING ---
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const menuCloseBtn = document.getElementById('menuCloseBtn');
    const mainNav = document.getElementById('mainNav');
    const navLinks = mainNav ? Array.from(mainNav.querySelectorAll('.nav-link')) : []; // Convert to Array
    const dropdowns = mainNav ? Array.from(mainNav.querySelectorAll('.dropdown')) : [];

    const openMobileMenu = () => {
        if (mainNav) {
            mainNav.classList.add('active');
            document.body.style.overflow = 'hidden'; 
            if(menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'true');
        }
    };

    const closeMobileMenu = () => {
        if (mainNav) {
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
            if(menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'false');
            // Close all dropdowns when mobile menu closes
            dropdowns.forEach(dd => dd.classList.remove('open')); 
        }
    };

    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', openMobileMenu);
    }
    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', closeMobileMenu);
    }

    // Dropdown logic - primarily for mobile tap
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.has-dropdown'); 

        if (!link) return;

        link.addEventListener('click', function(e) {
            // Mobile tap behavior
            if (window.innerWidth < 992 && mainNav && mainNav.classList.contains('active')) {
                e.preventDefault(); 
                
                const isOpen = dropdown.classList.contains('open');

                // Close all other currently open dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('open');
                    }
                });

                // Toggle the current dropdown
                dropdown.classList.toggle('open', !isOpen);
            }
            // Desktop hover is handled by CSS :hover on the parent .dropdown
        });
    });


    // Close mobile menu if a non-dropdown nav link (or a link inside an open dropdown) is clicked
    navLinks.forEach(link => {
        // Check if the link is NOT a dropdown toggle itself AND is inside the mainNav
        if (!link.classList.contains('has-dropdown')) {
            link.addEventListener('click', (e) => {
                // If it's a link inside a dropdown, allow default behavior if it's not just "#"
                const parentDropdown = link.closest('.dropdown-menu');
                if (parentDropdown && link.getAttribute('href') && link.getAttribute('href') !== '#') {
                    // It's a real link inside a dropdown, let it navigate
                } else if (link.getAttribute('href') === '#') {
                    e.preventDefault(); // Prevent jump for placeholder links
                }

                if (mainNav && mainNav.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        }
    });
    
    // Close mobile menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav && mainNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on click outside
    document.addEventListener('click', (e) => {
        if (mainNav && mainNav.classList.contains('active')) {
            // If click is outside mainNav and not on the toggle button
            if (!mainNav.contains(e.target) && menuToggleBtn && !menuToggleBtn.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });


    // --- 5. THEME TOGGLE ---
    const themeToggleBtn = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    const getCurrentTheme = () => localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');

    const applyTheme = (theme) => {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        if (themeToggleBtn) {
            themeToggleBtn.setAttribute('aria-pressed', theme === 'dark');
            // Optional: Change icon text/title if you have separate icons
            // const icon = themeToggleBtn.querySelector('i');
            // if (icon) icon.className = theme === 'dark' ? 'fas fa-sun theme-icon-light' : 'fas fa-moon theme-icon-dark';
        }
    };

    let currentTheme = getCurrentTheme();
    applyTheme(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            currentTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }
    
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) { // Only if user hasn't set a preference
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });


    // --- 7. BACK TO TOP BUTTON ---
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        const toggleBackToTopButton = () => {
            if (backToTopBtn) backToTopBtn.classList.toggle('visible', window.scrollY > 250); // Show earlier
        };
        window.addEventListener('scroll', toggleBackToTopButton, { passive: true });
        toggleBackToTopButton(); 
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 8. AOS INITIALIZATION ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600, // Slightly faster animations      
            easing: 'ease-out-cubic', // Different easing
            once: true,         
            offset: 60,         
            delay: 0, // No global delay, use data-aos-delay per element if needed
        });
    }

    // --- 9. CURRENT YEAR IN FOOTER ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- SMOOTH SCROLL FOR ON-PAGE ANCHORS ---
    document.querySelectorAll('a.scroll-to[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Ignore empty hash links

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = siteHeader ? siteHeader.offsetHeight : 0; 
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 15; // Slightly less offset
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
    
    // --- FORM SUBMISSION HANDLING (GENERIC - can be adapted) ---
    const handleFormSubmission = (formElement, statusElement) => {
        if (!formElement || !statusElement) return;

        formElement.addEventListener('submit', function(e) {
            e.preventDefault(); 
            let isValid = true;
            const requiredInputs = formElement.querySelectorAll('[required]');
            
            requiredInputs.forEach(input => {
                if (input.type === 'email') {
                    if (input.value.trim() === '' || !/^\S+@\S+\.\S+$/.test(input.value)) {
                        isValid = false;
                        // Optionally add error class to input.parentElement or input itself
                        // input.classList.add('is-invalid'); 
                    } else {
                        // input.classList.remove('is-invalid');
                    }
                } else {
                    if (input.value.trim() === '') {
                        isValid = false;
                        // input.classList.add('is-invalid');
                    } else {
                        // input.classList.remove('is-invalid');
                    }
                }
            });
            
            if (!isValid) {
                statusElement.textContent = 'Please fill all required fields correctly.';
                statusElement.className = 'form-status-message error active'; 
                setTimeout(() => statusElement.classList.remove('active'), 4000);
                return;
            }

            statusElement.textContent = 'Processing... (Demo)';
            statusElement.className = 'form-status-message sending active';

            setTimeout(() => {
                statusElement.textContent = 'Submitted successfully! Thank you. (Demo)';
                statusElement.className = 'form-status-message success active';
                formElement.reset(); 
                setTimeout(() => { 
                    statusElement.classList.remove('active');
                    setTimeout(() => { statusElement.className = 'form-status-message'; }, 500); 
                }, 5000);
            }, 1500); 
        });
    };

    // Contact Form
    handleFormSubmission(
        document.getElementById('contactPageForm'), 
        document.getElementById('formStatusMessage')
    );

    // Index Subscription Form (simpler alert for this one)
    const indexSubscriptionForm = document.getElementById('indexSubscriptionForm');
    if (indexSubscriptionForm) {
        indexSubscriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = indexSubscriptionForm.querySelector('input[type="email"]');
            if (!emailInput || emailInput.value.trim() === '' || !/^\S+@\S+\.\S+$/.test(emailInput.value)) {
                alert('Please enter a valid email to subscribe.');
                return;
            }
            alert('Thank you for subscribing! (Demo)'); 
            indexSubscriptionForm.reset();
        });
    }

    // --- ADVANCED LIVE SEARCH BAR (GLOBAL) ---
    // 1. Inject search bar into header
    const headerContainer = document.querySelector('.header-container');
    if (headerContainer) {
        const searchBarHTML = `
            <div class="site-search-bar" id="siteSearchBar">
                <input type="text" id="siteSearchInput" class="site-search-input" placeholder="Search news, events, tips..." autocomplete="off" aria-label="Search site content">
                <div class="site-search-suggestions" id="siteSearchSuggestions" style="display:none;"></div>
            </div>
        `;
        // Insert before header-actions for best placement
        const headerActions = headerContainer.querySelector('.header-actions');
        if (headerActions) {
            headerActions.insertAdjacentHTML('beforebegin', searchBarHTML);
        } else {
            headerContainer.insertAdjacentHTML('beforeend', searchBarHTML);
        }
    }

    // 2. Search logic
    const searchInput = document.getElementById('siteSearchInput');
    const suggestionsBox = document.getElementById('siteSearchSuggestions');
    let allSearchData = [];
    let searchIndexBuilt = false;
    let searchTimeout = null;

    // Helper: Fetch and index all data from data/*.json
    async function buildSearchIndex() {
        if (searchIndexBuilt) return;
        const dataFiles = [
            'data/cse_department_news.json',
            'data/ewu_news.json',
            'data/seminars.json',
            'data/programming_tips.json',
            'data/pc_tricks.json',
            'data/marketing_updates.json'
        ];
        const fetches = dataFiles.map(url => fetch(url).then(r => r.ok ? r.json() : []).catch(() => []));
        const results = await Promise.all(fetches);
        // Flatten and tag each item with its source
        allSearchData = [];
        results.forEach((arr, i) => {
            const source = dataFiles[i].replace(/^data\/|\.json$/g, '');
            arr.forEach(item => {
                allSearchData.push({ ...item, __source: source });
            });
        });
        searchIndexBuilt = true;
    }

    // Helper: Generate search result URL based on item type/source
    function getSearchResultUrl(item) {
        switch (item.__source) {
            case 'cse_department_news':
                return `sections/cse-news.html`;
            case 'ewu_news':
                return `sections/ewu-section.html`;
            case 'seminars':
                return `sections/seminars.html`;
            case 'programming_tips':
                return `sections/programming.html`;
            case 'pc_tricks':
                return `sections/pc-tricks.html`;
            case 'marketing_updates':
                return `sections/marketing.html`;
            default:
                return '#';
        }
    }

    // Helper: Highlight matched text
    function highlightMatch(text, query) {
        if (!query) return text;
        return text.replace(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>');
    }

    // Main search handler
    async function handleLiveSearch(e) {
        const query = searchInput.value.trim();
        if (!query) {
            suggestionsBox.style.display = 'none';
            suggestionsBox.innerHTML = '';
            return;
        }
        if (!searchIndexBuilt) {
            suggestionsBox.innerHTML = '<div class="search-loading">Searching...</div>';
            suggestionsBox.style.display = 'block';
            await buildSearchIndex();
        }
        // Simple search: title, summary, tags, category, university, etc.
        const q = query.toLowerCase();
        const results = allSearchData.filter(item => {
            return (
                (item.title && String(item.title).toLowerCase().includes(q)) ||
                (item.summary && String(item.summary).toLowerCase().includes(q)) ||
                (item.category && String(item.category).toLowerCase().includes(q)) ||
                (item.university && String(item.university).toLowerCase().includes(q)) ||
                (item.tags && Array.isArray(item.tags) && item.tags.some(tag => String(tag).toLowerCase().includes(q)))
            );
        }).slice(0, 8); // Limit suggestions

        if (results.length === 0) {
            suggestionsBox.innerHTML = '<div class="search-no-results">No results found.</div>';
        } else {
            suggestionsBox.innerHTML = results.map(item => {
                const url = getSearchResultUrl(item) + (item.id ? `?id=${encodeURIComponent(item.id)}` : '');
                const type = item.__source.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return `
                    <a href="${url}" class="search-suggestion-item">
                        <span class="search-suggestion-title">${highlightMatch(item.title || '', query)}</span>
                        <span class="search-suggestion-meta">${type}${item.category ? ' • ' + item.category : ''}${item.university ? ' • ' + item.university : ''}</span>
                    </a>
                `;
            }).join('');
        }
        suggestionsBox.style.display = 'block';
    }

    // Debounced input event
    if (searchInput && suggestionsBox) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => handleLiveSearch(e), 180);
        });
        // Hide suggestions on blur (with delay to allow click)
        searchInput.addEventListener('blur', () => setTimeout(() => { suggestionsBox.style.display = 'none'; }, 180));
        searchInput.addEventListener('focus', (e) => { if (searchInput.value.trim()) handleLiveSearch(e); });
        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            const items = suggestionsBox.querySelectorAll('.search-suggestion-item');
            if (!items.length) return;
            let idx = Array.from(items).findIndex(el => el === document.activeElement);
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (idx < items.length - 1) items[idx + 1].focus();
                else items[0].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (idx > 0) items[idx - 1].focus();
                else items[items.length - 1].focus();
            }
        });
        // Allow clicking suggestion
        suggestionsBox.addEventListener('mousedown', (e) => {
            const link = e.target.closest('.search-suggestion-item');
            if (link) {
                window.location.href = link.getAttribute('href');
            }
        });
    }

}); // End DOMContentLoaded