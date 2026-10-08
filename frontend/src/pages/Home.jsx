import Header from "../components/Header";
import About from "../components/About";
import Skills from "../components/Skills";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <Header
        title="Student Developer Portfolio"
        subtitle="Full-Stack Web Development with React & Express"
        tagline="Advanced Web Development Frameworks (AWDF) - Sem 5"
      />

      <div className="container">
        <About
          name="Deep Bhalani"
          college="Charotar University of Science and Technology - CSE"
        />

        <Skills
          skill1="JavaScript (ES6+)"
          skill2="React.js & Router"
          skill3="Node.js & Express"
          skill4="RESTful APIs & Mongoose"
        />

        <div className="portfolio-overview">
          <h2>Academic Practicals Overview</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <h3>Practical 1</h3>
              <p>Modular component architecture using props, functional components, and CSS.</p>
            </div>
            <div className="overview-card">
              <h3>Practical 2</h3>
              <p>Multi-page navigation with React Router and state management using useState.</p>
              <Link to="/projects" className="card-link">View Projects &rarr;</Link>
            </div>
            <div className="overview-card">
              <h3>Practical 3</h3>
              <p>Asynchronous REST API consumption with GitHub API, search filtering, and state handlers.</p>
              <Link to="/repositories" className="card-link">Explore Repos &rarr;</Link>
            </div>
            <div className="overview-card">
              <h3>Practical 4</h3>
              <p>RESTful API backend in Express with middleware pipeline and in-memory CRUD operations.</p>
              <Link to="/tasks" className="card-link">Manage Tasks &rarr;</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
