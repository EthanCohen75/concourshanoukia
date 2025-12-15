import { useState, useMemo, useEffect } from 'react';
import useHanoukiot from '../../../hooks/useHanoukiot';

const useStatistics = () => {
  const { getStatistics } = useHanoukiot();
  const [sortBy, setSortBy] = useState('number');
  const [sortOrder, setSortOrder] = useState('asc');
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await getStatistics();
        setStats(data || []);
      } catch (error) {
        console.error('Error loading statistics:', error);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedStats = useMemo(() => {
    const sorted = [...stats].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'averageRating') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return sorted;
  }, [stats, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const totalVotes = stats.reduce((sum, s) => sum + s.totalVotes, 0);
  const overallAverage = stats.length > 0
    ? (stats.reduce((sum, s) => sum + parseFloat(s.averageRating) * s.totalVotes, 0) / totalVotes || 0).toFixed(2)
    : '0.00';

  return {
    stats,
    sortedStats,
    loading,
    sortBy,
    handleSort,
    getSortIcon,
    totalVotes,
    overallAverage,
  };
};

export default useStatistics;
