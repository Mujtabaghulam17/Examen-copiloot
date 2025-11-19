export const getInitialState = (key, defaultValue) => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);
        }
    } catch (error) {
        console.error(`Error reading ${key} from localStorage`, error);
    }
    return defaultValue;
};

// Spaced Repetition intervals in days
export const repetitionSchedule = [1, 3, 7, 14, 30, 60];