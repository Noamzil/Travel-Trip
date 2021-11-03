import { storageService } from './storage.service.js';

export const locService = {
  getLocs,
  updateLocs,
};

const locs = storageService.loadFromStorage(`locations`) || []

function getLocs() {
  return new Promise((resolve, reject) => resolve(locs));
}

function updateLocs(loc) {
  locs.push(loc);
  console.log(`locs`, locs);
  return locs;
}
