/* WIKIWATCH — effets de souris (halo discret + inclinaison des cartes).
   Purement décoratif : ne lit ni ne modifie aucune donnée. */
(() => {
    "use strict";

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = !matchMedia("(pointer: coarse)").matches;
    if (reduce || !fine) return;

    /* Halo très léger qui suit le curseur */
    const glow = document.createElement("div");
    glow.className = "fx-cursor";
    glow.setAttribute("aria-hidden", "true");
    document.body.prepend(glow);
    addEventListener("pointermove", (e) => {
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, { passive: true });

    /* Lueur locale + inclinaison des cartes selon la position de la souris.
       Délégué sur document : fonctionne aussi pour les cartes créées par les scripts du site. */
    const SPOT = "header nav a, .hero-card, .map-card, .lien-carte, .bientot, .meta-filtres";
    const TILT = "#heros-container .hero-card, #maps-container .map-card, .accueil-liens .lien-carte";
    let cur = null;
    const reset = (el) => { el.style.removeProperty("--rx"); el.style.removeProperty("--ry"); };

    document.addEventListener("pointermove", (e) => {
        if (e.pointerType === "touch") return;
        const el = e.target.closest && e.target.closest(SPOT);
        if (cur && cur !== el) reset(cur);
        cur = el;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", px * 100 + "%");
        el.style.setProperty("--my", py * 100 + "%");
        if (el.matches(TILT)) {
            el.style.setProperty("--ry", ((px - 0.5) * 8).toFixed(2) + "deg");
            el.style.setProperty("--rx", ((0.5 - py) * 6).toFixed(2) + "deg");
        }
    }, { passive: true });

    document.addEventListener("mouseleave", () => { if (cur) reset(cur); cur = null; });
})();
