export const getFromStorage = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
};

export const saveToStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};
