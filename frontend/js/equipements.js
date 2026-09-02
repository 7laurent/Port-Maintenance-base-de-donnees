const equipements = [

    {
        code: "LOC-OMP-01",
        name: "Locomotive OMP-01",
        category: "Locomotive",
        manufacturer: "Constructeur A",
        model: "L-2000",
        serial: "SER-001",
        commissioning: "15/01/2024",
        location: "Atelier ferroviaire",
        status: "En service",
        criticality: "Critique",
        hours: "12500",
        lastMaintenance: "15/08/2026",
        nextMaintenance: "15/09/2026",
        specifications: "Puissance 2000 kW, moteur diesel.",
        documents: "Manuel constructeur L-2000"
    },

    {
        code: "CAT-01",
        name: "Chargeuse CAT-01",
        category: "Chargeuse",
        manufacturer: "Caterpillar",
        model: "CAT 950",
        serial: "CAT-45821",
        commissioning: "10/05/2023",
        location: "Zone minerai",
        status: "En maintenance",
        criticality: "Haute",
        hours: "8750",
        lastMaintenance: "20/08/2026",
        nextMaintenance: "20/09/2026",
        specifications: "Chargeuse diesel hydraulique.",
        documents: "Manuel CAT 950"
    },

    {
        code: "CV-01",
        name: "Convoyeur CV-01",
        category: "Convoyeur",
        manufacturer: "Constructeur B",
        model: "CV-500",
        serial: "CV-0098",
        commissioning: "03/03/2022",
        location: "Quai 1",
        status: "En service",
        criticality: "Critique",
        hours: "15400",
        lastMaintenance: "10/08/2026",
        nextMaintenance: "10/09/2026",
        specifications: "Convoyeur de transport de minerai.",
        documents: "Documentation technique CV-500"
    }

];


const table =
    document.getElementById("dataTable");


function normalizeText(value) {

    return String(value ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


function badge(value) {

    const text =
        normalizeText(value);

    let color = "gray";


    if (
        text.includes("service") &&
        !text.includes("maintenance") &&
        !text.includes("hors")
    ) {

        color = "green";

    }


    if (
        text.includes("maintenance") ||
        text.includes("reserve")
    ) {

        color = "orange";

    }


    if (
        text.includes("arret") ||
        text.includes("hors service") ||
        text.includes("critique")
    ) {

        color = "red";

    }


    return `
        <span class="badge ${color}">
            ${value}
        </span>
    `;

}


/* TABLEAU */

function displayEquipements(data) {

    table.innerHTML = "";


    data.forEach((equipement, index) => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${equipement.code}
                </strong>
            </td>

            <td>
                ${equipement.name}
            </td>

            <td>
                ${equipement.category}
            </td>

            <td>
                ${equipement.manufacturer}
            </td>

            <td>
                ${equipement.location}
            </td>

            <td>
                ${badge(equipement.criticality)}
            </td>

            <td>
                ${badge(equipement.status)}
            </td>

            <td>

                <button
                    class="action-btn"
                    onclick="viewEquipement(${index})"
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

    const total =
        equipements.length;


    const active =
        equipements.filter(
            e => e.status === "En service"
        ).length;


    const stopped =
        equipements.filter(
            e =>
                e.status === "À l'arrêt" ||
                e.status === "Hors service"
        ).length;


    const maintenance =
        equipements.filter(
            e =>
                e.status === "En maintenance"
        ).length;


    document.getElementById("stat0")
        .textContent = total;

    document.getElementById("stat1")
        .textContent = active;

    document.getElementById("stat2")
        .textContent = stopped;

    document.getElementById("stat3")
        .textContent = maintenance;


    document.getElementById("circleTotal")
        .textContent = total;


    document.getElementById("legend1")
        .textContent = active;

    document.getElementById("legend2")
        .textContent = maintenance;

    document.getElementById("legend3")
        .textContent = stopped;

}


/* RECHERCHE */

function searchEquipements() {

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


    const found =
        equipements.filter(equipement => {

            return Object.values(equipement)
                .some(value =>
                    normalizeText(value)
                        .includes(query)
                );

        });


    if (found.length === 0) {

        results.innerHTML = `

            <div class="result">

                <strong>
                    Aucun résultat
                </strong>

                <small>
                    Aucun équipement ne correspond à votre recherche.
                </small>

            </div>

        `;

    }

    else {

        results.innerHTML =
            found.map(equipement => `

                <div
                    class="result"
                    onclick="viewEquipement(${equipements.indexOf(equipement)})"
                >

                    <strong>
                        ${equipement.code}
                    </strong>

                    <small>
                        ${equipement.name}
                        • ${equipement.category}
                        • ${equipement.status}
                    </small>

                </div>

            `).join("");

    }


    results.classList.add("show");

}


/* FILTRE */

function filterEquipements() {

    const value =
        normalizeText(
            document.getElementById("statusFilter").value
        );


    if (value === "all") {

        displayEquipements(equipements);

        return;

    }


    const filtered =
        equipements.filter(equipement =>
            normalizeText(equipement.status)
                .includes(value)
        );


    displayEquipements(filtered);

}


/* DETAILS */

function viewEquipement(index) {

    const equipement =
        equipements[index];


    const body =
        document.getElementById("detailsBody");


    body.innerHTML = `

        <span class="eyebrow">
            FICHE TECHNIQUE
        </span>

        <h2>
            ${equipement.code}
        </h2>


        <div class="details-grid">

            <div class="detail">
                <small>Désignation</small>
                <strong>${equipement.name}</strong>
            </div>

            <div class="detail">
                <small>Catégorie</small>
                <strong>${equipement.category}</strong>
            </div>

            <div class="detail">
                <small>Constructeur</small>
                <strong>${equipement.manufacturer}</strong>
            </div>

            <div class="detail">
                <small>Modèle</small>
                <strong>${equipement.model}</strong>
            </div>

            <div class="detail">
                <small>Numéro de série</small>
                <strong>${equipement.serial}</strong>
            </div>

            <div class="detail">
                <small>Mise en service</small>
                <strong>${equipement.commissioning}</strong>
            </div>

            <div class="detail">
                <small>Localisation</small>
                <strong>${equipement.location}</strong>
            </div>

            <div class="detail">
                <small>État</small>
                <strong>${equipement.status}</strong>
            </div>

            <div class="detail">
                <small>Criticité</small>
                <strong>${equipement.criticality}</strong>
            </div>

            <div class="detail">
                <small>Compteur</small>
                <strong>${equipement.hours}</strong>
            </div>

            <div class="detail">
                <small>Dernière maintenance</small>
                <strong>${equipement.lastMaintenance}</strong>
            </div>

            <div class="detail">
                <small>Prochaine maintenance</small>
                <strong>${equipement.nextMaintenance}</strong>
            </div>

            <div class="detail">
                <small>Caractéristiques techniques</small>
                <strong>${equipement.specifications}</strong>
            </div>

            <div class="detail">
                <small>Documents</small>
                <strong>${equipement.documents}</strong>
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


/* ENREGISTREMENT */

document
    .getElementById("dataForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const nouvelEquipement = {

                code:
                    document.getElementById("code").value,

                name:
                    document.getElementById("name").value,

                category:
                    document.getElementById("category").value,

                manufacturer:
                    document.getElementById("manufacturer").value,

                model:
                    document.getElementById("model").value,

                serial:
                    document.getElementById("serial").value,

                commissioning:
                    document.getElementById("commissioning").value,

                location:
                    document.getElementById("location").value,

                status:
                    document.getElementById("status").value,

                criticality:
                    document.getElementById("criticality").value,

                hours:
                    document.getElementById("hours").value,

                lastMaintenance:
                    document.getElementById("lastMaintenance").value,

                nextMaintenance:
                    document.getElementById("nextMaintenance").value,

                specifications:
                    document.getElementById("specifications").value,

                documents:
                    document.getElementById("documents").value

            };


            equipements.unshift(
                nouvelEquipement
            );


            displayEquipements(
                equipements
            );

            updateStatistics();


            this.reset();


            document
                .getElementById("formModal")
                .classList.remove("show");


            alert(
                "L'équipement a été enregistré avec succès."
            );

        }
    );


/* RECHERCHE */

document
    .getElementById("searchButton")
    .onclick = searchEquipements;


document
    .getElementById("searchInput")
    .addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                searchEquipements();

            }

        }
    );


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
    .addEventListener(
        "change",
        filterEquipements
    );


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

        document
            .getElementById("zoomTitle")
            .textContent =
            "Analyse de l'évolution du parc";


        document
            .getElementById("zoomBody")
            .innerHTML = `

                <div
                    class="chart"
                    style="height:430px"
                >

                    ${
                        document
                        .querySelector(".chart")
                        .innerHTML
                    }

                </div>

                <p class="help">

                    Cette analyse permet de suivre
                    l'évolution du parc d'équipements
                    au fil des mois.

                </p>

            `;


        document
            .getElementById("zoomModal")
            .classList.add("show");

    };


/* ZOOM ETAT */

document
    .getElementById("zoomStatus")
    .onclick = function() {

        document
            .getElementById("zoomTitle")
            .textContent =
            "Répartition détaillée du parc";


        document
            .getElementById("zoomBody")
            .innerHTML = `

                <div class="details-grid">

                    <div class="detail">

                        <small>
                            Total équipements
                        </small>

                        <strong>
                            ${equipements.length}
                        </strong>

                    </div>


                    <div class="detail">

                        <small>
                            En service
                        </small>

                        <strong>
                            ${
                                document
                                .getElementById("stat1")
                                .textContent
                            }
                        </strong>

                    </div>


                    <div class="detail">

                        <small>
                            En maintenance
                        </small>

                        <strong>
                            ${
                                document
                                .getElementById("stat3")
                                .textContent
                            }
                        </strong>

                    </div>


                    <div class="detail">

                        <small>
                            À l'arrêt
                        </small>

                        <strong>
                            ${
                                document
                                .getElementById("stat2")
                                .textContent
                            }
                        </strong>

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

        document
            .getElementById("zoomTitle")
            .textContent =
            "Liste complète des équipements";


        document
            .getElementById("zoomBody")
            .innerHTML = `

                <div style="overflow:auto">

                    <table>

                        ${
                            document
                            .querySelector("table")
                            .innerHTML
                        }

                    </table>

                </div>

            `;


        document
            .getElementById("zoomModal")
            .classList.add("show");

    };


/* FERMETURE */

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

        modal.addEventListener(
            "click",
            function(event) {

                if (event.target === modal) {

                    modal.classList.remove("show");

                }

            }
        );

    });


/* INITIALISATION */

displayEquipements(equipements);

updateStatistics();