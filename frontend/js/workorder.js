/* =====================================================
   DONNÉES DES WORK ORDERS
===================================================== */

const workOrders = [

    {
        id: "WO-001",
        equipment: "Locomotive OMP-01",
        type: "Corrective",
        technician: "Jean Mba",
        priority: "Haute",
        date: "2026-08-28",
        status: "En cours",
        description: "Réparation du système de freinage."
    },

    {
        id: "WO-002",
        equipment: "Chargeuse CAT-01",
        type: "Préventive",
        technician: "Patrick Nguema",
        priority: "Moyenne",
        date: "2026-08-27",
        status: "Terminé",
        description: "Entretien préventif général."
    },

    {
        id: "WO-003",
        equipment: "Convoyeur CV-01",
        type: "Corrective",
        technician: "Michel Obame",
        priority: "Critique",
        date: "2026-08-26",
        status: "En retard",
        description: "Remplacement du moteur du convoyeur."
    },

    {
        id: "WO-004",
        equipment: "Groupe électrogène GE-03",
        type: "Inspection",
        technician: "David Ella",
        priority: "Basse",
        date: "2026-08-25",
        status: "Terminé",
        description: "Inspection générale du groupe."
    },

    {
        id: "WO-005",
        equipment: "Locomotive OMP-02",
        type: "Corrective",
        technician: "Jean Mba",
        priority: "Haute",
        date: "2026-08-29",
        status: "En attente",
        description: "Diagnostic du système électrique."
    },

    {
        id: "WO-006",
        equipment: "Chargeuse CAT-02",
        type: "Préventive",
        technician: "Paul Ndong",
        priority: "Moyenne",
        date: "2026-08-30",
        status: "En cours",
        description: "Vidange et remplacement des filtres."
    }

];


/* =====================================================
   ÉLÉMENTS HTML
===================================================== */

const table =
    document.getElementById("workOrderTable");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const searchResults =
    document.getElementById("searchResults");

const statusFilter =
    document.getElementById("statusFilter");

const modal =
    document.getElementById("addWOModal");


/* =====================================================
   CLASSE CSS DU STATUT
===================================================== */

function getStatusClass(status) {

    switch (status) {

        case "En cours":
            return "en-cours";

        case "Terminé":
            return "termine";

        case "En attente":
            return "en-attente";

        case "En retard":
            return "en-retard";

        default:
            return "";

    }

}


/* =====================================================
   CLASSE CSS PRIORITÉ
===================================================== */

function getPriorityClass(priority) {

    return priority
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s/g, "-");

}


/* =====================================================
   AFFICHAGE DU TABLEAU
===================================================== */

function displayWorkOrders(data) {

    table.innerHTML = "";


    if (data.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="text-align:center;padding:30px;color:#747b87"
                >
                    Aucun Work Order trouvé.
                </td>

            </tr>

        `;

        return;

    }


    data.forEach(wo => {


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>${wo.id}</strong>
            </td>

            <td>
                ${wo.equipment}
            </td>

            <td>
                ${wo.type}
            </td>

            <td>
                ${wo.technician}
            </td>

            <td>

                <span
                    class="priority ${getPriorityClass(wo.priority)}"
                >
                    ${wo.priority}
                </span>

            </td>

            <td>
                ${wo.date}
            </td>

            <td>

                <span
                    class="status ${getStatusClass(wo.status)}"
                >
                    ${wo.status}
                </span>

            </td>

            <td>

                <button
                    class="action-btn"
                    onclick="viewWorkOrder('${wo.id}')"
                >
                    Voir
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


/* =====================================================
   RECHERCHE
===================================================== */

function searchWorkOrders() {

    const search =
        searchInput.value
        .trim()
        .toLowerCase();


    /* Si aucune recherche */

    if (search === "") {

        searchResults.classList.remove("show");

        displayWorkOrders(workOrders);

        return;

    }


    /* Recherche dans plusieurs champs */

    const results =
        workOrders.filter(wo => {

            return (

                wo.id
                .toLowerCase()
                .includes(search)

                ||

                wo.equipment
                .toLowerCase()
                .includes(search)

                ||

                wo.type
                .toLowerCase()
                .includes(search)

                ||

                wo.technician
                .toLowerCase()
                .includes(search)

                ||

                wo.priority
                .toLowerCase()
                .includes(search)

                ||

                wo.status
                .toLowerCase()
                .includes(search)

                ||

                wo.description
                .toLowerCase()
                .includes(search)

            );

        });


    /* Afficher résultats sous la barre */

    searchResults.classList.add("show");


    if (results.length === 0) {

        searchResults.innerHTML = `

            <div class="no-result">

                Aucun Work Order ne correspond à
                "<strong>${searchInput.value}</strong>".

            </div>

        `;

    }

    else {

        searchResults.innerHTML = `

            <div
                style="
                    margin-bottom:10px;
                    font-size:11px;
                    color:#747b87;
                "
            >

                ${results.length}
                résultat(s) trouvé(s)

            </div>

        `;


        results.forEach(wo => {

            const item =
                document.createElement("div");


            item.className =
                "search-result-item";


            item.innerHTML = `

                <div class="search-result-main">

                    <strong>
                        ${wo.id} — ${wo.equipment}
                    </strong>

                    <span>
                        ${wo.type}
                        ·
                        ${wo.technician}
                        ·
                        ${wo.status}
                    </span>

                </div>


                <button
                    class="action-btn"
                    onclick="viewWorkOrder('${wo.id}')"
                >
                    Voir
                </button>

            `;


            searchResults.appendChild(item);

        });

    }


    /* Le tableau est également filtré */

    displayWorkOrders(results);

}


/* Bouton rechercher */

searchButton.addEventListener(
    "click",
    searchWorkOrders
);


/* Recherche avec ENTER */

searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            searchWorkOrders();

        }

    }
);


/* =====================================================
   FILTRE STATUT
===================================================== */

statusFilter.addEventListener(
    "change",
    function() {

        const selected =
            statusFilter.value;


        if (selected === "all") {

            displayWorkOrders(workOrders);

            return;

        }


        const filtered =
            workOrders.filter(
                wo => wo.status === selected
            );


        displayWorkOrders(filtered);

    }
);


/* =====================================================
   AFFICHER LES DÉTAILS
===================================================== */

function viewWorkOrder(id) {

    const wo =
        workOrders.find(
            item => item.id === id
        );


    if (!wo) return;


    alert(

        `WORK ORDER ${wo.id}\n\n` +

        `Équipement : ${wo.equipment}\n` +

        `Type : ${wo.type}\n` +

        `Technicien : ${wo.technician}\n` +

        `Priorité : ${wo.priority}\n` +

        `Date : ${wo.date}\n` +

        `Statut : ${wo.status}\n\n` +

        `Description :\n${wo.description}`

    );

}


/* =====================================================
   OUVRIR MODAL
===================================================== */

document
    .getElementById("openAddWO")
    .addEventListener(
        "click",
        function() {

            modal.classList.add("show");

        }
    );


/* =====================================================
   FERMER MODAL
===================================================== */

function closeModal() {

    modal.classList.remove("show");

}


document
    .getElementById("closeAddWO")
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("cancelWO")
    .addEventListener(
        "click",
        closeModal
    );


/* Cliquer hors de la fenêtre */

modal.addEventListener(
    "click",
    function(event) {

        if (event.target === modal) {

            closeModal();

        }

    }
);


/* =====================================================
   CRÉER UN NOUVEAU WORK ORDER
===================================================== */

document
    .getElementById("workOrderForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const nextNumber =
                workOrders.length + 1;


            const newWO = {

                id:
                    `WO-${String(nextNumber).padStart(3, "0")}`,

                equipment:
                    document
                    .getElementById("woEquipment")
                    .value,

                technician:
                    document
                    .getElementById("woTechnician")
                    .value,

                type:
                    document
                    .getElementById("woType")
                    .value,

                priority:
                    document
                    .getElementById("woPriority")
                    .value,

                date:
                    document
                    .getElementById("woDate")
                    .value,

                status:
                    document
                    .getElementById("woStatus")
                    .value,

                description:
                    document
                    .getElementById("woDescription")
                    .value

            };


            /* Ajouter au tableau */

            workOrders.unshift(newWO);


            /* Rafraîchir */

            displayWorkOrders(workOrders);


            /* Fermer */

            closeModal();


            /* Réinitialiser */

            this.reset();


            /* Message */

            alert(
                `Le Work Order ${newWO.id} a été créé avec succès.`
            );

        }
    );


/* =====================================================
   HISTORIQUE
===================================================== */

document
    .getElementById("historyButton")
    .addEventListener(
        "click",
        function() {

            window.location.href =
                "historique.html";

        }
    );


/* =====================================================
   STATISTIQUES
===================================================== */

function updateStatistics() {

    const total =
        workOrders.length;


    const ongoing =
        workOrders.filter(
            wo => wo.status === "En cours"
        ).length;


    const completed =
        workOrders.filter(
            wo => wo.status === "Terminé"
        ).length;


    const late =
        workOrders.filter(
            wo => wo.status === "En retard"
        ).length;


    document
        .getElementById("totalWO")
        .textContent = total;


    document
        .getElementById("ongoingWO")
        .textContent = ongoing;


    document
        .getElementById("completedWO")
        .textContent = completed;


    document
        .getElementById("lateWO")
        .textContent = late;

}


/* =====================================================
   INITIALISATION
===================================================== */

displayWorkOrders(workOrders);

updateStatistics();