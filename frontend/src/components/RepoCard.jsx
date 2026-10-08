import "./RepoCard.css";

function RepoCard({ repo }) {
  return (
    <div className="repo-card">
      <div className="repo-card-header">
        <h2>{repo.name}</h2>
        <span className="star-badge">⭐ {repo.stargazers_count} stars</span>
      </div>
      <p>{repo.description || "No description provided."}</p>
      <div className="repo-card-footer">
        <span className="lang-tag">
          Language: {repo.language || "Not Specified"}
        </span>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
        >
          View Repository &rarr;
        </a>
      </div>
    </div>
  );
}

export default RepoCard;
