/* =====================================================
   DONNÉES DES PIÈCES
===================================================== */

const pieces = [

    {
        id: "P-001",
        reference: "FIL-001",
        name: "Filtre à huile",
        category: "Moteur",
        manufacturer: "Caterpillar",
        supplier: "Meca Gabon",
        quantity: 18,
        minStock: 5,
        unit: "unité",
        location: "Magasin A",
        unitPrice: 45000,
        lastPurchase: "2026-08-10",
        compatible: "CAT-01, CAT-02",
        used: 34,
        bought: 50,
        broken: 2,
        description: "Filtre utilisé pour l'entretien moteur."
    },

    {
        id: "P-002",
        reference: "FRE-014",
        name: "Plaquette de frein",
        category: "Freinage",
        manufacturer: "Komatsu",
        supplier: "Gabon Equip",
        quantity: 4,
        minStock: 8,
        unit: "jeu",
        location: "Magasin B",
        unitPrice: 125000,
        lastPurchase: "2026-07-28",
        compatible: "LOCO-01",
        used: 28,
        bought: 20,
        broken: 1,
        description: "Jeu de plaquettes de frein."
    },

    {
        id: "P-003",
        reference: "HYD-022",
        name: "Flexible hydraulique",
        category: "Hydraulique",
        manufacturer: "Parker",
        supplier: "Hydro Service",
        quantity: 0,
        minStock: 3,
        unit: "unité",
        location: "Magasin A",
        unitPrice: 85000,
        lastPurchase: "2026-06-15",
        compatible: "CAT-01",
        used: 22,
        bought: 25,
        broken: 4,
        description: "Flexible haute pression."
    },

    {
        id: "P-004",
        reference: "BAT-009",
        name: "Batterie 12V",
        category: "Électricité",
        manufacturer: "Exide",
        supplier: "Auto Parts",
        quantity: 11,
        minStock: 4,
        unit: "unité",
        location: "Magasin C",
        unitPrice: 180000,
        lastPurchase: "2026-08-19",
        compatible: "GE-01, GE-03",
        used: 15,
        bought: 18,
        broken: 1,
        description: "Batterie de démarrage."
    },

    {
        id: "P-005",
        reference: "TRM-031",
        name: "Courroie transmission",
        category: "Transmission",
        manufacturer: "Gates",
        supplier: "Meca Gabon",
        quantity: 3,
        minStock: 5,
        unit: "unité",
        location: "Magasin B",
        unitPrice: 95000,
        lastPurchase: "2026-08-03",
        compatible: "CV-01",
        used: 19,
        bought: 22,
        broken: 3,
        description: "Courroie de transmission."
    }

];


/* =====================================================
   RACCOURCI
===================================================== */

const $ = id => document.getElementById(id);


/* =====================================================
   NORMALISATION RECHERCHE
===================================================== */

function normalizeText(text) {

    return String(text ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


/* =====================================================
   ÉTAT DU STOCK
===================================================== */

function stockState(piece) {

    if (piece.quantity === 0) {
        return "out";
    }

    if (piece.quantity <= piece.minStock) {
        return "low";
    }

    return "available";

}


/* =====================================================
   FORMAT MONNAIE
===================================================== */

function money(value) {

    return Number(value).toLocaleString("fr-FR") + " FCFA";

}


/* =====================================================
   AFFICHER LES PIÈCES
===================================================== */

function renderPieces(data = pieces) {

    const table = $("piecesTable");

    table.innerHTML = "";


    data.forEach(piece => {

        const state = stockState(piece);

        let label;
        let className;

        if (state === "out") {

            label = "Rupture";
            className = "red";

        } else if (state === "low") {

            label = "Stock faible";
            className = "orange";

        } else {

            label = `${piece.quantity} ${piece.unit}`;
            className = "green";

        }


        const row = document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>${piece.reference}</strong>
            </td>

            <td>
                ${piece.name}
            </td>

            <td>
                ${piece.category}
            </td>

            <td>
                ${piece.supplier || "-"}
            </td>

            <td>
                <span class="badge ${className}">
                    ${label}
                </span>
            </td>

            <td>
                ${piece.location || "-"}
            </td>

            <td>
                ${money(piece.unitPrice)}
            </td>

            <td>

                <button
                    class="action"
                    onclick="viewPiece('${piece.id}')">

                    Voir

                </button>

            </td>

        `;


        table.appendChild(row);

    });


    $("tableCount").textContent =
        `${data.length} pièce${data.length > 1 ? "s" : ""}`;

}


/* =====================================================
   STATISTIQUES
===================================================== */

function updateStatistics() {

    const total = pieces.length;

    const stock = pieces.reduce(
        (sum, piece) => sum + piece.quantity,
        0
    );

    const low = pieces.filter(
        piece => stockState(piece) === "low"
    ).length;

    const out = pieces.filter(
        piece => stockState(piece) === "out"
    ).length;

    const available = total - low - out;


    const value = pieces.reduce(
        (sum, piece) =>
            sum + piece.quantity * piece.unitPrice,
        0
    );


    $("totalPieces").textContent = total;

    $("stockPieces").textContent = stock;

    $("lowPieces").textContent = low;

    $("stockValue").textContent = money(value);

    $("availableCount").textContent = available;

    $("lowCount").textContent = low;

    $("outCount").textContent = out;


    const percentage =
        total === 0
            ? 0
            : Math.round((available / total) * 100);


    $("stockPercent").textContent =
        percentage + "%";


    const availableDeg =
        (available / Math.max(total, 1)) * 360;

    const lowDeg =
        ((available + low) / Math.max(total, 1)) * 360;


    $("donut").style.background = `
        conic-gradient(
            #42bd67 0deg ${availableDeg}deg,
            #f58220 ${availableDeg}deg ${lowDeg}deg,
            #d95d5d ${lowDeg}deg 360deg
        )
    `;

}


/* =====================================================
   GRAPHIQUE
===================================================== */

function renderChart() {

    const chart = $("usageChart");

    chart.innerHTML = "";


    const max = Math.max(
        ...pieces.map(piece =>
            Math.max(
                piece.used,
                piece.bought,
                piece.broken
            )
        )
    );


    pieces.forEach(piece => {

        const group = document.createElement("div");

        group.className = "bar-group";


        const used = document.createElement("div");

        used.className = "bar used";

        used.style.height =
            `${(piece.used / max) * 180}px`;


        const bought = document.createElement("div");

        bought.className = "bar bought";

        bought.style.height =
            `${(piece.bought / max) * 180}px`;


        const broken = document.createElement("div");

        broken.className = "bar broken";

        broken.style.height =
            `${Math.max(
                5,
                (piece.broken / max) * 180
            )}px`;


        const label = document.createElement("span");

        label.className = "bar-label";

        label.textContent = piece.reference;


        group.appendChild(used);
        group.appendChild(bought);
        group.appendChild(broken);
        group.appendChild(label);


        chart.appendChild(group);

    });

}


/* =====================================================
   RECHERCHE
===================================================== */

function searchPieces() {

    const input = $("searchInput");

    const query =
        normalizeText(input.value.trim());


    if (!query) {

        $("searchResults").innerHTML = "";

        renderPieces();

        return;

    }


    const results = pieces.filter(piece => {

        const text = [

            piece.reference,
            piece.name,
            piece.category,
            piece.manufacturer,
            piece.supplier,
            piece.location,
            piece.compatible,
            piece.description

        ].join(" ");


        return normalizeText(text)
            .includes(query);

    });


    if (results.length === 0) {

        $("searchResults").innerHTML = `

            <div class="result">

                Aucune pièce ne correspond à :

                <strong>
                    "${input.value}"
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

        results.forEach(piece => {

            $("searchResults").innerHTML += `

                <div class="result">

                    <strong>
                        ${piece.reference}
                    </strong>

                    — ${piece.name}

                    — ${piece.quantity} ${piece.unit}

                    — ${piece.location}

                </div>

            `;

        });

    }


    renderPieces(results);

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

        renderPieces();

        return;

    }


    renderPieces(
        pieces.filter(
            piece =>
                stockState(piece) === filter
        )
    );

}


/* =====================================================
   VOIR UNE PIÈCE
===================================================== */

function viewPiece(id) {

    const piece =
        pieces.find(item => item.id === id);


    if (!piece) {
        return;
    }


    $("detailTitle").textContent =
        `${piece.reference} — ${piece.name}`;


    const details = [

        ["Référence", piece.reference],

        ["Catégorie", piece.category],

        ["Fabricant", piece.manufacturer],

        ["Fournisseur", piece.supplier],

        [
            "Stock",
            `${piece.quantity} ${piece.unit}`
        ],

        ["Stock minimum", piece.minStock],

        ["Emplacement", piece.location],

        ["Prix unitaire", money(piece.unitPrice)],

        ["Dernier achat", piece.lastPurchase],

        ["Compatible avec", piece.compatible],

        ["Pièces utilisées", piece.used],

        ["Pièces achetées", piece.bought],

        ["Pièces cassées", piece.broken],

        ["Description", piece.description]

    ];


    $("detailContent").innerHTML = "";


    details.forEach(detail => {

        const item =
            document.createElement("div");

        item.className = "detail-item";


        item.innerHTML = `

            <span>
                ${detail[0]}
            </span>

            <strong>
                ${detail[1] || "-"}
            </strong>

        `;


        $("detailContent")
            .appendChild(item);

    });


    $("detailsModal")
        .classList.add("show");

}


/* =====================================================
   ZOOM
===================================================== */

function openZoom(type) {

    $("zoomModal")
        .classList.add("show");


    if (type === "table") {

        $("zoomTitle").textContent =
            "Liste complète des pièces";

        $("zoomContent").innerHTML = `

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Référence</th>
                            <th>Pièce</th>
                            <th>Catégorie</th>
                            <th>Fournisseur</th>
                            <th>Stock</th>
                            <th>Emplacement</th>
                            <th>Prix</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${pieces.map(piece => `

                            <tr>

                                <td>
                                    ${piece.reference}
                                </td>

                                <td>
                                    ${piece.name}
                                </td>

                                <td>
                                    ${piece.category}
                                </td>

                                <td>
                                    ${piece.supplier}
                                </td>

                                <td>
                                    ${piece.quantity}
                                </td>

                                <td>
                                    ${piece.location}
                                </td>

                                <td>
                                    ${money(piece.unitPrice)}
                                </td>

                            </tr>

                        `).join("")}

                    </tbody>

                </table>

            </div>

        `;

    }


    if (type === "chart") {

        $("zoomTitle").textContent =
            "Analyse de l'utilisation des pièces";

        $("zoomContent").innerHTML = `

            <div
                class="bars"
                style="height:400px">

                ${$("usageChart").innerHTML}

            </div>

        `;

    }


    if (type === "status") {

        $("zoomTitle").textContent =
            "État détaillé du stock";

        $("zoomContent").innerHTML = `

            <div style="
                text-align:center;
                padding:30px;
            ">

                ${$("donut").outerHTML}

                <p>
                    Consultez les statistiques
                    du stock dans le Dashboard.
                </p>

            </div>

        `;

    }

}


/* =====================================================
   ÉVÉNEMENTS
===================================================== */

$("searchBtn").onclick =
    searchPieces;


$("searchInput").addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            searchPieces();

        }

    }
);


$("clearBtn").onclick = () => {

    $("searchInput").value = "";

    $("searchResults").innerHTML = "";

    renderPieces();

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


/* AJOUT */

$("addBtn").onclick = () => {

    $("pieceModal")
        .classList.add("show");

};


/* HISTORIQUE */

$("historyBtn").onclick = () => {

    window.location.href =
        "historique.html";

};


/* ZOOM */

$("zoomTableBtn").onclick =
    () => openZoom("table");

$("zoomChartBtn").onclick =
    () => openZoom("chart");

$("zoomStatusBtn").onclick =
    () => openZoom("status");


/* FERMETURE MODALES */

document
    .querySelectorAll("[data-close]")
    .forEach(button => {

        button.onclick = () => {

            const modal =
                $(button.dataset.close);

            modal.classList.remove("show");

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
   AJOUT D'UNE PIÈCE
===================================================== */

$("pieceForm").onsubmit = event => {

    event.preventDefault();


    const form =
        new FormData(event.target);


    const newPiece = {

        id:
            "P-" +
            String(pieces.length + 1)
                .padStart(3, "0"),

        reference:
            form.get("reference"),

        name:
            form.get("name"),

        category:
            form.get("category"),

        manufacturer:
            form.get("manufacturer"),

        supplier:
            form.get("supplier"),

        quantity:
            Number(form.get("quantity")),

        minStock:
            Number(form.get("minStock")),

        unit:
            form.get("unit"),

        location:
            form.get("location"),

        unitPrice:
            Number(form.get("unitPrice")),

        lastPurchase:
            form.get("lastPurchase"),

        compatible:
            form.get("compatible"),

        used: 0,

        bought:
            Number(form.get("quantity")),

        broken: 0,

        description:
            form.get("description")

    };


    pieces.unshift(newPiece);


    event.target.reset();


    $("pieceModal")
        .classList.remove("show");


    renderPieces();

    updateStatistics();

    renderChart();

};
    

/* =====================================================
   INITIALISATION
===================================================== */

renderPieces();

updateStatistics();

renderChart();