document.addEventListener('DOMContentLoaded', () => {

    const menu = document.getElementById('menu');
    const navbar = document.querySelector('.navbar');
    const scrollTopBtn = document.getElementById('scroll-top');

    // Mobile menu toggle
    if (menu) {
        menu.addEventListener('click', () => {
            menu.classList.toggle('fa-times');
            navbar.classList.toggle('nav-toggle');
        });
    }

    // Scroll and Load events
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleScroll);

    function handleScroll() {
        if (menu) menu.classList.remove('fa-times');
        if (navbar) navbar.classList.remove('nav-toggle');

        // Scroll Top Button
        if (window.scrollY > 60) {
            if (scrollTopBtn) scrollTopBtn.classList.add('active');
        } else {
            if (scrollTopBtn) scrollTopBtn.classList.remove('active');
        }

        // Scroll Spy
        document.querySelectorAll('section').forEach(section => {
            let height = section.offsetHeight;
            let offset = section.offsetTop - 200;
            let top = window.scrollY;
            let id = section.getAttribute('id');

            if (top > offset && top < offset + height) {
                document.querySelectorAll('.navbar ul li a').forEach(link => {
                    link.classList.remove('active');
                });
                const activeLink = document.querySelector(`.navbar ul li a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fetch and display skills
    async function fetchSkills() {
        try {
            const response = await fetch('./assets/data/skills.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const skills = await response.json();
            return skills;
        } catch (error) {
            console.error('Error fetching skills:', error);
            return [];
        }
    }

    async function displaySkills() {
        const skillsContainer = document.getElementById('skillsContainer');
        if (!skillsContainer) return;

        const skills = await fetchSkills();

        if (skills.length === 0) {
            skillsContainer.innerHTML = '<p>No skills found</p>';
            return;
        }

        const skillsHTML = skills.map(skill => `
            <div class="skill-card">
                <img src="${skill.icon}" alt="${skill.name}" />
                <span>${skill.name}</span>
            </div>
        `).join('');

        skillsContainer.innerHTML = skillsHTML;

        // Add hover animations
        const cards = document.querySelectorAll('.skill-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    displaySkills();

    // Simple typing effect
    const typedText = document.getElementById('typed-text');
    if (typedText) {
        const texts = ['Full Stack Development', 'Web Designing', 'Desktop Apps', 'Penetration Testing'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeWriter() {
            const currentText = texts[textIndex];
            if (isDeleting) {
                typedText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 30 : 100;
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            setTimeout(typeWriter, typeSpeed);
        }

        typeWriter();
    }

    // Visibility Change
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Anas MAKOUAR";
            const favicon = document.getElementById("favicon");
            if (favicon) favicon.href = "./assets/images/myPicture.jpg";
        } else {
            document.title = "Come Back To Portfolio";
            const favicon = document.getElementById("favicon");
            if (favicon) favicon.href = "./assets/images/myPicture.jpg"; // Keep same or change if needed
        }
    });

    // Disable developer mode keys (optional, keeping as requested in original)
    document.onkeydown = function (e) {
        if (e.keyCode == 123) return false;
        if (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'C'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0))) return false;
        if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
    }
});
