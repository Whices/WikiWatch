
async function chargerClassement() {
   const conteneur = document.querySelector("#classement-heros");
   const selectPlateforme = document.querySelector("#plateforme");
   const selectRang = document.querySelector("#rang");
   const statut = document.querySelector("#meta-statut");

   try {
      const response = await fetch("data/meta.json");

      if (!response.ok) {
         throw new Error("Erreur HTTP : " + response.status);
      }

      const meta = await response.json();
      statut.textContent =
         `Plateforme : ${selectPlateforme.value} | ` +
         `Rang : ${selectRang.value === "All"
            ? "Tous les rangs"
            : "Diamant et supérieur"}`;

      const classement = [...meta.heroes]
         .sort((a, b) => b.winRate - a.winRate);

      conteneur.replaceChildren();

      classement.forEach((hero, index) => {
         const carte = document.createElement("article");
         carte.classList.add("hero-card");

         // Déterminer la couleur du win rate
         let couleurWinRate;

         if (hero.winRate < 49) {
            couleurWinRate = "winrate-bas";
         } else if (hero.winRate <= 51) {
            couleurWinRate = "winrate-moyen";
         } else {
            couleurWinRate = "winrate-haut";
         }

         // Créer le titre
         const titre = document.createElement("h3");
         titre.textContent = `${index + 1}. ${hero.name}`;

         // Créer le taux de victoire avec sa couleur
         const taux = document.createElement("p");
         taux.classList.add(couleurWinRate);
         taux.textContent = `Win rate : ${hero.winRate}%`;

         carte.append(titre, taux);
         conteneur.append(carte);
      });

   } catch (erreur) {
      console.error("Erreur lors du chargement du classement :", erreur);
      conteneur.textContent = "Le classement n'a pas pu être chargé.";
   }
}

document.querySelector("#plateforme").addEventListener("change", chargerClassement);
document.querySelector("#rang").addEventListener("change", chargerClassement);

chargerClassement();
