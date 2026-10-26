
async function chargerMaps() {
    const reponse = await fetch(
        "https://overfast-api.tekrop.fr/maps"
    );

    if (!reponse.ok) {
        throw new Error("Impossible de récupérer les maps.");
    }

    const maps = await reponse.json();
    const conteneur = document.querySelector("#maps-container");

    conteneur.replaceChildren();

    maps.forEach(function (map) {
        // Création de la carte
        const carte = document.createElement("a");
        carte.classList.add("map-card");

        // L'identifiant de la map sera transmis à la page suivante
        //carte.href = "map.html?map=" + encodeURIComponent(map.key);

        // Image de la map
        const image = document.createElement("img");
        image.src = map.screenshot;
        image.alt = "Map " + map.name;
        image.loading = "lazy";

        // Informations de la map
        const infos = document.createElement("div");
        infos.classList.add("map-info");

        const nom = document.createElement("h3");
        nom.textContent = map.name;

        const mode = document.createElement("p");
        mode.textContent = (map.gamemodes || [])
            .map(function (gamemode) {
                return gamemode.replace(/-/g, " ");
            })
            .join(" / ");

        infos.append(nom, mode);
        carte.append(image, infos);
        conteneur.appendChild(carte);
    });
}

chargerMaps().catch(function (erreur) {
    console.error(erreur);

    const conteneur = document.querySelector("#maps-container");
    conteneur.textContent = "Impossible de charger les maps.";
});
