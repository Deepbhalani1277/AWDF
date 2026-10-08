import "./Header.css";

function Header(props) {
  return (
    <header className="header">
      <h1>{props.title}</h1>
      <p className="subtitle">{props.subtitle}</p>
      {props.tagline && <p className="tagline">{props.tagline}</p>}
    </header>
  );
}

export default Header;
