import "./About.css";

function About(props) {
  return (
    <section id="about" className="about">
      <h2>Who Am I</h2>
      <p><strong>Name:</strong> {props.name}</p>
      <p><strong>Institution:</strong> {props.college}</p>
      <p className="bio">
        Passionate about building responsive, accessible, and modern web interfaces.
        Currently exploring React, modern JavaScript frameworks, Express REST APIs, and component-driven full-stack development.
      </p>
    </section>
  );
}

export default About;
