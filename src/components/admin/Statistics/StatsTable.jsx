const StatsTable = ({ sortedStats, sortBy, handleSort, getSortIcon }) => {
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
              onClick={() => handleSort('totalVotes')}
              className={sortBy === 'totalVotes' ? 'sorted' : ''}
            >
              Nombre de notes {getSortIcon('totalVotes')}
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
            <tr key={stat.id}>
              <td className="col-number">
                <strong>Hanoukia {stat.number}</strong>
              </td>
              <td className="col-votes">
                {stat.totalVotes} {stat.totalVotes === 1 ? 'note' : 'notes'}
              </td>
              <td className="col-average">
                <div className="rating-display">
                  <span className="rating-value">{stat.averageRating}</span>
                  <span className="rating-max">/ 10</span>
                  {stat.totalVotes > 0 && (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatsTable;
