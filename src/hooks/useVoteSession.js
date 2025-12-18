import { useState, useCallback } from 'react';
import useHanoukiot from './useHanoukiot';
import useVoter from './useVoter';

const useVoteSession = () => {
  const { hanoukiot, submitAllVotes, tempVotes, saveTempVote, removeTempVote } = useHanoukiot();
  const voterId = useVoter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vérifier si toutes les hanoukiots sont notées
  const allVoted = Object.keys(tempVotes).length === hanoukiot.length;

  // Soumettre tous les votes
  const submitAll = useCallback(async () => {
    if (!allVoted || !voterId) return;

    setIsSubmitting(true);
    try {
      // Transformer en format pour l'API
      const votes = Object.entries(tempVotes).map(([hanoukiaId, rating]) => ({
        hanoukiaId,
        rating
      }));

      await submitAllVotes(voterId, votes);
    } catch (error) {
      console.error('Error submitting all votes:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [allVoted, voterId, tempVotes, submitAllVotes]);

  return {
    tempVotes,
    saveTempVote,
    removeTempVote,
    allVoted,
    submitAll,
    isSubmitting,
    votesCount: Object.keys(tempVotes).length
  };
};

export default useVoteSession;
