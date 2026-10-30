
async function chargerClassement() {
    const conteneur = document.querySelector("#classement-heros");

    try {
        const response = await fetch("data/meta.json");

        if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
        }

        const donnees = await response.json();

        // Trier les héros par win rate décroissant
        const classement = [...donnees.heroes].sort(
            (a, b) => b.winRate - a.winRate
        );

        // Vider le conteneur
        conteneur.replaceChildren();

        classement.forEach((hero, index) => {

            // Créer la carte
            const carte = document.createElement("article");
            carte.classList.add("hero-card");

            // Identité du héros
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
            role.textContent = hero.role;

            informations.append(nom, role);

            const rang = document.createElement("span");
            rang.classList.add("hero-rank");
            rang.textContent = `#${String(index + 1).padStart(2, "0")}`;

            identite.append(portrait, informations, rang);

            // Statistiques
            const statistiques = document.createElement("div");
            statistiques.classList.add("hero-stats");

            // Déterminer la couleur du win rate
            let couleurWinRate;

            if (hero.winRate < 49) {
                couleurWinRate = "winrate-bas";
            } else if (hero.winRate <= 51) {
                couleurWinRate = "winrate-moyen";
            } else {
                couleurWinRate = "winrate-haut";
            }

            const stats = [
                {
                    nom: "WIN RATE",
                    valeur: hero.winRate,
                    classe: couleurWinRate
                },
                {
                    nom: "PICK RATE",
                    valeur: hero.pickRate
                },
                {
                    nom: "BAN RATE",
                    valeur: hero.banRate
                }
            ];

            stats.forEach(stat => {
                const bloc = document.createElement("div");
                bloc.classList.add("stat");

                const valeur = document.createElement("span");
                valeur.classList.add("stat-value");

                if (stat.classe) {
                    valeur.classList.add(stat.classe);
                }

                valeur.textContent = `${Number(stat.valeur).toFixed(1)}%`;

                const label = document.createElement("span");
                label.classList.add("stat-label");
                label.textContent = stat.nom;

                bloc.append(valeur, label);
                statistiques.append(bloc);
            });

            // Ajouter les éléments à la carte
            carte.append(identite, statistiques);
            conteneur.append(carte);
        });

    } catch (erreur) {
        console.error("Erreur de chargement du classement :", erreur);
        conteneur.textContent = "Le classement n'a pas pu être chargé.";
    }
}

chargerClassement();
