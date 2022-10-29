function showSponsorDataForm() {
    if (document.getElementById("ownerSponsorInscriptionRadio").checked) {
        document.getElementById("sponsorData").style.display = 'block'
    } else {
        document.getElementById("sponsorData").style.display = 'none'
    }
}

function signup() {
    const dni = document["signupForm"]["dniInput"].value
    const name = document["signupForm"]["nameInput"].value
    const lastname = document["signupForm"]["lastnameInput"].value
    const age = document["signupForm"]["ageInput"].value

    if (dni === "" || name === "" || lastname === "" || age === "") {
        console.log(dni)
        alert("Please complete the data")
        return
    }

    if (document.getElementById("ownerSponsorInscriptionRadio").checked) {
        const sponsorName = document.getElementById("sponsorNameInput").value
        const sponsorDescription = document.getElementById("sponsorDescriptionInput").value

        if (sponsorName === "" || sponsorDescription === "") {
            alert("Please complete the sponsor data")
            return
        }
    }

    alert("Enrollment successfully!")
}