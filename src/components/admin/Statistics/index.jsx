import StatsSummary from './StatsSummary';
import StatsTable from './StatsTable';
import useStatistics from './useStatistics';

const Statistics = () => {
  const {
    stats,
    sortedStats,
    loading,
    sortBy,
    handleSort,
    getSortIcon,
    totalVoters,
    topHanoukia,
  } = useStatistics();

  if (loading) {
    return (
      <div className="statistics-loading">
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="statistics-empty">
        <p>Aucune statistique disponible</p>
      </div>
    );
  }

  return (
    <div className="statistics">
      <h2>Statistiques du Concours</h2>

      <StatsSummary
        stats={stats}
        totalVoters={totalVoters}
        topHanoukia={topHanoukia}
      />

      <StatsTable
        sortedStats={sortedStats}
        sortBy={sortBy}
        handleSort={handleSort}
        getSortIcon={getSortIcon}
      />

      <div className="stats-footer">
        <p className="info-text">
          💡 Cliquez sur les en-têtes de colonne pour trier | Cliquez sur une ligne pour voir les détails
        </p>
      </div>
    </div>
  );
};

export default Statistics;
