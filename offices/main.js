const map = L.map('map').setView([-34.53115480258722, -58.739022175444376], 13);
let officeMarkers =  addOfficesToView();

window.addEventListener('load', async () => {
    loadMap();
});


async function addOfficesToView() {
    const offices = await searchOffices();

    const officeField = document.getElementById("officeField");

    let content = "";

    let markerList = [];
    

    offices.forEach(office => {
       
        let icon = L.icon({
            iconUrl: 'officeIcon.png',
            iconSize:     [60, 60], 
            iconAnchor:   [30, 60], 
            popupAnchor:  [0, -61] 
        });
        let marker = L.marker([office.latitude, office.longitude],{title: office.name, icon: icon}).addTo(map);
       

        map.addLayer(marker);
        marker.bindPopup(`<b>${office.name}</b><br />${office.address} <br> Horario: ${office.officeHours}`);
        
        content += `<button class="btn btn-light" type="button" onclick="centerMapToOffice('${office.name}')"><b>${office.name}</b><br />${office.address} <br> Horario: ${office.officeHours}</button>`;
        
        markerList.push(marker);

     
    });

    

    officeField.innerHTML = content
 
   
    map.closePopup();
    return markerList;
}

async function centerMapToOffice(officeName) {
   
    markerList = await officeMarkers;
    selectedOffice =  markerList.find((elem) => {
        if (elem.options.title == officeName) {
            return true;
        }
    });
    
    
    map.closePopup();
    map.flyTo(selectedOffice.getLatLng(), 15);
    selectedOffice.openPopup();
  
    
}



async function searchOffices() {
    const response = await fetch('offices.json')

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    const values = await response.json()

    return values['offices']
}


function loadMap() {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}
