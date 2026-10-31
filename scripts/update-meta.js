
const fs = require("node:fs/promises");

async function recupererStatistiques(rang, fichier) {

    const url = `https://overwatch.blizzard.com/en-us/rates/data/?input=Console&map=all-maps&region=Europe&role=All&rq=1&tier=${rang}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Erreur HTTP : " + response.status);
    }

    const donnees = await response.json();

    const heros = donnees.rates.rates.map(item => ({
        key: item.id,
        name: item.cells.name,
        winRate: item.cells.winrate,
        pickRate: item.cells.pickrate,
        banRate: item.cells.banrate,
        portrait: item.hero.portrait,
        role: item.hero.role
    }));

    const resultat = {
        metadata: {
            rankScope: rang,
            updatedAt: new Date().toISOString().slice(0, 10),
            status: "live"
        },
        heroes: heros
    };

    await fs.writeFile(
        fichier,
        JSON.stringify(resultat, null, 2),
        "utf8"
    );

    console.log(`${fichier} a été mis à jour !`);
}

async function mettreAJourClassements() {

    await recupererStatistiques("All", "data/meta.json");

    await recupererStatistiques("Platinum", "data/meta-plat.json");

    await recupererStatistiques("Diamond", "data/meta-diamond.json");

    await recupererStatistiques("Emerald", "data/meta-emerald.json");

    await recupererStatistiques("Master", "data/meta-master.json");

}

mettreAJourClassements().catch(erreur => {
    console.error("Erreur :", erreur);
    process.exitCode = 1;
});
