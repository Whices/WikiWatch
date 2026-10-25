
const API = "https://overfast-api.tekrop.fr";

const grille = document.getElementById("heros");
const message = document.getElementById("message");
const recherche = document.getElementById("recherche");
const fiche = document.getElementById("fiche");
const details = document.getElementById("details");
const boutonFermer = document.getElementById("fermer");

let listeHeros = [];

// Récupérer tous les héros
async function chargerHeros() {
    try {
        message.textContent = "Chargement des héros...";

        const reponse = await fetch(
            `${API}/heroes?locale=fr-fr`
        );

        if (!reponse.ok) {
            throw new Error(`Erreur HTTP ${reponse.status}`);
        }

        listeHeros = await reponse.json();

        afficherHeros(listeHeros);

        message.textContent =
            `${listeHeros.length} héros récupérés.`;
    } catch (erreur) {
        message.textContent =
            "Impossible de charger les héros. Réessaie plus tard.";

        console.error(erreur);
    }
}

// Afficher les cartes
function afficherHeros(heros) {
    grille.replaceChildren();

    if (heros.length === 0) {
        grille.textContent = "Aucun héros trouvé.";
        return;
    }

    for (const hero of heros) {
        const carte = document.createElement("article");
        carte.className = "carte-heros";

        const image = document.createElement("img");
        image.src = hero.portrait;
        image.alt = `Portrait de ${hero.name}`;
        image.loading = "lazy";

        const nom = document.createElement("h2");
        nom.textContent = hero.name;

        const role = document.createElement("p");
        role.textContent = traduireRole(hero.role);

        const bouton = document.createElement("button");
        bouton.textContent = "Voir la fiche";
        bouton.addEventListener("click", () => {
            chargerFiche(hero.key);
        });

        carte.append(image, nom, role, bouton);
        grille.appendChild(carte);
    }
}

// Traduire les rôles
function traduireRole(role) {
    const roles = {
        tank: "Tank",
        damage: "Dégâts",
        support: "Soutien"
    };

    return roles[role] || role || "Rôle inconnu";
}

// Récupérer les détails d'un héros
async function chargerFiche(cle) {
    fiche.hidden = false;
    details.textContent = "Chargement de la fiche...";

    fiche.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    try {
        const reponse = await fetch(
            `${API}/heroes/${encodeURIComponent(cle)}?locale=fr-fr`
        );

        if (!reponse.ok) {
            throw new Error(`Erreur HTTP ${reponse.status}`);
        }

        const hero = await reponse.json();

        afficherFiche(hero);
    } catch (erreur) {
        details.textContent =
            "Impossible de récupérer cette fiche.";

        console.error(erreur);
    }
}

// Construire la fiche détaillée
function afficherFiche(hero) {
    details.replaceChildren();

    const titre = document.createElement("h2");
    titre.textContent = hero.name;

    const portrait = document.createElement("img");
    portrait.src = hero.portrait;
    portrait.alt = `Portrait de ${hero.name}`;
    portrait.width = 160;

    const role = document.createElement("p");
    role.textContent = `Rôle : ${traduireRole(hero.role)}`;

    const description = document.createElement("p");
    description.textContent =
        hero.description || "Aucune description disponible.";

    details.append(titre, portrait, role, description);

    const titreCapacites = document.createElement("h3");
    titreCapacites.textContent = "Capacités";
    details.appendChild(titreCapacites);

    const capacites = hero.abilities || [];

    if (capacites.length === 0) {
        const texte = document.createElement("p");
        texte.textContent = "Aucune capacité disponible.";
        details.appendChild(texte);
    }

    for (const capacite of capacites) {
        const bloc = document.createElement("article");
        bloc.className = "capacite";

        const nom = document.createElement("h4");
        nom.textContent = capacite.name;

        bloc.appendChild(nom);

        if (capacite.icon) {
            const icone = document.createElement("img");
            icone.src = capacite.icon;
            icone.alt = `Icône de ${capacite.name}`;
            icone.loading = "lazy";
            bloc.appendChild(icone);
        }

        const texte = document.createElement("p");
        texte.textContent =
            capacite.description || "Description indisponible.";

        bloc.appendChild(texte);
        details.appendChild(bloc);
    }
}

// Rechercher un héros par son nom
recherche.addEventListener("input", () => {
    const texte = recherche.value
        .trim()
        .toLocaleLowerCase("fr");

    const resultats = listeHeros.filter(hero =>
        hero.name.toLocaleLowerCase("fr").includes(texte)
    );

    afficherHeros(resultats);
});

// Fermer la fiche
boutonFermer.addEventListener("click", () => {
    fiche.hidden = true;
});

// Démarrer le site
chargerHeros();
