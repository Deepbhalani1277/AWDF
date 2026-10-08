import "./Skills.css";

function Skills(props) {
  return (
    <section id="skills" className="skills">
      <h2>Tech Stack &amp; Skills</h2>
      <div className="skills-grid">
        <div className="card">
          <h3>{props.skill1}</h3>
        </div>
        <div className="card">
          <h3>{props.skill2}</h3>
        </div>
        <div className="card">
          <h3>{props.skill3}</h3>
        </div>
        <div className="card">
          <h3>{props.skill4}</h3>
        </div>
      </div>
    </section>
  );
}

export default Skills;
