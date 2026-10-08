import "./Footer.css";

function Footer(props) {
  return (
    <footer id="footer" className="footer">
      <h2>{props.company || "Developer Portfolio"}</h2>
      <p>Student: Deep Bhalani | Charotar University of Science and Technology (CSE)</p>
      <p>Email: deep@portfolio.com | Course: AWDF (Sem 5)</p>
      <p className="copyright">&copy; {new Date().getFullYear()} AWDF Practical Fullstack Project</p>
    </footer>
  );
}

export default Footer;
