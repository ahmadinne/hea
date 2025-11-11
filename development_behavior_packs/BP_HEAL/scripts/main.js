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
    let newValue = value - 1;

    if (value >= 1) setHeartScore(entity, newValue);
})

// Spawn Events
world.afterEvents.playerSpawn.subscribe((event) => {
    const player = event.player;

    player.runCommand("scoreboard objectives add heart dummy");
    player.runCommand("scoreboard players add @s heart 0");

    let value = getHeartScore(player);
    let newValue = value - 1;

    if (value >= 1) player.runCommand(`effect @s health_boost infinite ${value - 1} true`);
})

// Nambah Heartnyia
world.afterEvents.itemCompleteUse.subscribe(({ source: player, itemStack: item }) => {
    if (item.typeId === "mv:hearted_apple") {
        let value = getHeartScore(player);

        if (value >= 5) {
            player.runCommand("title @s title Max Heart Reached!");
            player.runCommand("title @s subtitle You can't have more than 20 Hearts.");
            return;
        }
        setHeartScore(player, value + 1);

        value = getHeartScore(player);
        player.runCommand(`effect @s health_boost infinite ${value - 1} true`);
    }

    if (item.typeId === "minecraft:milk_bucket") {
        let value = getHeartScore(player);
        player.runCommand(`effect @s health_boost infinite ${value - 1} true`);
    }
})

// Hearted Apple Buffs
const HeartedAppleComponent = {
    onConsume({ source }, { params }) {
        // Iterates over each object in the component's array.
        for (const { name, duration, amplifier } of params) {
            source.addEffect(name, duration, { amplifier });
        }
    },
};


// Menerapkan Buff dan Fungsi dari Hearted Apple
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    // Register the custom component for use in the item JSON file:
    itemComponentRegistry.registerCustomComponent("mv:hearted_apple_effects", HeartedAppleComponent);
    // itemComponentRegistry.registerCustomComponent("mv:plus_heart", PlusHeart);
});
