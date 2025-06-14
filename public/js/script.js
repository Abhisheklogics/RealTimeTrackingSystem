let socket=io();

if(navigator.geolocation)
{
  navigator.geolocation.watchPosition((position)=>{
    let {latitude,longitude}=position.coords
    socket.emit('send-location',{latitude,longitude})
  },
(error)=>{

    console.log(error)
},
{
    enableHighAccuracy:true,
    maximumAge:0,
    timeout:2000

}
)
}
let map=L.map('map').setView([0,0],10)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:'Abhishek kumar Tracking System'
}).addTo(map);
let markers={}
socket.on('location-send',(data)=>{
let {id,latitude,longitude}=data
map.setView([latitude,longitude],19)
if(markers[id])
{
markers[id].setLatLng([latitude,longitude])
}
else{
  markers[id]=L.marker([latitude,longitude]).addTo(map)  
}
})

socket.on('user-disconnected',(id)=>{
    if(markers[id])
    {
      map.removeLayer(markers[id])
      delete markers[id]
    }

})




// let socket = io();

// let map = L.map('map').setView([0, 0], 16);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: 'Abhishek Kumar Tracking System'
// }).addTo(map);

// let startLatLng = null;
// let userMarker = null;
// let rangeCircle = null;
// let lastAlertTime = 0;
// let alertPopup = null;

// if (navigator.geolocation) {
//   navigator.geolocation.watchPosition(
//     (position) => {
//       let { latitude, longitude } = position.coords;

//       // Emit to server
//       socket.emit('send-location', { latitude, longitude });

//       const currentLatLng = L.latLng(latitude, longitude);

//       if (!startLatLng) {
//         startLatLng = currentLatLng;

//         userMarker = L.marker(currentLatLng).addTo(map);

//         rangeCircle = L.circle(startLatLng, {
//           radius: 2, 
//           color: 'green',
//           fillOpacity: 0.1
//         }).addTo(map);

//         map.setView(currentLatLng, 16);
//       } else {
//         userMarker.setLatLng(currentLatLng);
//         map.setView(currentLatLng);

//         const distance = currentLatLng.distanceTo(startLatLng);
//         console.log(` Distance: ${distance.toFixed(2)} meters`);

//         const now = Date.now();

//         if (distance > 2 && now - lastAlertTime > 3000) {
//           lastAlertTime = now;

          
//           if (alertPopup) {
//             map.removeLayer(alertPopup);
//           }

          
//          alertPopup = L.popup()
//   .setLatLng(currentLatLng)
//   .setContent(
//     `<b>Aram se 😊</b><br/>
//      Lagta hai aap 2 meter ki limit ke bahar aa gaye hain.<br/>
//      Zarurat ho to wapas aa jaiye, koi jaldi nahi hai!`
//   )
//   .openOn(map);
//         }
//       }
//     },
//     (error) => {
//       console.error("Geolocation error:", error);
//     },
//     {
//       enableHighAccuracy: true,
//       maximumAge: 0,
//       timeout: 2000
//     }
//   );
// }
