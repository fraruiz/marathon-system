const map = L.map('map').setView([-34.5231018, -58.7026663], 15);

window.addEventListener('load', async () => {
    loadMap();
    addRunnersToView().then(r => console.log(r));
});

async function addRunnersToView() {
    const runners = await searchRunners()

    const participantsField = document.getElementById("participantsField")

    let content = ""

    runners.forEach(runner => {
        content += `<button class="btn btn-light" type="button" onclick="showRunnerPerformance(${runner.id})">${runner.name} ${runner.surname}</button>`
    })

    participantsField.innerHTML = content
}

async function pinWebcams() {
    const webcams = await searchWebcams()

    webcams.forEach(webcam => {
        const id = webcam['id']
        const frequency = webcam['frecuency']
        const latitude = webcam['coordinate']['lat']
        const longitude = webcam['coordinate']['lon']
        const description = "Webcam " + id + " with frequency " + frequency

        addPinOnMap(description, latitude, longitude)
    })
}

async function searchWebcams() {
    const response = await fetch('https://fasterthanall.herokuapp.com/api/webcams/42')

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    const values = await response.json()

    return values['webcams']
}

async function searchRunners() {
    const response = await fetch('https://fasterthanall.herokuapp.com/api/tracks/42/runners')

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    const values = await response.json()

    return values['runners']
}

async function findTrackByRunner(runnerId) {
    const response = await fetch(`https://fasterthanall.herokuapp.com/api/replays/42/runner/${runnerId}`)

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    const values = await response.json()

    return values['positions']['checkpoints']
}

function showRunnerPerformance(runnerId) {
    findTrackByRunner(runnerId)
        .then(checkpoints => {
            checkpoints.forEach(checkpoint => {
                const dateTime = new Date(checkpoint['timeStamp']).toLocaleTimeString();
                console.log(dateTime)
                const latitude = checkpoint['coordinate']['lat']
                const longitude = checkpoint['coordinate']['lon']
        
                addPinOnMap(dateTime, latitude, longitude)
            })
        })
        .catch(reason => console.error(reason))


}

function addPinOnMap(description, latitude, longitude) {
    L.marker([latitude, longitude])
     .addTo(map)
     .bindPopup(description)
     .openPopup();
}

function loadMap() {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}
