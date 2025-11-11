import { world, system } from "@minecraft/server";

// Functions
function getHeartScore(player) {
	const heartScore = world.scoreboard?.getObjective("heart");
	if (!heartScore) return 0;
	return heartScore.getScore(player) ?? 0;
}

function setHeartScore(player, value) {
	const heartScore = world.scoreboard?.getObjective("heart");
	if (!heartScore) return;
	heartScore.setScore(player, value);
}

// Death Events
world.afterEvents.entityDie.subscribe(({ deadEntity: entity }) => {
    if (entity?.typeId !== "minecraft:player") return;

    let value = getHeartScore(entity);
    // Jika masih diatas -10 heart atau diatas 1 heart, maka kurangi
    if (value > -10) setHeartScore(entity, value - 1);
})

// Spawn Events
world.afterEvents.playerSpawn.subscribe((event) => {
    const player = event.player;

    player.runCommand("scoreboard objectives add heart dummy");
    player.runCommand("scoreboard players add @s heart 0");
})

// Plus Heart
world.afterEvents.itemCompleteUse.subscribe(({ source: player, itemStack: item }) => {
    if (item.typeId === "hea:hearted_apple") {
        let value = getHeartScore(player);
        // Jika masih dibawah 90 atau 100 heart, maka tambahkan
        if (value < 90) setHeartScore(player, value + 1);
    }
})

// Heart apple effects
const HeartedAppleComponent = {
    onConsume({ source }, { params }) {
        // Iterates over each object in the component's array.
        for (const { name, duration, amplifier } of params) {
            source.addEffect(name, duration, { amplifier });
        }
    },
};

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    // Register the custom component for use in the item JSON file:
    itemComponentRegistry.registerCustomComponent("hea:hearted_apple_effects", HeartedAppleComponent);
});
