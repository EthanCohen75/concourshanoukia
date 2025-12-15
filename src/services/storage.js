const STORAGE_KEY = 'hanoukia-competition-data';
const VOTER_KEY = 'hanoukia-voter-id';

// Generate a simple UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Initialize default data structure
const initializeData = () => ({
  version: '1.0',
  adminCode: 'default-code-5786',
  hanoukiot: []
});

const storage = {
  // Get all data
  getData: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : initializeData();
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initializeData();
    }
  },

  // Save all data
  saveData: (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      // Check if quota exceeded
      if (error.name === 'QuotaExceededError') {
        alert('Stockage plein ! Impossible d\'ajouter plus de hanoukiot.');
      }
      return false;
    }
  },

  // Get voter ID (create if doesn't exist)
  getVoterId: () => {
    let voterId = localStorage.getItem(VOTER_KEY);
    if (!voterId) {
      voterId = generateUUID();
      localStorage.setItem(VOTER_KEY, voterId);
    }
    return voterId;
  },

  // Estimate storage usage
  estimateStorageSize: () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    // Return in MB
    return (total / (1024 * 1024)).toFixed(2);
  },

  // Clear all data (for testing/reset)
  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VOTER_KEY);
  }
};

export { storage, generateUUID };
