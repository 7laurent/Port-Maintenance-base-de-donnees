/* =====================================================
   DONNÉES HISTORIQUE
===================================================== */

const historyData = [

    {
        id: 1,
        date: "2026-09-02 09:42",
        user: "Administrateur",
        action: "Modification",
        category: "Work Order",
        record: "WO-006",
        oldValue: "En attente",
        newValue: "En cours",
        comment: "Work Order pris en charge."
    },

    {
        id: 2,
        date: "2026-09-02 09:15",
        user: "Jean Mba",
        action: "Création",
        category: "Work Order",
        record: "WO-007",
        oldValue: "-",
        newValue: "Créé",
        comment: "Nouvelle intervention mécanique."
    },

    {
        id: 3,
        date: "2026-09-01 16:30",
        user: "Patrick Nguema",
        action: "Modification",
        category: "Équipement",
        record: "CAT-01",
        oldValue: "Maintenance",
        newValue: "En service",
        comment: "Maintenance terminée."
    },

    {
        id: 4,
        date: "2026-09-01 14:10",
        user: "Administrateur",
        action: "Création",
        category: "Pièce",
        record: "P-006",
        oldValue: "-",
        newValue: "Créée",
        comment: "Nouvelle référence ajoutée au stock."
    },

    {
        id: 5,
        date: "2026-08-31 11:20",
        user: "Michel Obame",
        action: "Modification",
        category: "Panne",
        record: "PAN-004",
        oldValue: "Ouverte",
        newValue: "Résolue",
        comment: "Cause identifiée et réparation effectuée."
    },

    {
        id: 6,
        date: "2026-08-30 10:05",
        user: "Administrateur",
        action: "Suppression",
        category: "Technicien",
        record: "TECH-006",
        oldValue: "Actif",
        newValue: "Supprimé",
        comment: "Compte technicien supprimé."
    }

];


/* =====================================================
   RACCOURCI
===================================================== */

const $ = id =>
    document.getElementById(id);


/* =====================================================
   NORMALISATION
===================================================== */

function normalize(text) {

    return String(text ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"");

}


/* =====================================================
   RENDRE LE TABLEAU
===================================================== */

function renderHistory(data = historyData) {

    const table =
        $("historyTable");

    table.innerHTML = "";


    data.forEach(item => {

        let badgeClass =
            "modification";


        if (item.action === "Création") {
            badgeClass = "creation";
        }


        if (item.action === "Suppression") {
            badgeClass = "suppression";
        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${item.date}
            </td>

            <td>
                ${item.user}
            </td>

            <td>

                <span class="
                    badge
                    ${badgeClass}
                ">

                    ${item.action}

                </span>

            </td>

            <td>
                ${item.category}
            </td>

            <td>
                <strong>
                    ${item.record}
                </strong>
            </td>

            <td>
                ${item.comment}
            </td>

            <td>

                <button
                    class="action"
                    onclick="viewHistory(${item.id})">

                    Voir

                </button>

            </td>

        `;


        table.appendChild(row);

    });


    $("tableCount").textContent =
        `${data.length} activité${data.length > 1 ? "s" : ""}`;

}


/* =====================================================
   STATISTIQUES
===================================================== */

function updateStatistics() {

    const total =
        historyData.length;


    const today =
        historyData.filter(
            item =>
                item.date.startsWith("2026-09-02")
        ).length;


    const creations =
        historyData.filter(
            item =>
                item.action === "Création"
        ).length;


    const modifications =
        historyData.filter(
            item =>
                item.action === "Modification"
        ).length;


    $("totalActions").textContent =
        total;

    $("todayActions").textContent =
        today;

    $("createActions").textContent =
        creations;

    $("updateActions").textContent =
        modifications;

}


/* =====================================================
   RECHERCHE
===================================================== */

function searchHistory() {

    const query =
        normalize(
            $("searchInput").value.trim()
        );


    if (!query) {

        $("searchResults").innerHTML = "";

        renderHistory();

        return;

    }


    const results =
        historyData.filter(item => {

            const text = [

                item.date,
                item.user,
                item.action,
                item.category,
                item.record,
                item.oldValue,
                item.newValue,
                item.comment

            ].join(" ");


            return normalize(text)
                .includes(query);

        });


    if (!results.length) {

        $("searchResults").innerHTML = `

            <div class="result">

                Aucune activité trouvée pour

                <strong>
                    "${$("searchInput").value}"
                </strong>

            </div>

        `;

    } else {

        $("searchResults").innerHTML = `

            <div class="result">

                <strong>
                    ${results.length}
                </strong>

                activité(s) trouvée(s).

            </div>

        `;

    }


    renderHistory(results);

}


/* =====================================================
   FILTRE
===================================================== */

function applyFilter(filter) {

    document
        .querySelectorAll(".filter")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.filter === filter
            );

        });


    if (filter === "all") {

        renderHistory();

        return;

    }


    let action = "";


    if (filter === "creation") {
        action = "Création";
    }

    if (filter === "modification") {
        action = "Modification";
    }

    if (filter === "suppression") {
        action = "Suppression";
    }


    renderHistory(
        historyData.filter(
            item => item.action === action
        )
    );

}


/* =====================================================
   DETAILS
===================================================== */

function viewHistory(id) {

    const item =
        historyData.find(
            element => element.id === id
        );


    if (!item) return;


    $("detailTitle").textContent =
        `${item.action} — ${item.record}`;


    const details = [

        ["Date", item.date],

        ["Utilisateur", item.user],

        ["Action", item.action],

        ["Catégorie", item.category],

        ["Enregistrement", item.record],

        ["Ancienne valeur", item.oldValue],

        ["Nouvelle valeur", item.newValue],

        ["Commentaire", item.comment]

    ];


    $("detailContent").innerHTML = "";


    details.forEach(detail => {

        $("detailContent").innerHTML += `

            <div class="detail-item">

                <span>
                    ${detail[0]}
                </span>

                <strong>
                    ${detail[1] || "-"}
                </strong>

            </div>

        `;

    });


    $("detailsModal")
        .classList.add("show");

}


/* =====================================================
   ZOOM
===================================================== */

$("zoomBtn").onclick = () => {

    $("zoomModal")
        .classList.add("show");


    $("zoomContent").innerHTML = `

        <div class="table-container">

            <table>

                <thead>

                    <tr>

                        <th>Date</th>
                        <th>Utilisateur</th>
                        <th>Action</th>
                        <th>Catégorie</th>
                        <th>Enregistrement</th>
                        <th>Avant</th>
                        <th>Après</th>

                    </tr>

                </thead>

                <tbody>

                    ${historyData.map(item => `

                        <tr>

                            <td>
                                ${item.date}
                            </td>

                            <td>
                                ${item.user}
                            </td>

                            <td>
                                ${item.action}
                            </td>

                            <td>
                                ${item.category}
                            </td>

                            <td>
                                ${item.record}
                            </td>

                            <td>
                                ${item.oldValue}
                            </td>

                            <td>
                                ${item.newValue}
                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>

    `;

};


/* =====================================================
   ÉVÉNEMENTS
===================================================== */

$("searchBtn").onclick =
    searchHistory;


$("searchInput").addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            searchHistory();
        }

    }
);


$("clearBtn").onclick = () => {

    $("searchInput").value = "";

    $("searchResults").innerHTML = "";

    renderHistory();

};


document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.onclick = () => {

            applyFilter(
                button.dataset.filter
            );

        };

    });


document
    .querySelectorAll("[data-close]")
    .forEach(button => {

        button.onclick = () => {

            document
                .getElementById(
                    button.dataset.close
                )
                .classList.remove("show");

        };

    });


document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (event.target === modal) {

                    modal.classList.remove("show");

                }

            }
        );

    });


/* INITIALISATION */

renderHistory();

updateStatistics();