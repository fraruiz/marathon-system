const map = L.map('map').setView([-34.5231018, -58.7026663], 15);


window.addEventListener('load', async () => {
    loadMap();
    addOfficesToView().then(r => console.log(r));
});


async function addOfficesToView() {
    const offices = await searchOffices()

    const officeField = document.getElementById("officeField")

    let content = ""

    offices.forEach(office => {
        content += `<button class="btn btn-light" type="button" onclick="showRunnerPerformance(${office.id})"><b>${office.name}</b><br> ${office.address}</button>`;
        addPinOnMap(office.name, office.latitude, office.longitude)
    })

    officeField.innerHTML = content
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

function addPinOnMap(description, latitude, longitude) {

    let officeIcon = L.icon({
        iconUrl: "officeIcon.webp",
        //markerColor: 'red'
     
      });

    L.marker([latitude, longitude], )
     .addTo(map)
     .bindPopup(description)
     .openPopup();
}