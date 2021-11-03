export const locService = {
  getLocs,
};

var gId = 101;

const locs = [
  {
    id: gId++,
    name: 'Neveragain',
    lat: 32.0472,
    lng: 34.832581,
    weather: `none`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: gId++,
    name: 'Greatplace',
    lat: 32.047104,
    lng: 34.832384,
    weather: `none`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs);
    }, 2000);
  });
}
