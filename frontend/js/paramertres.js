/* =====================================================
   DONNÉES
===================================================== */

const settings = [

    {
        id: "SET-001",
        key: "maintenance_delay",
        name: "Délai maintenance",
        category: "Maintenance",
        value: "30",
        unit: "minutes",
        status: "Actif",
        description: "Durée avant déclenchement d'une alerte.",
        notes: "Utilisé pour les interventions préventives."
    },

    {
        id: "SET-002",
        key: "stock_min_alert",
        name: "Alerte stock minimum",
        category: "Stock",
        value: "5",
        unit: "unités",
        status: "Actif",
        description: "Seuil de déclenchement de l'alerte stock.",
        notes: "Une alerte est affichée lorsque le stock atteint ce seuil."
    },

    {
        id: "SET-003",
        key: "workorder_auto_number",
        name: "Numérotation Work Order",
        category: "Système",
        value: "WO-",
        unit: "",
        status: "Actif",
        description: "Préfixe utilisé pour les Work Orders.",
        notes: "Numérotation automatique."
    },

    {
        id: "SET-004",
        key: "session_timeout",
        name: "Expiration session",
        category: "Sécurité",
        value: "30",
        unit: "minutes",
        status: "Actif",
        description: "Durée maximale d'une session.",
        notes: "Sécurité du système."
    },

    {
        id: "SET-005",
        key: "email_notifications",
        name: "Notifications email",
        category: "Notifications",
        value: "Activées",
        unit: "",
        status: "Actif",
        description: "Activation des notifications par email.",
        notes: "Les administrateurs reçoivent les alertes importantes."
    },

    {
        id: "SET-006",
        key: "auto_backup",
        name: "Sauvegarde automatique",
        category: "Système",
        value: "Oui",
        unit: "",
        status: "Actif",
        description: "Active la sauvegarde automatique.",
        notes: "Sauvegarde quotidienne."
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
   AFFICHER TABLEAU
===================================================== */

function renderSettings(data = settings) {

    const table =
        $("settingsTable");

    table.innerHTML = "";


    data.forEach(setting => {

        const row =
            document.createElement("tr");


        const badgeClass =
            setting.status === "Actif"
                ? "green"
                : "red";


        row.innerHTML = `

            <td>
                <strong>
                    ${setting.key}
                </strong>
            </td>

            <td>
                ${setting.name}
            </td>

            <td>
                ${setting.category}
            </td>

            <td>
                ${setting.value}
            </td>

            <td>
                ${setting.unit || "-"}
            </td>

            <td>

                <span
                    class="badge ${badgeClass}">

                    ${setting.status}

                </span>

            </td>

            <td>

                <button
                    class="action"
                    onclick="viewSetting('${setting.id}')">

                    Voir

                </button>

            </td>

        `;


        table.appendChild(row);

    });


    $("tableCount").textContent =
        `${data.length} paramètre${data.length > 1 ? "s" : ""}`;

}


/* =====================================================
   STATISTIQUES
===================================================== */

function updateStatistics() {

    const total =
        settings.length;


    const active =
        settings.filter(
            s => s.status === "Actif"
        ).length;


    const maintenance =
        settings.filter(
            s => s.category === "Maintenance"
        ).length;


    const system =
        settings.filter(
            s => s.category === "Système"
        ).length;


    $("totalSettings").textContent =
        total;


    $("activeSettings").textContent =
        active;


    $("maintenanceSettings").textContent =
        maintenance;


    $("systemSettings").textContent =
        system;

}


/* =====================================================
   RECHERCHE
===================================================== */

function searchSettings() {

    const query =
        normalize(
            $("searchInput").value.trim()
        );


    if (!query) {

        $("searchResults").innerHTML = "";

        renderSettings();

        return;

    }


    const results =
        settings.filter(setting => {

            const text = [

                setting.key,
                setting.name,
                setting.category,
                setting.value,
                setting.unit,
                setting.status,
                setting.description,
                setting.notes

            ].join(" ");


            return normalize(text)
                .includes(query);

        });


    if (results.length === 0) {

        $("searchResults").innerHTML = `

            <div class="result">

                Aucun paramètre trouvé pour

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

                résultat(s) trouvé(s).

            </div>

        `;


        results.forEach(setting => {

            $("searchResults").innerHTML += `

                <div class="result">

                    <strong>
                        ${setting.key}
                    </strong>

                    —

                    ${setting.name}

                    —

                    ${setting.value}

                    ${setting.unit || ""}

                </div>

            `;

        });

    }


    renderSettings(results);

}


/* =====================================================
   FILTRES
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

        renderSettings();

        return;

    }


    renderSettings(
        settings.filter(
            setting =>
                normalize(setting.category) ===
                normalize(
                    filter === "maintenance"
                        ? "Maintenance"
                        : filter === "system"
                            ? "Système"
                            : "Sécurité"
                )
        )
    );

}


/* =====================================================
   DETAILS
===================================================== */

function viewSetting(id) {

    const setting =
        settings.find(
            s => s.id === id
        );


    if (!setting) return;


    $("detailTitle").textContent =
        setting.name;


    const details = [

        ["Clé", setting.key],

        ["Nom", setting.name],

        ["Catégorie", setting.category],

        ["Valeur", setting.value],

        ["Unité", setting.unit],

        ["Statut", setting.status],

        ["Description", setting.description],

        ["Notes", setting.notes]

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

                        <th>Clé</th>
                        <th>Nom</th>
                        <th>Catégorie</th>
                        <th>Valeur</th>
                        <th>Unité</th>
                        <th>Statut</th>

                    </tr>

                </thead>

                <tbody>

                    ${settings.map(setting => `

                        <tr>

                            <td>
                                ${setting.key}
                            </td>

                            <td>
                                ${setting.name}
                            </td>

                            <td>
                                ${setting.category}
                            </td>

                            <td>
                                ${setting.value}
                            </td>

                            <td>
                                ${setting.unit || "-"}
                            </td>

                            <td>
                                ${setting.status}
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
    searchSettings;


$("searchInput").addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            searchSettings();

        }

    }
);


$("clearBtn").onclick = () => {

    $("searchInput").value = "";

    $("searchResults").innerHTML = "";

    renderSettings();

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


/* OUVRIR AJOUT */

$("addBtn").onclick = () => {

    $("settingsModal")
        .classList.add("show");

};


/* FERMER MODALES */

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


/* =====================================================
   AJOUT PARAMÈTRE
===================================================== */

$("settingsForm").onsubmit =
    event => {

        event.preventDefault();


        const form =
            new FormData(event.target);


        const setting = {

            id:
                "SET-" +
                String(
                    settings.length + 1
                ).padStart(3,"0"),

            key:
                form.get("key"),

            name:
                form.get("name"),

            category:
                form.get("category"),

            value:
                form.get("value"),

            unit:
                form.get("unit"),

            status:
                form.get("status"),

            description:
                form.get("description"),

            notes:
                form.get("notes")

        };


        settings.unshift(
            setting
        );


        event.target.reset();


        $("settingsModal")
            .classList.remove("show");


        renderSettings();

        updateStatistics();

    };


/* INITIALISATION */

renderSettings();

updateStatistics();