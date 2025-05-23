// js/fireParticles.js

// Inject the container if it doesn't already exist
if (!document.getElementById("tsparticles")) {
    const container = document.createElement("div");
    container.id = "tsparticles";
    document.body.prepend(container);
}

// Load tsParticles and fire preset
(async () => {
    if (typeof tsParticles === "undefined") {
        console.error("tsParticles not loaded.");
        return;
    }

    await loadFirePreset(tsParticles);

    await tsParticles.load({
        id: "tsparticles",
        options: {
            preset: "fire",
        },
    });
})();
