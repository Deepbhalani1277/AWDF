import "./Projects.css";

function Projects() {
  return (
    <div className="projects">
      <h1>My Projects</h1>
      <p className="projects-subtitle">
        Curated showcase of web development projects developed during academic coursework.
      </p>

      <div className="project-grid">
        <div className="project-card">
          <h2>React Developer Portfolio</h2>
          <p>
            A responsive single-page application built with React, modular functional components, props drilling, and custom CSS styling.
          </p>
          <span className="tech-badge">React &bull; CSS3 &bull; Vite</span>
        </div>

        <div className="project-card">
          <h2>GitHub Repositories Explorer</h2>
          <p>
            An asynchronous REST API client fetching real-time repositories from GitHub, featuring live keyword search, dynamic loaders, and error states.
          </p>
          <span className="tech-badge">React &bull; REST API &bull; Axios</span>
        </div>

        <div className="project-card">
          <h2>Task Manager REST API</h2>
          <p>
            A robust Express.js backend with in-memory CRUD operations, middleware pipeline (logging, error handling, content validation), and Postman test coverage.
          </p>
          <span className="tech-badge">Node.js &bull; Express &bull; REST</span>
        </div>

        <div className="project-card">
          <h2>Interactive Contact Form</h2>
          <p>
            A reactive contact form with dynamic character counting, form input sanitization, and collapsible contextual help.
          </p>
          <span className="tech-badge">React &bull; useState &bull; Forms</span>
        </div>
      </div>
    </div>
  );
}

export default Projects;
