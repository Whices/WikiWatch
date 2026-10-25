
async function chargerHeros() {
    const reponse = await fetch(
        "https://overfast-api.tekrop.fr/heroes?locale=fr-fr"
    );

    if (!reponse.ok) {
        throw new Error("Impossible de récupérer les héros.");
    }

    const heros = await reponse.json();

    const conteneur = document.querySelector("#heros-container");

    heros.forEach(function (hero) {
        // Création de la carte
        const carte = document.createElement("article");
        carte.classList.add("hero-card");

        // Création du portrait
        const portrait = document.createElement("img");
        portrait.src = hero.portrait;
        portrait.alt = "Portrait de " + hero.name;
        portrait.loading = "lazy";

        // Création de la zone d'informations
        const infos = document.createElement("div");
        infos.classList.add("hero-info");

        const nom = document.createElement("h3");
        nom.textContent = hero.name;

        const role = document.createElement("span");
        role.classList.add("hero-role");
        role.textContent = hero.role;

        // Assemblage de la carte
        infos.appendChild(nom);
        infos.appendChild(role);

        carte.appendChild(portrait);
        carte.appendChild(infos);

        conteneur.appendChild(carte);
    });
}

chargerHeros().catch(function (erreur) {
    console.error(erreur);
});
