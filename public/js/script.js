// let socket=io();

// if(navigator.geolocation)
// {
//   navigator.geolocation.watchPosition((position)=>{
//     let {latitude,longitude}=position.coords
//     socket.emit('send-location',{latitude,longitude})
//   },
// (error)=>{

//     console.log(error)
// },
// {
//     enableHighAccuracy:true,
//     maximumAge:0,
//     timeout:5000

// }
// )
// }
// let map=L.map('map').setView([0,0],10)
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution:'Abhishek kumar Tracking System'
// }).addTo(map);
// let markers={}
// socket.on('location-send',(data)=>{
// let {id,latitude,longitude}=data
// map.setView([latitude,longitude],19)
// if(markers[id])
// {
// markers[id].setLatLng([latitude,longitude])
// }
// else{
//   markers[id]=L.marker([latitude,longitude]).addTo(map)  
// }
// })

// socket.on('user-disconnected',(id)=>{
//     if(markers[id])
//     {
//       map.removeLayer(markers[id])
//       delete markers[id]
//     }

// })




let socket = io();

let map = L.map('map').setView([0, 0], 18);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Abhishek Kumar Tracking System'
}).addTo(map);

let markers = {};
let startLatLng = null;
let userMarker = null;
let rangeCircle = null;
let isOutOfRange = false;

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      let { latitude, longitude } = position.coords;

      // Emit to server
      socket.emit('send-location', { latitude, longitude });

      const currentLatLng = L.latLng(latitude, longitude);

      // First location fix
      if (!startLatLng) {
        startLatLng = currentLatLng;

        // Place user's marker
        userMarker = L.marker(currentLatLng).addTo(map);

        // Show 2-meter radius circle
        rangeCircle = L.circle(startLatLng, {
          radius: 2,
          color: 'green',
          fillOpacity: 0.1
        }).addTo(map);

        map.setView(currentLatLng, 20);
      } else {
        // Update marker position
        userMarker.setLatLng(currentLatLng);
        map.setView(currentLatLng);

        // Calculate distance from starting point
        const distance = currentLatLng.distanceTo(startLatLng); // in meters
        console.log(`Distance from start: ${distance.toFixed(2)} meters`);

        // Alert if out of range
        if (distance > 2 && !isOutOfRange) {
          alert("Kaha jaa raha hai bahi ruk me abhi aa raha hu");
          isOutOfRange = true;
        } else if (distance <= 2 && isOutOfRange) {
          isOutOfRange = false; // reset alert when back inside
        }
      }
    },
    (error) => {
      console.error("Geolocation error:", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 2000
    }
  );
}
