
async function chargerHeros() {
    const reponse = await fetch(
        "https://overfast-api.tekrop.fr/heroes?locale=fr-fr"
    );

    if (!reponse.ok) {
        throw new Error("Impossible de récupérer les héros.");
    }

    const heros = await reponse.json();
    const conteneur = document.querySelector("#heros-container");

    // Création de la fenêtre modale
    const fond = document.createElement("div");
    fond.classList.add("modal-overlay");
    fond.setAttribute("aria-hidden", "true");

    fond.innerHTML = `
        <section class="hero-modal"
                 role="dialog"
                 aria-modal="true"
                 aria-labelledby="modal-title">

            <button class="modal-close"
                    type="button"
                    aria-label="Fermer">×</button>

            <div class="modal-content">
                <p class="modal-loading">Chargement...</p>
            </div>
        </section>
    `;

    document.body.appendChild(fond);

    const contenu = fond.querySelector(".modal-content");
    const boutonFermer = fond.querySelector(".modal-close");

    // Fonction pour fermer la fenêtre
    function fermerModal() {
        fond.classList.remove("visible");
        fond.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    }

    boutonFermer.addEventListener("click", fermerModal);

    // Fermer en cliquant sur le fond extérieur
    fond.addEventListener("click", function (event) {
        if (event.target === fond) {
            fermerModal();
        }
    });

    // Fermer avec la touche Échap
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            fermerModal();
        }
    });

    // Création des cartes des héros
    heros.forEach(function (hero) {
        const carte = document.createElement("article");
        carte.classList.add("hero-card");

        const portrait = document.createElement("img");
        portrait.src = hero.portrait;
        portrait.alt = "Portrait de " + hero.name;
        portrait.loading = "lazy";

        const infos = document.createElement("div");
        infos.classList.add("hero-info");

        const nom = document.createElement("h3");
        nom.textContent = hero.name;

        const role = document.createElement("span");
        role.classList.add("hero-role");
        role.textContent = hero.role;

        infos.append(nom, role);
        carte.append(portrait, infos);
        conteneur.appendChild(carte);

        // Ouvrir la fiche au clic
        carte.addEventListener("click", async function () {
            fond.classList.add("visible");
            fond.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");

            contenu.replaceChildren();

            const chargement = document.createElement("p");
            chargement.classList.add("modal-loading");
            chargement.textContent = "Chargement des capacités...";
            contenu.appendChild(chargement);

            try {
                const reponse = await fetch(
                    `https://overfast-api.tekrop.fr/heroes/${hero.key}?locale=fr-fr`
                );

                if (!reponse.ok) {
                    throw new Error("Impossible de charger ce héros.");
                }

                const donnees = await reponse.json();

                // Évite d'afficher un résultat si la fenêtre a été fermée
                if (!fond.classList.contains("visible")) return;

                contenu.replaceChildren();

                // En-tête de la fiche
                const entete = document.createElement("div");
                entete.classList.add("modal-header");

                const image = document.createElement("img");
                image.src = donnees.portrait || hero.portrait;
                image.alt = "";

                const titre = document.createElement("div");

                const h2 = document.createElement("h2");
                h2.id = "modal-title";
                h2.textContent = donnees.name || hero.name;

                const role = document.createElement("span");
                role.classList.add("hero-role");
                role.textContent = donnees.role || hero.role;

                titre.append(h2, role);
                entete.append(image, titre);
                contenu.appendChild(entete);

                // Description du héros
                if (donnees.description) {
                    const description = document.createElement("p");
                    description.classList.add("modal-description");
                    description.textContent = donnees.description;
                    contenu.appendChild(description);
                }

                // Titre des capacités
                const titreCapacites = document.createElement("h3");
                titreCapacites.classList.add("abilities-title");
                titreCapacites.textContent = "Capacités";
                contenu.appendChild(titreCapacites);

                // Liste des capacités
                const liste = document.createElement("div");
                liste.classList.add("abilities-list");

                (donnees.abilities || []).forEach(function (capacite) {
                    const bloc = document.createElement("article");
                    bloc.classList.add("ability");

                    const icone = document.createElement("img");
                    icone.src = capacite.icon;
                    icone.alt = "";
                    icone.loading = "lazy";

                    const nomCapacite = document.createElement("h4");
                    nomCapacite.textContent = capacite.name;

                    const texte = document.createElement("p");
                    texte.textContent = capacite.description || "";

                    bloc.append(icone, nomCapacite, texte);
                    liste.appendChild(bloc);
                });

                contenu.appendChild(liste);

            } catch (erreur) {
                contenu.replaceChildren();

                const message = document.createElement("p");
                message.textContent =
                    "Impossible de charger les capacités. Réessaie.";
                contenu.appendChild(message);

                console.error(erreur);
            }
        });
    });
}

chargerHeros().catch(function (erreur) {
    console.error(erreur);
});
