// assets/js/content-loader.js

// --- UTILITY FUNCTIONS ---
/**
 * Fetches JSON data from a given URL.
 * @param {string} url - The URL of the JSON file.
 * @returns {Promise<Array|null>} - A promise that resolves with the JSON data or null on error.
 */
async function fetchData(url) {
    try {
        // Log the fetch URL for debugging
        // console.log("Fetching JSON from:", url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error(`Invalid JSON structure (expected array) from: ${url}`);
        }
        return data;
    } catch (error) {
        console.error("Could not fetch data:", error);
        return null;
    }
}

/**
 * Formats a date string into a more readable format.
 * @param {string} dateString - ISO date string.
 * @returns {string} - Formatted date (e.g., "November 25, 2023").
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    try {
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
        return dateString; // Return original if parsing fails
    }
}

/**
 * Returns the current date/time in Bangladesh (UTC+6).
 * @returns {Date}
 */
function getBangladeshNow() {
    // Get current UTC time, then add 6 hours
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + 6 * 60 * 60 * 1000);
}
window.getBangladeshNow = getBangladeshNow; // <-- Make available globally

/**
 * Determines the status of a post based on its date.
 * @param {string} dateString - ISO date string.
 * @returns {string} - "upcoming", "latest", or "".
 */
function getPostStatus(dateString) {
    if (!dateString) return '';
    const postDate = new Date(dateString);
    const nowBD = getBangladeshNow();
    // If post date is in the future (after now), it's upcoming
    if (postDate > nowBD) return 'upcoming';
    // If post date is today (Bangladesh), it's latest
    const bdYear = nowBD.getFullYear(), bdMonth = nowBD.getMonth(), bdDay = nowBD.getDate();
    if (
        postDate.getFullYear() === bdYear &&
        postDate.getMonth() === bdMonth &&
        postDate.getDate() === bdDay
    ) return 'latest';
    return '';
}

// --- TEMPLATE FUNCTIONS (Examples - to be expanded) ---

/**
 * Creates HTML for a generic news/content card.
 * @param {object} item - The content item from JSON.
 * @returns {string} - HTML string for the card.
 */
function createNewsCard(item) {
    // Ensure paths are correct if JSON is in /data/ and images in /assets/
    // The item.image might be "https://placehold.co/..." or a relative path like "assets/img/news/my-image.jpg"
    // If relative, and JSON is in /data/, but HTML is in /sections/, paths need care.
    // For simplicity, let's assume image paths in JSON are relative to the project root for now.
    // Or, better, the image URLs are absolute or relative to the assets/img folder.
    const imagePath = item.image.startsWith('http') ? item.image : `../${item.image}`; // Adjust if needed
    const logoPath = item.university_logo && item.university_logo.startsWith('http') ? item.university_logo : `../${item.university_logo}`;
    const postStatus = getPostStatus(item.date);

    return `
        <article class="card content-card news-item-card" data-aos="fade-up">
            <div class="card-image-container">
                ${item.image ? `<img src="${imagePath}" alt="${item.title || 'News image'}" class="card-image">` : ''}
                ${item.category ? `<span class="card-category-badge">${item.category}</span>` : ''}
                ${postStatus === 'upcoming' ? `<span class="card-status-badge upcoming">Upcoming</span>` : ''}
                ${postStatus === 'latest' ? `<span class="card-status-badge latest">Latest</span>` : ''}
            </div>
            <div class="card-content">
                ${item.university ? `
                    <div class="card-brand-logo">
                        ${item.university_logo ? `<img src="${logoPath}" alt="${item.university} Logo">` : ''}
                        ${item.university}
                    </div>` : ''}
                <h3 class="card-title"><a href="${item.details_link || '#'}">${item.title || 'Untitled'}</a></h3>
                <p class="card-excerpt">${item.summary || 'No summary available.'}</p>
                <div class="card-meta">
                    ${item.date ? `<span class="meta-date"><i class="fas fa-calendar-alt"></i> ${formatDate(item.date)}</span>` : ''}
                    ${item.tags && item.tags.length ? `
                        <span class="meta-tags"><i class="fas fa-tags"></i> 
                            ${item.tags.slice(0, 3).map(tag => `<a href="#tag-${tag.toLowerCase()}">${tag}</a>`).join(' ')}
                        </span>`
                    : ''}
                </div>
                ${item.details_link ? `<a href="${item.details_link}" class="btn btn-link card-read-more">Read More <i class="fas fa-chevron-right"></i></a>` : ''}
            </div>
        </article>
    `;
}

function createEWUSpotlightCard(item) {
    // Similar to news card, but maybe slightly different styling or emphasis for EWU
    const imagePath = item.image
        ? (item.image.startsWith('http') ? item.image : `../${item.image}`)
        : 'https://placehold.co/600x400/ffc107/000?text=EWU+Spotlight';
    const logoPath = item.university_logo
        ? (item.university_logo.startsWith('http') ? item.university_logo : `../${item.university_logo}`)
        : '';
    const postStatus = getPostStatus(item.date);

    return `
        <article class="card content-card featured-card ewu-spotlight-item" data-aos="fade-up" data-aos-delay="100">
            <div class="card-image-container">
                 ${imagePath ? `<img src="${imagePath}" alt="${item.title || 'EWU Spotlight'}" class="card-image">` : ''}
                <span class="card-category-badge ewu-badge">EWU Spotlight</span>
                ${postStatus === 'upcoming' ? `<span class="card-status-badge upcoming">Upcoming</span>` : ''}
                ${postStatus === 'latest' ? `<span class="card-status-badge latest">Latest</span>` : ''}
            </div>
            <div class="card-content">
                 <div class="card-brand-logo">
                    ${logoPath ? `<img src="${logoPath}" alt="EWU Logo">` : ''}
                    East West University
                </div>
                <h3 class="card-title"><a href="${item.details_link || '#'}">${item.title || 'Untitled'}</a></h3>
                <p class="card-excerpt">${item.summary || ''}</p>
                <div class="card-meta">
                    <span class="meta-date"><i class="fas fa-calendar-alt"></i> ${formatDate(item.date)}</span>
                </div>
                <a href="${item.details_link || '#'}" class="btn btn-link card-read-more">Learn More <i class="fas fa-chevron-right"></i></a>
            </div>
        </article>
    `;
}


function createEventCard(item, isUpcoming = true) {
    const imagePath = item.image.startsWith('http') ? item.image : `../${item.image}`;
    const postStatus = getPostStatus(item.date);
    let actionsHtml = '';
    if (isUpcoming) {
        actionsHtml = `
            ${item.rsvp_link ? `<a href="${item.rsvp_link}" target="_blank" class="btn btn-secondary rsvp-btn">RSVP Now</a>` : ''}
            ${item.calendar_link ? `<a href="${item.calendar_link}" target="_blank" class="btn btn-outline add-to-calendar-btn"><i class="fas fa-calendar-plus"></i> Add to Calendar</a>` : ''}
        `;
    } else { // Past event
        actionsHtml = `
            ${item.resources_link ? `<a href="${item.resources_link}" target="_blank" class="btn btn-primary view-recap-btn">View Recap & Resources</a>` : '<span class="text-muted">Event Concluded</span>'}
        `;
    }

    return `
        <article class="card content-card event-card ${!isUpcoming ? 'past-event' : ''}" data-aos="fade-up">
            <div class="card-image-container">
                ${item.image ? `<img src="${imagePath}" alt="${item.title}" class="card-image">` : ''}
                ${item.type ? `<span class="card-category-badge event-type-badge">${item.type}</span>` : ''}
                ${postStatus === 'upcoming' ? `<span class="card-status-badge upcoming">Upcoming</span>` : ''}
                ${postStatus === 'latest' ? `<span class="card-status-badge latest">Latest</span>` : ''}
            </div>
            <div class="card-content">
                <h3 class="card-title"><a href="${item.details_link || item.rsvp_link || '#'}">${item.title}</a></h3>
                <div class="card-meta event-meta">
                    <span class="meta-date"><i class="fas fa-calendar-alt"></i> ${formatDate(item.date)} ${item.time ? `at ${item.time}` : ''}</span>
                    ${item.mode ? `<span class="meta-mode"><i class="fas ${item.mode === 'Online' ? 'fa-desktop' : 'fa-map-marker-alt'}"></i> ${item.mode} ${item.platform || item.location ? `(${item.platform || item.location})` : ''}</span>` : ''}
                    ${item.organizer ? `<span class="meta-organizer"><i class="fas fa-users"></i> By: ${item.organizer}</span>` : ''}
                </div>
                <p class="card-excerpt">${item.summary}</p>
                ${item.speakers && item.speakers.length ? `
                    <div class="event-speakers">
                        <strong>Speakers:</strong> ${item.speakers.map(s => `${s.name} (${s.title})`).join(', ')}
                    </div>
                ` : ''}
                <div class="event-actions">
                    ${actionsHtml}
                </div>
            </div>
        </article>
    `;
}

function createProgrammingTipCard(item) {
    const imagePath = item.image && (item.image.startsWith('http') ? item.image : `../${item.image}`);
    const postStatus = getPostStatus(item.date);
    return `
        <article class="card content-card programming-tip-card" data-aos="fade-up">
            ${imagePath ? `
                <div class="card-image-container">
                    <img src="${imagePath}" alt="${item.title}" class="card-image">
                    ${postStatus === 'upcoming' ? `<span class="card-status-badge upcoming">Upcoming</span>` : ''}
                    ${postStatus === 'latest' ? `<span class="card-status-badge latest">Latest</span>` : ''}
                </div>
            ` : ''}
            <div class="card-content">
                 <div class="tip-header">
                    ${item.language ? `<span class="language-badge ${item.language.toLowerCase()}">${item.language}</span>` : ''}
                    ${item.difficulty ? `<span class="difficulty-badge ${item.difficulty.toLowerCase()}"><i class="fas fa-signal"></i> ${item.difficulty}</span>` : ''}
                </div>
                <h3 class="card-title"><a href="${item.details_link || '#'}">${item.title}</a></h3>
                <p class="card-excerpt">${item.summary}</p>
                ${item.content_md || item.content_html ? `
                    <div class="code-snippet-preview">
                        <!-- Simple preview or first few lines of code -->
                        ${item.content_md ? `<pre><code class="language-${item.language ? item.language.toLowerCase() : ''}">${getMarkdownCodePreview(item.content_md, 5)}</code></pre>` : ''}
                    </div>
                ` : ''}
                <div class="card-meta">
                    <span class="meta-date"><i class="fas fa-calendar-alt"></i> ${formatDate(item.date)}</span>
                    ${item.tags && item.tags.length ? `<span class="meta-tags"><i class="fas fa-tags"></i> ${item.tags.slice(0,2).map(t => `<a href="#">${t}</a>`).join(', ')}</span>` : ''}
                </div>
                <div class="tip-actions">
                    ${item.codepen_link ? `<a href="${item.codepen_link}" target="_blank" class="btn btn-outline try-it-btn"><i class="fab fa-codepen"></i> Try It</a>` : ''}
                    <a href="${item.details_link || '#'}" class="btn btn-link card-read-more">View Full Tip <i class="fas fa-chevron-right"></i></a>
                </div>
            </div>
        </article>
    `;
}
// Helper for code preview in programming tip card
function getMarkdownCodePreview(markdown, lines = 5) {
    const codeBlockMatch = markdown.match(/```[\s\S]*?\n([\s\S]*?)```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
        return codeBlockMatch[1].split('\n').slice(0, lines).join('\n').trim();
    }
    return markdown.split('\n').slice(0, lines).join('\n').trim().substring(0, 150) + '...'; // Fallback
}


function createPcTrickCard(item) {
    const imagePath = item.image && (item.image.startsWith('http') ? item.image : `../${item.image}`);
    return `
        <article class="card content-card pc-trick-card" data-aos="fade-up">
            <div class="card-image-container ${item.video_embed_url ? 'video-embed-container' : ''}">
                ${item.video_embed_url ? `
                    <iframe src="${item.video_embed_url}" title="${item.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                ` : (imagePath ? `
                    <img src="${imagePath}" alt="${item.title}" class="card-image">
                ` : '')}
                ${item.os ? `<span class="card-category-badge os-badge ${item.os.toLowerCase()}">${item.os}</span>` : ''}
            </div>
            <div class="card-content">
                <h3 class="card-title"><a href="${item.details_link || '#'}">${item.title}</a></h3>
                <p class="card-excerpt">${item.summary}</p>
                <div class="card-meta">
                    <span class="meta-date"><i class="fas fa-calendar-alt"></i> ${formatDate(item.date)}</span>
                    ${item.category ? `<span class="meta-category"><i class="fas fa-folder-open"></i> ${item.category}</span>` : ''}
                </div>
                <a href="${item.details_link || '#'}" class="btn btn-link card-read-more">View Trick <i class="fas fa-chevron-right"></i></a>
            </div>
        </article>
    `;
}

function createMarketingCard(item) {
    const imagePath = item.image && (item.image.startsWith('http') ? item.image : `../${item.image}`);
    return `
        <article class="card content-card marketing-item-card" data-aos="fade-up">
            ${imagePath ? `
            <div class="card-image-container">
                <img src="${imagePath}" alt="${item.title}" class="card-image">
                ${item.topic ? `<span class="card-category-badge topic-badge ${item.topic.toLowerCase().replace(/\s+/g, '-')}">${item.topic}</span>` : ''}
            </div>
            ` : ''}
            <div class="card-content">
                <h3 class="card-title"><a href="${item.details_link || '#'}">${item.title}</a></h3>
                <p class="card-excerpt">${item.summary}</p>
                <div class="card-meta">
                    <span class="meta-date"><i class="fas fa-calendar-alt"></i> ${formatDate(item.date)}</span>
                    ${item.content_type ? `<span class="meta-type"><i class="fas fa-file-alt"></i> ${item.content_type}</span>` : ''}
                </div>
                <div class="marketing-actions">
                    <a href="${item.details_link || '#'}" class="btn btn-link card-read-more">Read More <i class="fas fa-chevron-right"></i></a>
                    ${item.downloadable_resource_link ? `<a href="${item.downloadable_resource_link}" target="_blank" class="btn btn-outline download-resource-btn" title="${item.resource_title || 'Download Resource'}"><i class="fas fa-download"></i> ${item.resource_title ? 'PDF' : ''}</a>` : ''}
                </div>
            </div>
        </article>
    `;
}

// --- MAPPING TEMPLATES TO NAMES ---
const templateFunctions = {
    newsCard: createNewsCard,
    ewuSpotlightCard: createEWUSpotlightCard,
    eventCard: createEventCard,
    pastEventCard: (item) => createEventCard(item, false), // Wrapper for past events
    programmingTipCard: createProgrammingTipCard,
    pcTrickCard: createPcTrickCard,
    marketingCard: createMarketingCard,
    // Add more templates as needed
};


// --- CORE CONTENT LOADING LOGIC ---
let allFetchedData = {}; // Cache for fetched JSON data
let currentFilters = {}; // Store current filter state for each page/section
let currentPageStates = {}; // Store current page number for each section

/**
 * Loads and displays paginated content with filtering and sorting.
 * @param {string} jsonUrl - URL of the JSON data file.
 * @param {string} containerId - ID of the HTML container for items.
 * @param {string} paginationContainerId - ID of the HTML container for pagination controls.
 * @param {object} options - Configuration options.
 *         - itemsPerPage {number}
 *         - template {string} - Name of the template function to use.
 *         - filterFunction {function} - Optional custom filter function for items.
 *         - initialSort {object} - Optional: { field: 'date', order: 'desc' }
 *         - filterControls {object} - Optional: IDs of filter select/input elements.
 *         - onContentLoaded {function} - Optional callback after content is rendered.
 */
async function loadPaginatedContent(jsonUrl, containerId, paginationContainerId, options = {}) {
    const container = document.getElementById(containerId);
    const paginationContainer = document.getElementById(paginationContainerId);
    const loaderPlaceholder = container ? container.querySelector('.content-loader-placeholder') : null;

    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    // Initialize state for this section if not already present
    if (!currentFilters[containerId]) currentFilters[containerId] = {};
    if (!currentPageStates[containerId]) currentPageStates[containerId] = 1;

    let data = allFetchedData[jsonUrl];
    if (!data) {
        if (loaderPlaceholder) loaderPlaceholder.style.display = 'block';
        data = await fetchData(jsonUrl);
        if (data && Array.isArray(data)) {
            allFetchedData[jsonUrl] = data;
        } else {
            container.innerHTML = '<p class="error-message">Failed to load content. Please check your internet connection or try again later.</p>';
            if (loaderPlaceholder) loaderPlaceholder.style.display = 'none';
            return;
        }
    }
    
    if (loaderPlaceholder) loaderPlaceholder.style.display = 'none';

    let itemsToDisplay = [...data]; // Create a mutable copy

    // 1. Apply custom filter function (e.g., for upcoming/past events)
    if (typeof options.filterFunction === 'function') {
        itemsToDisplay = itemsToDisplay.filter(options.filterFunction);
    }

    // 2. Apply filters from filter controls (if provided)
    const activeFilters = currentFilters[containerId];
    if (options.filterControls) {
        Object.keys(options.filterControls).forEach(filterKey => {
            const filterValue = activeFilters[filterKey];
            if (filterValue && filterValue !== "") { // Check if filter has a value
                itemsToDisplay = itemsToDisplay.filter(item => {
                    if (Array.isArray(item[filterKey])) { // For tags array
                        return item[filterKey].map(v => String(v).toLowerCase()).includes(String(filterValue).toLowerCase());
                    }
                    return String(item[filterKey]).toLowerCase() === String(filterValue).toLowerCase();
                });
            }
        });
    }
    
    // 3. Apply sorting
    const sortOptions = activeFilters.sort || options.initialSort;
    if (sortOptions && sortOptions.field) {
        itemsToDisplay.sort((a, b) => {
            let valA = a[sortOptions.field];
            let valB = b[sortOptions.field];

            if (sortOptions.field === 'date') {
                valA = new Date(valA);
                valB = new Date(valB);
            } else if (typeof valA === 'string') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }

            if (valA < valB) return sortOptions.order === 'asc' ? -1 : 1;
            if (valA > valB) return sortOptions.order === 'asc' ? 1 : -1;
            return 0;
        });
    }


    // 4. Pagination
    const itemsPerPage = options.itemsPerPage || 6;
    const currentPage = currentPageStates[containerId];
    const totalPages = Math.ceil(itemsToDisplay.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = itemsToDisplay.slice(startIndex, endIndex);

    container.innerHTML = ''; // Clear previous items or loader
    if (paginatedItems.length === 0) {
        container.innerHTML = '<p class="no-results-message">No items match your criteria.</p>';
    } else {
        const templateFn = templateFunctions[options.template];
        if (typeof templateFn !== 'function') {
            console.error(`Template function "${options.template}" not found.`);
            container.innerHTML = '<p class="error-message">Error rendering content template.</p>';
            return;
        }
        paginatedItems.forEach(item => {
            container.innerHTML += templateFn(item);
        });
    }

    // 5. Render Pagination Controls
    if (paginationContainer) {
        renderPagination(paginationContainer, currentPage, totalPages, (page) => {
            currentPageStates[containerId] = page; // Update current page for this section
            loadPaginatedContent(jsonUrl, containerId, paginationContainerId, options); // Reload content for new page
            // Scroll to top of content container
            const headerOffset = document.getElementById('siteHeader')?.offsetHeight || 0;
            const elementPosition = container.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: elementPosition - headerOffset - 20, behavior: 'smooth' });
        });
    }

    // 6. Re-initialize AOS and run callback
    if (typeof AOS !== 'undefined') AOS.refreshHard(); // Use refreshHard if content structure changes significantly
    if (typeof options.onContentLoaded === 'function') {
        options.onContentLoaded();
    }
}


/**
 * Renders pagination buttons.
 * @param {HTMLElement} container - The pagination container element.
 * @param {number} currentPage - The current active page.
 * @param {number} totalPages - Total number of pages.
 * @param {function} onPageClick - Callback function when a page button is clicked.
 */
function renderPagination(container, currentPage, totalPages, onPageClick) {
    container.innerHTML = '';
    if (totalPages <= 1) return;

    const createButton = (text, pageNum, isActive = false, isDisabled = false) => {
        const button = document.createElement('button');
        button.innerHTML = text;
        if (isActive) button.classList.add('active');
        if (isDisabled) button.disabled = true;
        button.addEventListener('click', () => {
            if (!isDisabled && !isActive) onPageClick(pageNum);
        });
        return button;
    };

    // Previous button
    container.appendChild(createButton('<i class="fas fa-chevron-left"></i> Prev', currentPage - 1, false, currentPage === 1));

    // Page number buttons (simplified for brevity, can be made more complex with ellipses)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) endPage = Math.min(totalPages, 5);
    if (currentPage > totalPages - 3) startPage = Math.max(1, totalPages - 4);
    
    if (startPage > 1) {
        container.appendChild(createButton('1', 1));
        if (startPage > 2) container.appendChild(createButton('...', 0, false, true)); // Ellipsis
    }

    for (let i = startPage; i <= endPage; i++) {
        container.appendChild(createButton(i, i, i === currentPage));
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) container.appendChild(createButton('...', 0, false, true)); // Ellipsis
        container.appendChild(createButton(totalPages, totalPages));
    }
    
    // Next button
    container.appendChild(createButton('Next <i class="fas fa-chevron-right"></i>', currentPage + 1, false, currentPage === totalPages));
}

/**
 * Sets up event listeners for filter controls.
 * @param {object} filterControls - Object mapping filter keys to their element IDs.
 * @param {string} jsonUrl - URL of JSON data for reloading.
 * @param {string} containerId - ID of the content container.
 * @param {string} paginationId - ID of the pagination container.
 * @param {object} loadOptions - Options to pass to loadPaginatedContent.
 */
function setupFilterListeners(filterControls, jsonUrl, containerId, paginationId, loadOptions) {
    if (!filterControls) return;

    const applyFilters = () => {
        currentPageStates[containerId] = 1; // Reset to first page on filter change
        Object.keys(filterControls).forEach(key => {
            const element = document.getElementById(filterControls[key]);
            if (element && key !== 'applyButton') { // Exclude the button itself from values
                currentFilters[containerId][key] = element.value;
            }
        });
        loadPaginatedContent(jsonUrl, containerId, paginationId, loadOptions);
    };

    Object.values(filterControls).forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            if (element.tagName === 'SELECT') {
                element.addEventListener('change', () => {
                    // If there's no apply button, filter on change. Otherwise, wait for button.
                    if (!filterControls.applyButton) {
                        applyFilters();
                    }
                });
            } else if (element.tagName === 'BUTTON' && elementId === filterControls.applyButton) {
                element.addEventListener('click', applyFilters);
            }
        }
    });

    // Also populate filter dropdowns dynamically if needed (e.g., university list)
    // This is an advanced step, for now, assume static options or manually populated.
    // Example: populateFilterOptions(jsonUrl, filterControls.university, 'university');
}


/**
 * Loads a limited number of items without pagination (e.g., for homepage sections).
 * @param {string} jsonUrl - URL of the JSON data file.
 * @param {string} containerId - ID of the HTML container.
 * @param {object} options - Configuration options.
 *         - limit {number} - Max number of items to display.
 *         - template {string} - Name of the template function.
 *         - filter {function} - Optional filter function.
 *         - sort {object} - Optional: { field: 'date', order: 'desc' }
 *         - onContentLoaded {function} - Optional callback.
 */
async function loadContent(jsonUrl, containerId, options = {}) {
    const container = document.getElementById(containerId);
    const loaderPlaceholder = container ? container.querySelector('.content-loader-placeholder') : null;

    if (!container) {
        console.error(`Container with ID "${containerId}" not found for loadContent.`);
        return;
    }
    if (loaderPlaceholder) loaderPlaceholder.style.display = 'block';

    let data = allFetchedData[jsonUrl];
    if (!data) {
        data = await fetchData(jsonUrl);
        if (data && Array.isArray(data)) {
            allFetchedData[jsonUrl] = data;
        } else {
            container.innerHTML = '<p class="error-message">Failed to load content.</p>';
            if (loaderPlaceholder) loaderPlaceholder.style.display = 'none';
            return;
        }
    }
    if (loaderPlaceholder) loaderPlaceholder.style.display = 'none';

    let itemsToDisplay = [...data];

    if (typeof options.filter === 'function') {
        itemsToDisplay = itemsToDisplay.filter(options.filter);
    }

    if (options.sort && options.sort.field) {
        itemsToDisplay.sort((a, b) => {
            let valA = a[options.sort.field];
            let valB = b[options.sort.field];
            if (options.sort.field === 'date') {
                valA = new Date(valA); valB = new Date(valB);
            }
            if (valA < valB) return options.sort.order === 'asc' ? -1 : 1;
            if (valA > valB) return options.sort.order === 'asc' ? 1 : -1;
            return 0;
        });
    }

    if (options.limit) {
        itemsToDisplay = itemsToDisplay.slice(0, options.limit);
    }

    container.innerHTML = '';
    if (itemsToDisplay.length === 0) {
        container.innerHTML = '<p class="no-results-message">No content available.</p>';
    } else {
        const templateFn = templateFunctions[options.template];
        if (typeof templateFn !== 'function') {
            console.error(`Template function "${options.template}" not found.`);
            container.innerHTML = '<p class="error-message">Error rendering template.</p>';
            return;
        }
        itemsToDisplay.forEach(item => {
            container.innerHTML += templateFn(item);
        });
    }

    if (typeof AOS !== 'undefined') AOS.refreshHard();
    if (typeof options.onContentLoaded === 'function') {
        options.onContentLoaded();
    }
}


// --- INITIALIZATION LOGIC (called from individual HTML pages) ---
// This is where you'd call loadPaginatedContent or loadContent based on the page.
// Example (will be in the <script> tag of relevant HTML files):
/*
document.addEventListener('DOMContentLoaded', () => {
    // For CSE News Page
    if (document.getElementById('cse-news-items-container')) {
        const cseNewsOptions = {
            itemsPerPage: 9,
            template: 'newsCard',
            initialSort: { field: 'date', order: 'desc' },
            filterControls: {
                university: 'universityFilter', // Assumes <select id="universityFilter">
                category: 'categoryFilter',
                sort: 'sortBy',
                applyButton: 'applyFiltersBtn'
            },
            onContentLoaded: () => console.log('CSE News loaded!')
        };
        setupFilterListeners(cseNewsOptions.filterControls, '../data/cse_department_news.json', 'cse-news-items-container', 'cse-news-pagination', cseNewsOptions);
        // Initial load
        loadPaginatedContent('../data/cse_department_news.json', 'cse-news-items-container', 'cse-news-pagination', cseNewsOptions);
    }

    // For Index Page - Latest News (no pagination, limited items)
    if (document.getElementById('latest-news-container')) {
        loadContent('../data/cse_department_news.json', 'latest-news-container', {
            limit: 3,
            template: 'newsCard',
            sort: { field: 'date', order: 'desc' }
        });
    }
    // For Index Page - Featured EWU (no pagination, limited, specific filter)
    if (document.getElementById('featured-ewu-container')) { // Assuming you add this ID
        loadContent('../data/ewu_news.json', 'featured-ewu-container', {
            limit: 1, // Show one featured EWU item
            template: 'ewuSpotlightCard', // A specific template for this
            filter: (item) => item.isSpotlight === true, // Assuming 'isSpotlight' flag in ewu_news.json
            sort: { field: 'date', order: 'desc' }
        });
    }
});
*/