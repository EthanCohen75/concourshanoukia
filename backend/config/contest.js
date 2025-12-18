/**
 * Configuration du concours
 */

// Date de clôture du concours: 19/12/2025 à 14H00 (heure de Paris)
const CONTEST_DEADLINE = new Date('2025-12-19T14:00:00+01:00');

/**
 * Vérifier si le concours est clôturé
 */
function isContestClosed() {
  return new Date() > CONTEST_DEADLINE;
}

/**
 * Obtenir la date de clôture formatée
 */
function getDeadlineFormatted() {
  return CONTEST_DEADLINE.toLocaleString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

module.exports = {
  CONTEST_DEADLINE,
  isContestClosed,
  getDeadlineFormatted
};
