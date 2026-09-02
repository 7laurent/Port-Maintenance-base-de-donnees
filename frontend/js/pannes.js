const pannes = [

    {
        id: "PN-001",
        equipment: "Locomotive OMP-01",
        type: "Mécanique",
        severity: "Critique",
        date: "02/09/2026",
        priority: "Critique",
        status: "En réparation",

        location: "Atelier ferroviaire",
        reportedBy: "Opérateur OMP",
        symptoms: "Bruit anormal au niveau du système de freinage.",
        cause: "Usure probable des composants du système de freinage.",
        safety: "Consignation de la locomotive avant intervention.",
        notes: "Intervention prioritaire."
    },

    {
        id: "PN-002",
        equipment: "Convoyeur CV-01",
        type: "Électrique",
        severity: "Majeure",
        date: "01/09/2026",
        priority: "Haute",
        status: "En diagnostic",

        location: "Quai 1",
        reportedBy: "Superviseur maintenance",
        symptoms: "Arrêt intermittent du moteur.",
        cause: "Cause électrique en cours d'identification.",
        safety: "Couper l'alimentation avant diagnostic.",
        notes: ""
    },

    {
        id: "PN-003",
        equipment: "Chargeuse CAT-01",
        type: "Hydraulique",
        severity: "Moyenne",
        date: "30/08/2026",
        priority: "Moyenne",
        status: "Résolue",

        location: "Zone minerai",
        reportedBy: "Conducteur",
        symptoms: "Fuite hydraulique détectée.",
        cause: "Joint hydraulique défectueux.",
        safety: "Dépressuriser le circuit hydraulique.",
        notes: "Joint remplacé."
    }

];


const table = document.getElementById("dataTable");


function normalizeText(value) {

    return String(value ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


/* AFFICHER LE BADGE */

function badge(status) {

    const text = normalizeText(status);

    let color = "gray";

    if (
        text.includes("resolue") ||
        text.includes("cloturee")
    ) {
        color = "green";
    }

    else if (
        text.includes("diagnostic") ||
        text.includes("reparation")
    ) {
        color = "orange";
    }

    else if (
        text.includes("critique")
    ) {
        color = "red";
    }

    return `<span class="badge ${color}">${status}</span>`;

}


/* AFFICHER LE TABLEAU */

function displayPannes(data) {

    table.innerHTML = "";

    data.forEach((panne, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>
                <strong>${panne.id}</strong>
            </td>

            <td>
                ${panne.equipment}
            </td>

            <td>
                ${panne.type}
            </td>

            <td>
                ${badge(panne.severity)}
            </td>

            <td>
                ${panne.date}
            </td>

            <td>
                ${badge(panne.priority)}
            </td>

            <td>
                ${badge(panne.status)}
            </td>

            <td>

                <button
                    class="action-btn"
                    onclick="viewPanne(${index})"
                >
                    Voir
                </button>

            </td>

        `;

        table.appendChild(row);

    });

}


/* STATISTIQUES */

function updateStatistics() {

    const total = pannes.length;

    const open = pannes.filter(
        panne =>
            panne.status === "Ouverte" ||
            panne.status === "En diagnostic" ||
            panne.status === "En réparation"
    ).length;

    const critical = pannes.filter(
        panne =>
            panne.priority === "Critique" ||
            panne.severity === "Critique"
    ).length;

    const resolved = pannes.filter(
        panne =>
            panne.status === "Résolue" ||
            panne.status === "Clôturée"
    ).length;


    document.getElementById("stat0").textContent = total;

    document.getElementById("stat1").textContent = open;

    document.getElementById("stat2").textContent = critical;

    document.getElementById("stat3").textContent = resolved;

    document.getElementById("circleTotal").textContent = total;

    document.getElementById("legend1").textContent = resolved;

    document.getElementById("legend2").textContent = open;

    document.getElementById("legend3").textContent = critical;

}


/* RECHERCHE */

function searchPannes() {

    const input =
        document.getElementById("searchInput");

    const results =
        document.getElementById("searchResults");

    const query =
        normalizeText(input.value.trim());


    if (!query) {

        results.classList.remove("show");

        return;

    }


    const found = pannes.filter(panne => {

        return Object.values(panne).some(value =>
            normalizeText(value).includes(query)
        );

    });


    if (found.length === 0) {

        results.innerHTML = `

            <div class="result">

                <strong>
                    Aucun résultat
                </strong>

                <small>
                    Aucune panne ne correspond à votre recherche.
                </small>

            </div>

        `;

    }

    else {

        results.innerHTML = found.map(panne => `

            <div
                class="result"
                onclick="viewPanne(${pannes.indexOf(panne)})"
            >

                <strong>
                    ${panne.id}
                </strong>

                <small>
                    ${panne.equipment}
                    • ${panne.type}
                    • ${panne.status}
                </small>

            </div>

        `).join("");

    }


    results.classList.add("show");

}


/* FILTRE */

function filterPannes() {

    const value =
        normalizeText(
            document.getElementById("statusFilter").value
        );


    if (value === "all") {

        displayPannes(pannes);

        return;

    }


    const filtered = pannes.filter(panne =>
        normalizeText(panne.status).includes(value)
    );


    displayPannes(filtered);

}


/* VOIR UNE PANNE */

function viewPanne(index) {

    const panne = pannes[index];

    const body =
        document.getElementById("detailsBody");


    body.innerHTML = `

        <span class="eyebrow">
            FICHE DÉTAILLÉE
        </span>

        <h2>
            ${panne.id}
        </h2>

        <div class="details-grid">

            <div class="detail">
                <small>Équipement</small>
                <strong>${panne.equipment}</strong>
            </div>

            <div class="detail">
                <small>Type de panne</small>
                <strong>${panne.type}</strong>
            </div>

            <div class="detail">
                <small>Gravité</small>
                <strong>${panne.severity}</strong>
            </div>

            <div class="detail">
                <small>Date de détection</small>
                <strong>${panne.date}</strong>
            </div>

            <div class="detail">
                <small>Localisation</small>
                <strong>${panne.location}</strong>
            </div>

            <div class="detail">
                <small>Déclarée par</small>
                <strong>${panne.reportedBy}</strong>
            </div>

            <div class="detail">
                <small>Priorité</small>
                <strong>${panne.priority}</strong>
            </div>

            <div class="detail">
                <small>Statut</small>
                <strong>${panne.status}</strong>
            </div>

            <div class="detail">
                <small>Symptômes</small>
                <strong>${panne.symptoms}</strong>
            </div>

            <div class="detail">
                <small>Cause présumée</small>
                <strong>${panne.cause}</strong>
            </div>

            <div class="detail">
                <small>Sécurité</small>
                <strong>${panne.safety}</strong>
            </div>

            <div class="detail">
                <small>Observations</small>
                <strong>${panne.notes || "Aucune"}</strong>
            </div>

        </div>

    `;


    document
        .getElementById("detailsModal")
        .classList.add("show");

}


/* AJOUT */

document
    .getElementById("openAdd")
    .onclick = () => {

        document
            .getElementById("formModal")
            .classList.add("show");

    };


document
    .getElementById("closeForm")
    .onclick = () => {

        document
            .getElementById("formModal")
            .classList.remove("show");

    };


document
    .getElementById("cancelForm")
    .onclick = () => {

        document
            .getElementById("formModal")
            .classList.remove("show");

    };


/* ENREGISTRER */

document
    .getElementById("dataForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const nouvellePanne = {

            id:
                "PN-" +
                String(pannes.length + 1).padStart(3, "0"),

            equipment:
                document.getElementById("equipment").value,

            type:
                document.getElementById("failureType").value,

            severity:
                document.getElementById("severity").value,

            date:
                document.getElementById("date").value,

            priority:
                document.getElementById("priority").value,

            status:
                document.getElementById("status").value,

            location:
                document.getElementById("location").value,

            reportedBy:
                document.getElementById("reportedBy").value,

            symptoms:
                document.getElementById("symptoms").value,

            cause:
                document.getElementById("cause").value,

            safety:
                document.getElementById("safety").value,

            notes:
                document.getElementById("notes").value

        };


        pannes.unshift(nouvellePanne);


        displayPannes(pannes);

        updateStatistics();


        this.reset();


        document
            .getElementById("formModal")
            .classList.remove("show");


        alert("La panne a été enregistrée avec succès.");

    });


/* RECHERCHE */

document
    .getElementById("searchButton")
    .onclick = searchPannes;


document
    .getElementById("searchInput")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {

            searchPannes();

        }

    });


document
    .getElementById("clearSearch")
    .onclick = function() {

        document
            .getElementById("searchInput")
            .value = "";

        document
            .getElementById("searchResults")
            .classList.remove("show");

    };


/* FILTRE */

document
    .getElementById("statusFilter")
    .addEventListener("change", filterPannes);


/* HISTORIQUE */

document
    .getElementById("historyButton")
    .onclick = function() {

        window.location.href =
            "historique.html";

    };


/* ZOOM GRAPHIQUE */

document
    .getElementById("zoomChart")
    .onclick = function() {

        document.getElementById("zoomTitle").textContent =
            "Analyse de l'évolution des pannes";

        document.getElementById("zoomBody").innerHTML = `

            <div class="chart" style="height:430px">

                ${document.querySelector(".chart").innerHTML}

            </div>

            <p class="help">
                Cette vue permet d'analyser l'évolution
                des nouvelles pannes et des pannes résolues.
            </p>

        `;

        document
            .getElementById("zoomModal")
            .classList.add("show");

    };


/* ZOOM STATUT */

document
    .getElementById("zoomStatus")
    .onclick = function() {

        document.getElementById("zoomTitle").textContent =
            "Répartition détaillée des pannes";

        document.getElementById("zoomBody").innerHTML = `

            <div class="details-grid">

                <div class="detail">
                    <small>Total</small>
                    <strong>${pannes.length}</strong>
                </div>

                <div class="detail">
                    <small>Ouvertes / en cours</small>
                    <strong>${document.getElementById("stat1").textContent}</strong>
                </div>

                <div class="detail">
                    <small>Critiques</small>
                    <strong>${document.getElementById("stat2").textContent}</strong>
                </div>

                <div class="detail">
                    <small>Résolues</small>
                    <strong>${document.getElementById("stat3").textContent}</strong>
                </div>

            </div>

        `;

        document
            .getElementById("zoomModal")
            .classList.add("show");

    };


/* ZOOM TABLE */

document
    .getElementById("zoomTable")
    .onclick = function() {

        document.getElementById("zoomTitle").textContent =
            "Liste complète des pannes";

        document.getElementById("zoomBody").innerHTML = `

            <div style="overflow:auto">

                <table>

                    ${document.querySelector("table").innerHTML}

                </table>

            </div>

        `;

        document
            .getElementById("zoomModal")
            .classList.add("show");

    };


/* FERMETURE MODALS */

document
    .getElementById("closeZoom")
    .onclick = () => {

        document
            .getElementById("zoomModal")
            .classList.remove("show");

    };


document
    .getElementById("closeDetails")
    .onclick = () => {

        document
            .getElementById("detailsModal")
            .classList.remove("show");

    };


document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener("click", function(event) {

            if (event.target === modal) {

                modal.classList.remove("show");

            }

        });

    });


/* INITIALISATION */

displayPannes(pannes);

updateStatistics();