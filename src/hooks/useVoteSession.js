import { useState, useCallback, useMemo } from 'react';
import useHanoukiot from './useHanoukiot';
import useVoter from './useVoter';

const useVoteSession = () => {
  const { hanoukiot, submitAllVotes, tempVotes, saveTempVote, removeTempVote, submittedVotes } = useHanoukiot();
  const voterId = useVoter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vérifier si toutes les hanoukiots sont notées
  const allVoted = Object.keys(tempVotes).length === hanoukiot.length;

  // Vérifier si l'utilisateur a déjà soumis des notes
  const hasSubmitted = Object.keys(submittedVotes).length > 0;

  // Vérifier si les votes ont changé par rapport à ceux soumis
  const votesChanged = useMemo(() => {
    if (!hasSubmitted) return false;

    // Comparer tempVotes avec submittedVotes
    const tempKeys = Object.keys(tempVotes);
    const submittedKeys = Object.keys(submittedVotes);

    // Si le nombre de votes diffère
    if (tempKeys.length !== submittedKeys.length) return true;

    // Vérifier si une note a changé
    for (const hanoukiaId of tempKeys) {
      if (tempVotes[hanoukiaId] !== submittedVotes[hanoukiaId]) {
        return true;
      }
    }

    return false;
  }, [tempVotes, submittedVotes, hasSubmitted]);

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
    votesCount: Object.keys(tempVotes).length,
    hasSubmitted,
    votesChanged
  };
};

export default useVoteSession;
