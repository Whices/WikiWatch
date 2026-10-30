
const conteneur = document.querySelector("#classement-heros");

const filtreRang = document.querySelector("#filtre-rang");
const filtreRole = document.querySelector("#filtre-role");
const triStatistique = document.querySelector("#tri-statistique");
const rechercheHero = document.querySelector("#recherche-hero");
const statut = document.querySelector("#meta-statut");

// Données récupérées depuis les fichiers JSON
let heros = [];

// Charger les données correspondant au rang sélectionné
async function chargerClassement() {

    try {
        const fichier = filtreRang.value === "diamond"
            ? "data/meta-diamond.json"
            : "data/meta.json";

        statut.textContent = "Chargement des statistiques...";

        const response = await fetch(fichier);

        if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
        }

        const donnees = await response.json();

        heros = donnees.heroes;

        afficherClassement();

    } catch (erreur) {

        console.error("Erreur de chargement :", erreur);

        statut.textContent = "Impossible de charger les statistiques.";
        conteneur.replaceChildren();
    }
}


// Afficher les héros avec les filtres sélectionnés
function afficherClassement() {

    const roleSelectionne = filtreRole.value;
    const recherche = rechercheHero.value.toLowerCase().trim();
    const statistique = triStatistique.value;

    // Filtrer les héros
    const classement = heros
        .filter(hero => {

            const bonRole =
                roleSelectionne === "all" ||
                hero.role === roleSelectionne;

            const bonNom =
                hero.name.toLowerCase().includes(recherche);

            return bonRole && bonNom;
        })

        // Trier selon la statistique choisie
        .sort((a, b) => b[statistique] - a[statistique]);

    // Vider les anciennes cartes
    conteneur.replaceChildren();

    // Créer une carte pour chaque héros
    classement.forEach((hero, index) => {

        const carte = document.createElement("article");
        carte.classList.add("hero-card");

        // Identité
        const identite = document.createElement("div");
        identite.classList.add("hero-identity");

        const portrait = document.createElement("img");
        portrait.src = hero.portrait;
        portrait.alt = `Portrait de ${hero.name}`;
        portrait.loading = "lazy";

        const informations = document.createElement("div");
        informations.classList.add("hero-name");

        const nom = document.createElement("h3");
        nom.textContent = hero.name;

        const role = document.createElement("span");

        const roles = {
            TANK: "TANK",
            DAMAGE: "DÉGÂTS",
            SUPPORT: "SUPPORT"
        };

        role.textContent = roles[hero.role] || hero.role;

        const rang = document.createElement("span");
        rang.classList.add("hero-rank");
        rang.textContent = `#${index + 1}`;

        informations.append(nom, role);
        identite.append(portrait, informations, rang);

        // Déterminer la couleur du win rate
        let couleurWinRate;

        if (hero.winRate < 49) {
            couleurWinRate = "winrate-bas";
        } else if (hero.winRate <= 51) {
            couleurWinRate = "winrate-moyen";
        } else {
            couleurWinRate = "winrate-haut";
        }

        // Créer une statistique
        function creerStatistique(label, valeur, classe = "") {

            const stat = document.createElement("div");
            stat.classList.add("stat");

            const valeurStat = document.createElement("span");
            valeurStat.classList.add("stat-value");

            if (classe) {
                valeurStat.classList.add(classe);
            }

            valeurStat.textContent = `${valeur}%`;

            const nomStat = document.createElement("span");
            nomStat.classList.add("stat-label");
            nomStat.textContent = label;

            stat.append(valeurStat, nomStat);

            return stat;
        }

        // Statistiques du héros
        const statistiques = document.createElement("div");
        statistiques.classList.add("hero-stats");

        statistiques.append(
            creerStatistique("WIN RATE", hero.winRate, couleurWinRate),
            creerStatistique("PICK RATE", hero.pickRate),
            creerStatistique("BAN RATE", hero.banRate)
        );

        // Assemblage de la carte
        carte.append(identite, statistiques);
        conteneur.append(carte);
    });

    statut.textContent = `${classement.length} héros affichés`;
}


// Événements des filtres
filtreRang.addEventListener("change", chargerClassement);

filtreRole.addEventListener("change", afficherClassement);

triStatistique.addEventListener("change", afficherClassement);

rechercheHero.addEventListener("input", afficherClassement);


// Premier chargement
chargerClassement();
