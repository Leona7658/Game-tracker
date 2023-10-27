const PROJECT_KEY = "IT_PROJECT";

export default {
  // add key to storage object
  setItem(key, val) {
    let storage = this.getStorage();
    storage[key] = val;
    window.localStorage.setItem(PROJECT_KEY, JSON.stringify(storage));
  },
  getItem(key) {
    return this.getStorage()[key];
  },
  getStorage() {
    return JSON.parse(window.localStorage.getItem(PROJECT_KEY) || "{}");
  },
  clearItem(key) {
    let storage = this.getStorage();
    delete storage[key];
    window.localStorage.setItem(PROJECT_KEY, JSON.stringify(storage));
  },
  clearAll() {
    window.localStorage.clear();
  },
};
