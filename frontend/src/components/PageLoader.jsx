import "./PageLoader.css";

function PageLoader({ message = "Loading page module..." }) {
  return (
    <div className="page-loader-container" role="status" aria-live="polite">
      <div className="page-loader-card">
        <div className="page-loader-spinner"></div>
        <div className="page-loader-pulse-bar"></div>
        <p className="page-loader-text">{message}</p>
        <span className="page-loader-hint">Splitting code & loading chunk on demand...</span>
      </div>
    </div>
  );
}

export default PageLoader;
