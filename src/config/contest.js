/**
 * Configuration du concours
 */

// Date de clôture du concours: 19/12/2025 à 14H00
export const CONTEST_DEADLINE = new Date('2025-12-19T14:00:00');

/**
 * Vérifier si le concours est clôturé
 */
export function isContestClosed() {
  return new Date() > CONTEST_DEADLINE;
}

/**
 * Obtenir la date de clôture formatée
 */
export function getDeadlineFormatted() {
  return CONTEST_DEADLINE.toLocaleString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
