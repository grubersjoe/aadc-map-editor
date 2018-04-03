import { DEBUG } from '../config';

const STORAGE_KEY = 'aadc-map-editor';

export function saveState(elems) {
  const serializedElems = JSON.stringify(elems);
  try {
    localStorage.setItem(STORAGE_KEY, serializedElems);
  } catch (err) {
    if (DEBUG) {
      console.warn(`Unable to save current state to local storage: ${err.message}`);
    }
  }
}

export function loadSavedState() {
  try {
    const serializedElems = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(serializedElems);
  } catch (err) {
    if (DEBUG) {
      console.warn(`Unable to load save state from local storage: ${err.message}`);
    }
    return {};
  }
}

export function removeSavedState() {
  localStorage.removeItem(STORAGE_KEY);
}
