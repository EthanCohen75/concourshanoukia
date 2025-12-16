const StatsSummary = ({ stats, totalVotes, overallAverage }) => {
  return (
    <div className="stats-summary">
      <div className="summary-card">
        <div className="summary-value">{stats.length}</div>
        <div className="summary-label">Hanoukiot</div>
      </div>
      <div className="summary-card">
        <div className="summary-value">{totalVotes}</div>
        <div className="summary-label">Notes totales</div>
      </div>
      <div className="summary-card">
        <div className="summary-value">{overallAverage}</div>
        <div className="summary-label">Moyenne générale</div>
      </div>
    </div>
  );
};

export default StatsSummary;
