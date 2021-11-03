export const mapService = {
  initMap,
  addMarker,
  panTo,
  mapCurrLoc,
};

var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
  return _connectGoogleApi().then(() => {
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    });
    mapCurrLoc(gMap);
  });
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  });
  return marker;
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng);
  gMap.panTo(laLatLng);
  showWeather(lat, lng);
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = 'AIzaSyB7s4U44Vnu4cEx-5L718YkaU0f3nGIUpk';
  var elGoogleApi = document.createElement('script');
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject('Google script failed to load');
  });
}

function mapCurrLoc(map) {
  map.addListener('click', (mapsMouseEvent) => {
    var loc = mapsMouseEvent.latLng.toJSON();
    panTo(loc.lat, loc.lng);
    addMarker(loc);
  });
}

function showWeather(lat, lng) {
  var weather = fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=8cf55e734e492b8f5471b3e0ba9472a3`
  )
    .then((res) => res.json())
    .then(
      (res) =>
        (document.querySelector(`.weather`).innerText = `${
          res.weather[0].description
        }, ${Math.round(res.main.temp - 272.15)}`)
    );
}
