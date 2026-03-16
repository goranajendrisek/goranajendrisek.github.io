document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

// Toggle Mobile Menu
    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Accessibility update: Tell screen readers if the menu is open or closed
        const isExpanded = mobileMenu.getAttribute('aria-expanded') === 'true';
        mobileMenu.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-expanded', 'false'); // Reset accessibility state
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70, // Offset for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- BLOG LOADING LOGIC ---
    const blogContainer = document.getElementById('blog-posts-container');

    if (blogContainer) {
        fetch('blog.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(posts => {
                // Clear the "Loading..." text
                blogContainer.innerHTML = '';

                // Loop through each post in the JSON file
                posts.forEach(post => {
                    // Create the HTML structure for a card
                    const article = document.createElement('article');
                    article.classList.add('blog-card');
                    
                    // Combine paragraphs into one string
                    const contentHTML = post.content.map(paragraph => `<p>${paragraph}</p>`).join('');

                    article.innerHTML = `
                        <div class="blog-date">${post.date}</div>
                        <h3>${post.title}</h3>
                        <div class="blog-content">
                            ${contentHTML}
                        </div>
                    `;

                    // Add to the container
                    blogContainer.appendChild(article);
                });
            })
            .catch(error => {
                console.error('Error loading blog posts:', error);
                // Only show error if on a server, otherwise it might just be local file restriction
                if (window.location.protocol !== 'file:') {
                    blogContainer.innerHTML = '<p style="text-align:center;">Unable to load posts. Please check back later.</p>';
                } else {
                    blogContainer.innerHTML = '<p style="text-align:center;">(Blog posts require a server to load. Push to GitHub to view.)</p>';
                }
            });
    }
});