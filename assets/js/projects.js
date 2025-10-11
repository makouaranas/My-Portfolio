document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Fetch projects data
        const response = await fetch('./projects/projects.json');
        const projects = await response.json();

        // Get projects container
        const projectsContainer = document.getElementById('projects-container');

        // Add projects to the container
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="./assets/images/projects/${project.image}.png" 
                         alt="${project.name}"
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/400x200/667eea/ffffff?text=${encodeURIComponent(project.name)}'">
                </div>
                <div class="project-content">
                    <h3>${project.name}</h3>
                    <p>${project.desc}</p>
                    <div class="project-links">
                        <a href="${project.links.view}" target="_blank" class="btn">
                            <i class="fas fa-eye"></i> View Project
                        </a>
                        <a href="${project.links.code}" target="_blank" class="btn">
                            <i class="fab fa-github"></i> View Code
                        </a>
                    </div>
                </div>
            `;

            projectsContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
});