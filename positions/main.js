const map = L.map('map').setView([-34.5223902,-58.7002308], 17);
const markers = []
const pathLines = []

window.addEventListener('load', () => {
    loadMap();
    loadPositions().then(r => console.log(r))
});

async function loadPositions() {
    let content = ""

    const positions = await searchPositions()

    for (let i = 0; i < positions.length; i++){
        const position = positions[i];

        content += `<button class="btn btn-light w-100 mb-2" type="button" onclick="showRunnerPerformance(${position.runnerId})"><b>Position nº${i + 1}: ${position.runner}</b><br />${position.time}</button>`;
    }

    document.getElementById("participantList").innerHTML = content
}

async function searchPositions() {
    let positions = []

    const runners = await searchRunners()

    for (const runner of runners) {
        const time = await findTimeByRunner(runner["id"])

        const position = {runnerId: runner.id, runner: `${runner.name} ${runner.surname}`, timeInSeconds: time, time: new Date(time * 1000).toISOString().slice(11, 19)}

        positions.push(position)
    }

    positions.sort((a, b) => a.timeInSeconds - b.timeInSeconds)

    return positions
}

async function findTimeByRunner(runnerId) {
    const track = await findTrackByRunner(runnerId)

    const firstTrack = track[0]
    const lastTrack = track[track.length - 1]

    const firstDateTime = new Date(firstTrack["timeStamp"])
    const lastDateTime = new Date(lastTrack["timeStamp"])

    return Math.floor((lastDateTime - firstDateTime) / 1000);
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

async function searchRunners() {
    const response = await fetch('https://fasterthanall.herokuapp.com/api/tracks/42/runners')

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    const values = await response.json()

    return values['runners']
}

function showRunnerPerformance(runnerId) {
    clearMap()

    findTrackByRunner(runnerId)
        .then(checkpoints => pinCheckpoints(checkpoints))
        .catch(reason => console.error(reason))
}

function pinCheckpoints(checkpoints) {
    for (let index = 0; index < checkpoints.length; index++) {
        const checkpoint = checkpoints[index];
        
        const dateTime = new Date(checkpoint['timeStamp']).toUTCString();
        const latitude = checkpoint['coordinate']['lat']
        const longitude = checkpoint['coordinate']['lon']

        setTimeout(() => addPinOnMap(dateTime, latitude, longitude), 2000 * (index + 1))
    }
}

function clearMap() {
    markers.forEach(marker => map.removeLayer(marker))
    markers.splice(0, markers - 1);

    pathLines.forEach(line => map.removeLayer(line))
    pathLines.splice(0, pathLines - 1);
}

function addPinOnMap(description, latitude, longitude) {
    console.log("pin")

    const marker = L.marker([latitude, longitude])
                    .addTo(map)
                    .bindPopup(description)
                    .openPopup();

    markers.push(marker)
}

function loadMap() {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}