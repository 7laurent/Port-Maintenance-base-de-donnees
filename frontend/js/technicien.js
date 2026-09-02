/* =====================================================
   DONNÉES
===================================================== */

const technicians = [

    {
        id: "T-001",
        matricule: "TECH-001",
        firstName: "Jean",
        lastName: "Mba",
        phone: "+241 06 11 22 33",
        email: "jean.mba@omp.ga",
        service: "Maintenance mécanique",
        speciality: "Mécanique",
        level: "Senior",
        hireDate: "2022-03-15",
        status: "Actif",
        skills: "Moteur, freinage, transmission",
        certifications: "Maintenance industrielle",
        workOrders: 28
    },

    {
        id: "T-002",
        matricule: "TECH-002",
        firstName: "Patrick",
        lastName: "Nguema",
        phone: "+241 06 22 33 44",
        email: "patrick.nguema@omp.ga",
        service: "Maintenance électrique",
        speciality: "Électricité",
        level: "Expert",
        hireDate: "2020-09-10",
        status: "En intervention",
        skills: "Électricité industrielle, diagnostic",
        certifications: "Habilitation électrique",
        workOrders: 35
    },

    {
        id: "T-003",
        matricule: "TECH-003",
        firstName: "Michel",
        lastName: "Obame",
        phone: "+241 06 33 44 55",
        email: "michel.obame@omp.ga",
        service: "Hydraulique",
        speciality: "Hydraulique",
        level: "Senior",
        hireDate: "2021-01-20",
        status: "Actif",
        skills: "Hydraulique, pompes, vérins",
        certifications: "Hydraulique industrielle",
        workOrders: 24
    },

    {
        id: "T-004",
        matricule: "TECH-004",
        firstName: "David",
        lastName: "Ella",
        phone: "+241 06 44 55 66",
        email: "david.ella@omp.ga",
        service: "Maintenance électrique",
        speciality: "Électronique",
        level: "Intermédiaire",
        hireDate: "2023-05-12",
        status: "Actif",
        skills: "Automatisme, capteurs",
        certifications: "Automatisme industriel",
        workOrders: 18
    },

    {
        id: "T-005",
        matricule: "TECH-005",
        firstName: "Paul",
        lastName: "Ndong",
        phone: "+241 06 55 66 77",
        email: "paul.ndong@omp.ga",
        service: "Maintenance mécanique",
        speciality: "Mécanique",
        level: "Junior",
        hireDate: "2024-02-05",
        status: "Inactif",
        skills: "Entretien, vidange",
        certifications: "Maintenance niveau 1",
        workOrders: 12
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
        .replace(/[\u0300-\u036f]/g, "");

}


/* =====================================================
   RENDRE LE TABLEAU
===================================================== */

function renderTechnicians(data = technicians) {

    const table =
        $("techniciansTable");

    table.innerHTML = "";


    data.forEach(tech => {

        let badgeClass = "green";

        if (tech.status === "En intervention") {
            badgeClass = "orange";
        }

        if (tech.status === "Inactif") {
            badgeClass = "red";
        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${tech.matricule}
                </strong>
            </td>

            <td>
                ${tech.firstName}
                ${tech.lastName}
            </td>

            <td>
                ${tech.service}
            </td>

            <td>
                ${tech.speciality}
            </td>

            <td>
                ${tech.level}
            </td>

            <td>
                <strong>
                    ${tech.workOrders}
                </strong>
            </td>

            <td>

                <span class="badge ${badgeClass}">
                    ${tech.status}
                </span>

            </td>

            <td>

                <button
                    class="action"
                    onclick="viewTechnician('${tech.id}')">

                    Voir

                </button>

            </td>

        `;


        table.appendChild(row);

    });


    $("tableCount").textContent =
        `${data.length} technicien${data.length > 1 ? "s" : ""}`;

}


/* =====================================================
   STATISTIQUES
===================================================== */

function updateStatistics() {

    const total =
        technicians.length;


    const active =
        technicians.filter(
            t => t.status === "Actif"
        ).length;


    const busy =
        technicians.filter(
            t => t.status === "En intervention"
        ).length;


    const inactive =
        technicians.filter(
            t => t.status === "Inactif"
        ).length;


    const orders =
        technicians.reduce(
            (sum,t) =>
                sum + t.workOrders,
            0
        );


    $("totalTechnicians").textContent =
        total;

    $("activeTechnicians").textContent =
        active;

    $("busyTechnicians").textContent =
        busy;

    $("totalOrders").textContent =
        orders;


    $("activeCount").textContent =
        active;

    $("busyCount").textContent =
        busy;

    $("inactiveCount").textContent =
        inactive;


    const percentage =
        total
            ? Math.round(active / total * 100)
            : 0;


    $("activePercent").textContent =
        percentage + "%";


    const activeDeg =
        active / Math.max(total,1) * 360;

    const busyDeg =
        (active + busy) /
        Math.max(total,1) * 360;


    $("technicianDonut").style.background = `

        conic-gradient(

            #42bd67
            0deg
            ${activeDeg}deg,

            #f58220
            ${activeDeg}deg
            ${busyDeg}deg,

            #d95d5d
            ${busyDeg}deg
            360deg

        )

    `;

}


/* =====================================================
   GRAPHIQUE
===================================================== */

function renderChart() {

    const chart =
        $("technicianChart");

    chart.innerHTML = "";


    const max =
        Math.max(
            ...technicians.map(
                t => t.workOrders
            )
        );


    technicians.forEach(tech => {

        const group =
            document.createElement("div");

        group.className =
            "bar-group";


        const bar =
            document.createElement("div");

        bar.className =
            "bar bar-orders";


        bar.style.height =
            `${tech.workOrders / max * 180}px`;


        const label =
            document.createElement("span");

        label.className =
            "bar-label";

        label.textContent =
            tech.matricule;


        group.appendChild(bar);

        group.appendChild(label);

        chart.appendChild(group);

    });

}


/* =====================================================
   RECHERCHE
===================================================== */

function searchTechnicians() {

    const value =
        normalize(
            $("searchInput").value.trim()
        );


    if (!value) {

        $("searchResults").innerHTML = "";

        renderTechnicians();

        return;

    }


    const results =
        technicians.filter(tech => {

            const text = [

                tech.matricule,
                tech.firstName,
                tech.lastName,
                tech.phone,
                tech.email,
                tech.service,
                tech.speciality,
                tech.level,
                tech.skills,
                tech.certifications

            ].join(" ");


            return normalize(text)
                .includes(value);

        });


    if (results.length === 0) {

        $("searchResults").innerHTML = `

            <div class="result">

                Aucun technicien trouvé pour

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


        results.forEach(tech => {

            $("searchResults").innerHTML += `

                <div class="result">

                    <strong>
                        ${tech.matricule}
                    </strong>

                    —

                    ${tech.firstName}
                    ${tech.lastName}

                    —

                    ${tech.speciality}

                    —

                    ${tech.status}

                </div>

            `;

        });

    }


    renderTechnicians(results);

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

        renderTechnicians();

        return;

    }


    let status = "";


    if (filter === "active") {
        status = "Actif";
    }

    if (filter === "busy") {
        status = "En intervention";
    }

    if (filter === "inactive") {
        status = "Inactif";
    }


    renderTechnicians(
        technicians.filter(
            tech => tech.status === status
        )
    );

}


/* =====================================================
   DETAILS
===================================================== */

function viewTechnician(id) {

    const tech =
        technicians.find(
            t => t.id === id
        );


    if (!tech) return;


    $("detailTitle").textContent =
        `${tech.firstName} ${tech.lastName}`;


    const details = [

        ["Matricule", tech.matricule],

        ["Téléphone", tech.phone],

        ["Email", tech.email],

        ["Service", tech.service],

        ["Spécialité", tech.speciality],

        ["Niveau", tech.level],

        ["Date d'embauche", tech.hireDate],

        ["Statut", tech.status],

        ["Work Orders réalisés", tech.workOrders],

        ["Compétences", tech.skills],

        ["Certifications", tech.certifications]

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

function openZoom(type) {

    $("zoomModal")
        .classList.add("show");


    if (type === "table") {

        $("zoomTitle").textContent =
            "Liste complète des techniciens";


        $("zoomContent").innerHTML = `

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Matricule</th>
                            <th>Technicien</th>
                            <th>Service</th>
                            <th>Spécialité</th>
                            <th>Niveau</th>
                            <th>Work Orders</th>
                            <th>Statut</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${technicians.map(t => `

                            <tr>

                                <td>${t.matricule}</td>

                                <td>
                                    ${t.firstName}
                                    ${t.lastName}
                                </td>

                                <td>${t.service}</td>

                                <td>${t.speciality}</td>

                                <td>${t.level}</td>

                                <td>${t.workOrders}</td>

                                <td>${t.status}</td>

                            </tr>

                        `).join("")}

                    </tbody>

                </table>

            </div>

        `;

    }


    if (type === "chart") {

        $("zoomTitle").textContent =
            "Performance des techniciens";


        $("zoomContent").innerHTML = `

            <div
                class="bars"
                style="height:400px">

                ${$("technicianChart").innerHTML}

            </div>

        `;

    }


    if (type === "status") {

        $("zoomTitle").textContent =
            "Statut de l'équipe technique";


        $("zoomContent").innerHTML = `

            <div style="
                text-align:center;
                padding:30px;
            ">

                ${$("technicianDonut").outerHTML}

                <p>
                    ${$("activeCount").textContent}
                    techniciens actifs,
                    ${$("busyCount").textContent}
                    en intervention et
                    ${$("inactiveCount").textContent}
                    inactifs.
                </p>

            </div>

        `;

    }

}


/* =====================================================
   ÉVÉNEMENTS
===================================================== */

$("searchBtn").onclick =
    searchTechnicians;


$("searchInput").addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            searchTechnicians();
        }

    }
);


$("clearBtn").onclick = () => {

    $("searchInput").value = "";

    $("searchResults").innerHTML = "";

    renderTechnicians();

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


$("addBtn").onclick = () => {

    $("technicianModal")
        .classList.add("show");

};


$("historyBtn").onclick = () => {

    window.location.href =
        "historique.html";

};


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
   AJOUT TECHNICIEN
===================================================== */

$("technicianForm").onsubmit =
    event => {

        event.preventDefault();


        const form =
            new FormData(event.target);


        const technician = {

            id:
                "T-" +
                String(
                    technicians.length + 1
                ).padStart(3,"0"),

            matricule:
                form.get("matricule"),

            firstName:
                form.get("firstName"),

            lastName:
                form.get("lastName"),

            phone:
                form.get("phone"),

            email:
                form.get("email"),

            service:
                form.get("service"),

            speciality:
                form.get("speciality"),

            level:
                form.get("level"),

            hireDate:
                form.get("hireDate"),

            status:
                form.get("status"),

            skills:
                form.get("skills"),

            certifications:
                form.get("certifications"),

            workOrders: 0

        };


        technicians.unshift(
            technician
        );


        event.target.reset();


        $("technicianModal")
            .classList.remove("show");


        renderTechnicians();

        updateStatistics();

        renderChart();

    };


/* INITIALISATION */

renderTechnicians();

updateStatistics();

renderChart();