const StatsSummary = ({ stats, totalVoters, topHanoukia }) => {
  return (
    <div className="stats-summary">
      <div className="summary-card">
        <div className="summary-value">{stats.length}</div>
        <div className="summary-label">Hanoukiot</div>
      </div>

      <div className="summary-card">
        <div className="summary-value">{totalVoters}</div>
        <div className="summary-label">Votants</div>
      </div>

      <div className="summary-card summary-card-podium">
        <div className="summary-icon">🥇</div>
        {topHanoukia ? (
          <>
            <div className="summary-value">Hanoukia {topHanoukia.number}</div>
            <div className="summary-label">{topHanoukia.averageRating}/10</div>
          </>
        ) : (
          <div className="summary-label">Aucun vote</div>
        )}
      </div>
    </div>
  );
};

export default StatsSummary;
