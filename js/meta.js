   async function chargerClassement() {
  const conteneur = document.querySelector("#classement-heros");

  try {
    const response = await fetch("data/meta.json");

    if (!response.ok) {
      throw new Error("Erreur HTTP : " + response.status);
    }

    const meta = await response.json();

    const classement = meta.heroes
      .filter(hero => hero.winRate >= 50)
      .sort((a, b) => b.winRate - a.winRate);

    classement.forEach((hero, index) => {
      const carte = document.createElement("article");
      carte.classList.add("hero-card");

      const titre = document.createElement("h3");
      titre.textContent = `${index + 1}. ${hero.name}`;

      const taux = document.createElement("p");
      taux.textContent = `Win rate : ${hero.winRate}%`;

      carte.append(titre, taux);
      conteneur.append(carte);
    });
  } catch (erreur) {
    console.error("Erreur lors du chargement du classement :", erreur);
    conteneur.textContent = "Le classement n'a pas pu être chargé.";
  }
}

chargerClassement();
