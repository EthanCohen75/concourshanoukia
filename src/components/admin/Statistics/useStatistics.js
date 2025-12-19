import { useState, useMemo, useEffect } from 'react';
import useHanoukiot from '../../../hooks/useHanoukiot';

const useStatistics = () => {
  const { getStatistics } = useHanoukiot();
  const [sortBy, setSortBy] = useState('number');
  const [sortOrder, setSortOrder] = useState('asc');
  const [stats, setStats] = useState([]);
  const [totalVoters, setTotalVoters] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await getStatistics();
        // L'API retourne maintenant { statistics, totalVoters }
        setStats(data?.statistics || data || []);
        setTotalVoters(data?.totalVoters || 0);
      } catch (error) {
        console.error('Error loading statistics:', error);
        setStats([]);
        setTotalVoters(0);
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

  // Trouver la hanoukia en tête (meilleure moyenne)
  const topHanoukia = useMemo(() => {
    if (stats.length === 0) return null;
    return stats.reduce((max, stat) =>
      parseFloat(stat.averageRating) > parseFloat(max.averageRating) ? stat : max
    );
  }, [stats]);

  return {
    stats,
    sortedStats,
    loading,
    sortBy,
    handleSort,
    getSortIcon,
    totalVoters,
    topHanoukia,
  };
};

export default useStatistics;
