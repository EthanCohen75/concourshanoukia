import { useState } from 'react';

const StatsTable = ({ sortedStats, sortBy, handleSort, getSortIcon }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (statId) => {
    setExpandedRow(expandedRow === statId ? null : statId);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="stats-table-container">
      <table className="stats-table">
        <thead>
          <tr>
            <th
              onClick={() => handleSort('number')}
              className={sortBy === 'number' ? 'sorted' : ''}
            >
              Numéro {getSortIcon('number')}
            </th>
            <th
              onClick={() => handleSort('totalNotations')}
              className={sortBy === 'totalNotations' ? 'sorted' : ''}
            >
              Nombre de notations {getSortIcon('totalNotations')}
            </th>
            <th
              onClick={() => handleSort('averageRating')}
              className={sortBy === 'averageRating' ? 'sorted' : ''}
            >
              Moyenne {getSortIcon('averageRating')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.map((stat) => (
            <>
              <tr
                key={stat.id}
                onClick={() => toggleRow(stat.id)}
                className={expandedRow === stat.id ? 'expanded' : 'clickable'}
              >
                <td className="col-number">
                  <strong>Hanoukia {stat.number}</strong>
                </td>
                <td className="col-votes">
                  {stat.totalNotations} {stat.totalNotations === 1 ? 'notation' : 'notations'}
                </td>
                <td className="col-average">
                  <div className="rating-display">
                    <span className="rating-value">{stat.averageRating}</span>
                    <span className="rating-max">/ 10</span>
                    {stat.totalNotations > 0 && (
                      <div className="rating-bar">
                        <div
                          className="rating-fill"
                          style={{ width: `${(parseFloat(stat.averageRating) / 10) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </td>
              </tr>

              {expandedRow === stat.id && stat.individualVotes && (
                <tr className="details-row">
                  <td colSpan="3">
                    <div className="vote-details">
                      <h4>Détails des votes - Hanoukia {stat.number}</h4>
                      <table className="details-table">
                        <thead>
                          <tr>
                            <th>Votant</th>
                            <th>Note</th>
                            <th>Date & Heure</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stat.individualVotes.map((vote) => (
                            <tr key={vote.voterNumber}>
                              <td>#{vote.voterNumber}</td>
                              <td className="vote-rating-cell">
                                <span className="rating-badge">{vote.rating}/10</span>
                              </td>
                              <td>{formatDate(vote.timestamp)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatsTable;
