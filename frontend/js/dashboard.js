/* =========================================
   OMP MAINTENANCE
   DASHBOARD JS
   ========================================= */


// =========================================
// DATE
// =========================================

const currentDate =
    document.getElementById("currentDate");


const today = new Date();


const dateFormatter =
    new Intl.DateTimeFormat(
        "fr-FR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );


currentDate.textContent =
    dateFormatter.format(today);


// =========================================
// DONNÉES TEMPORAIRES
// =========================================

const dashboardData = {

    equipments: 128,

    failures: 17,

    workOrders: 46,

    technicians: 24,

    activity: [

        {
            month: "Mars",
            preventive: 45,
            corrective: 30
        },

        {
            month: "Avr",
            preventive: 60,
            corrective: 42
        },

        {
            month: "Mai",
            preventive: 52,
            corrective: 35
        },

        {
            month: "Juin",
            preventive: 72,
            corrective: 48
        },

        {
            month: "Juil",
            preventive: 64,
            corrective: 55
        },

        {
            month: "Août",
            preventive: 82,
            corrective: 45
        }

    ]

};


// =========================================
// AFFICHER LES KPI
// =========================================

document.getElementById(
    "equipmentCount"
).textContent =
    dashboardData.equipments;


document.getElementById(
    "failureCount"
).textContent =
    dashboardData.failures;


document.getElementById(
    "workOrderCount"
).textContent =
    dashboardData.workOrders;


document.getElementById(
    "technicianCount"
).textContent =
    dashboardData.technicians;


// =========================================
// GRAPHIQUE
// =========================================

const activityChart =
    document.getElementById(
        "activityChart"
    );


function createChart(data) {


    activityChart.innerHTML = "";


    data.forEach(function(item) {


        const column =
            document.createElement("div");


        column.classList.add(
            "chart-column"
        );


        const preventive =
            document.createElement("div");


        preventive.classList.add(
            "bar"
        );


        preventive.style.height =
            item.preventive + "%";


        const corrective =
            document.createElement("div");


        corrective.classList.add(
            "bar",
            "orange-bar"
        );


        corrective.style.height =
            item.corrective + "%";


        column.appendChild(
            preventive
        );


        column.appendChild(
            corrective
        );


        activityChart.appendChild(
            column
        );


        // Nom du mois

        const month =
            document.createElement("span");


        month.classList.add(
            "chart-month"
        );


        month.textContent =
            item.month;


        column.style.position =
            "relative";


        column.appendChild(month);

    });

}


createChart(
    dashboardData.activity
);


// =========================================
// CHANGEMENT DE PÉRIODE
// =========================================

const periodSelect =
    document.getElementById(
        "periodSelect"
    );


periodSelect.addEventListener(
    "change",
    function() {

        console.log(
            "Période sélectionnée :",
            this.value
        );

    }
);


// =========================================
// MENU MOBILE
// =========================================

const menuButton =
    document.getElementById(
        "menuButton"
    );


const sidebar =
    document.getElementById(
        "sidebar"
    );


menuButton.addEventListener(
    "click",
    function() {

        sidebar.classList.toggle(
            "open"
        );

    }
);


// =========================================
// FERMER LE MENU APRÈS UN CLIC
// =========================================

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


navLinks.forEach(function(link) {

    link.addEventListener(
        "click",
        function() {

            sidebar.classList.remove(
                "open"
            );

        }
    );

});