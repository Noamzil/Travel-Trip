import { storageService } from './storage.service.js';

export const locService = {
  getLocs,
  updateLocs,
  removeLoc
};

const locs = storageService.loadFromStorage(`locations`) || []

function getLocs() {
  return new Promise((resolve, reject) => resolve(locs));
}

function updateLocs(loc) {
  locs.push(loc);
  return locs;
}

function removeLoc(idx) {
  locs.splice(idx,1)
}