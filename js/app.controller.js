import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { storageService } from './services/storage.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onGetSearchLoc = onGetSearchLoc;

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready');
    })
    .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker() {
  console.log('Adding a marker');
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs);
    document.querySelector('.locs').innerText = JSON.stringify(locs);
  });
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords);
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
    })
    .catch((err) => {
      console.log('err!!!', err);
    });
}
function onPanTo(value) {
  console.log('Panning the Map');
  onGetSearchLoc(value).then((res) => mapService.panTo(res.lat, res.lng));
}

function onGetSearchLoc(adress) {
  console.log(adress);
//   const locations = storageService.loadFromStorage('locations') || {};
  if (location[adress]) return Promise.resolve(location[adress]);
  var searchLoc = fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${adress},+CA&key=AIzaSyDmDDO6BhTr0zAMYiCe19Iq7Suh_38fKQg`
  )
    .then((res) => res.json())
    .then((res) => res.results[0].geometry.location)
    .then((res) => {
     var currLoc = {
        name: adress,
        lat: res.lat,
        lng: res.lng,
        weather: `none`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      var locs = locService.updateLocs(currLoc);
      storageService.saveToStorage('locations', locs);
      return res;
    });
  return searchLoc;
}

function onRenderSavedLoc() {
  var elSavedLoc = document.querySelector('.saved-locations');
  locService.getLocs()
  .then(res => {
    var strHtml = ''
    res.forEach(element => {
      strHtml+= `<li>${element.name}</li>`      
    })
    elSavedLoc.innerHTML = strHtml
  })
}

onRenderSavedLoc()
