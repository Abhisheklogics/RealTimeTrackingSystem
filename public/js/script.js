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
    timeout:5000

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