async function chargerClassement() {
    try {
        const response = await fetch(
            "https://overwatch.blizzard.com/en-us/rates/data/?input=Console&map=all-maps&region=Europe&role=All&rq=1&tier=Diamond"
        );

        if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
        }

        const donnees = await response.json();

        console.log(donnees);

    } catch (erreur) {
        console.error("Erreur de chargement :", erreur);
    }
}

chargerClassement();