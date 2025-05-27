# Code With Pritom - Bulk Newsletter Platform

## Project Owner
Arup Bhowmik Pritom
B.Sc. in Computer Science & Engineering (CSE), East West University (EWU)

## ✨ Project Vision
An interactive, visually appealing, fully responsive bulk newsletter platform primarily for CSE students across Bangladeshi universities, with a dedicated content stream for East West University (EWU) students.

## 🧰 Tech Stack
- HTML5
- CSS3 (Flexbox, Grid, Custom Properties)
- JavaScript (Vanilla)
- AOS (Animate on Scroll)
- Typed.js
- Swiper.js
- Font Awesome (for icons)

## 📁 File Structure Overview
- `index.html`: The main newsletter page.
- `about.html`: Basic "About Us" page.
- `contact.html`: Basic "Contact Us" page with a subscription form.
- `assets/css/style.css`: All custom styles.
- `assets/js/main.js`: All custom JavaScript.
- `assets/img/`: Contains images like logos. (Add your `logo.png` here)
- `assets/media/`: For your videos, audio, docs.
- `sections/`: Contains HTML snippet examples for how to structure content for different sections. The content in `index.html` is based on these structures.
- `libs/`: For locally hosted third-party libraries (if not using CDN).

## 🚀 Setup Instructions
1.  **Download/Clone:** Get all the files and place them in a folder on your computer.
2.  **Add Logo:** Create your `logo.png` and place it in the `assets/img/` folder. You can also add `ewu_logo.png` or other university logos.
3.  **Open in Browser:** Open `index.html` in your preferred web browser.

## ✍️ Adding or Editing Content Manually

### Main Page (`index.html`)
-   The `index.html` file is structured with HTML comments marking the beginning and end of each major section (e.g., `<!-- CSE NEWS SECTION START -->`).
-   To add new items (news, seminars, tips, etc.), copy the HTML structure of an existing item within that section and modify its content.
    -   For example, to add a new CSE news item, find an existing `<div class="news-item card">...</div>` block in the CSE News section, duplicate it, and change the text, links, and image paths.
    -   The `sections/` folder contains clean HTML snippet examples for each type of content item. You can use these as templates.

### Styling (`assets/css/style.css`)
-   Global styles, colors, fonts, and section-specific styles are defined here.
-   CSS variables are used for theming (e.g., dark mode, primary colors). You can adjust these at the top of the file.

### Interactivity (`assets/js/main.js`)
-   Handles dark/light mode, scroll animations (AOS), typed text animations, and sliders (Swiper).
-   New interactive elements would require adding or modifying JavaScript functions in this file.

### Media Content
-   **Images:** Place in `assets/img/` and update `src` attributes in HTML.
-   **Videos/Audio/Docs:** Place in `assets/media/` and update links.
-   **Embeds:** For YouTube, Spotify, etc., use their provided embed code and paste it into the relevant HTML content block. Ensure responsive embed styles (some are provided in `style.css`).

### Navigation
-   Main navigation links in the header (`<header> nav`) point to section IDs (e.g., `#cse-news`). Ensure your section `id` attributes match these links.

### Libraries
-   External libraries (AOS, Swiper, Typed.js, Font Awesome) are currently linked via CDN in `index.html` (mostly at the bottom, before `</body>`).
-   If you download these libraries to `libs/`, update the `<script>` and `<link>` tags in `index.html` to point to your local files.

## 💡 Future Enhancements
-   Backend integration for dynamic content and actual newsletter subscriptions.
-   Advanced filtering and search functionality.
-   User accounts and content submission.
-   Multi-language support (BN).

---
Happy Coding!
Code With Pritom Team