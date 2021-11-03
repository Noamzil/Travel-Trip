import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { storageService } from './services/storage.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onGetSearchLoc = onGetSearchLoc;
window.OnGoTo = OnGoTo;
window.OnRemoveLoc = OnRemoveLoc;
window.onCopyUrl = onCopyUrl;

function onInit() {
  onRenderSavedLoc();
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready');
    })
    .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker() {
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
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
  onGetSearchLoc(value).then((res) => {
    onRenderSavedLoc();
    mapService.panTo(res.lat, res.lng);
  });
}

function onGetSearchLoc(adress) {
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
  locService.getLocs().then((res) => {
    var strHtml = '';
    res.forEach((element) => {
      strHtml += `<li>${element.name} 
      <button onclick="OnGoTo(${element.lat},${element.lng})" class="btn-go-to">Go</button>
      <button onclick="OnRemoveLoc('${element.name}')" class="btn-remove-loc">Remove</button>
      </li>`;
    });
    elSavedLoc.innerHTML = strHtml;
  });
}

function OnGoTo(lat, lng) {
  mapService.panTo(lat, lng);
}

function OnRemoveLoc(str) {
  locService.getLocs().then((locs) => {
    var currLoc = locs.findIndex((loc) => {
      return str === loc.name;
    });

    locService.removeLoc(currLoc);
    onRenderSavedLoc();
    storageService.saveToStorage('locations', locs);
  });
}

function onCopyUrl() {
  var url = window.location.href;
  navigator.clipboard.writeText(url);
}
