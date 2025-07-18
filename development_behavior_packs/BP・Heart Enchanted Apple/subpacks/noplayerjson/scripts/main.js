import { world, ItemStack, system } from "@minecraft/server";

// When Players Die
world.afterEvents.entityDie.subscribe(({ deadEntity: entity }) => {
    if (entity?.typeId !== "minecraft:player") return
    
    const heartScore = world.scoreboard?.getObjective("heart")
    let value = heartScore.getScore(entity)
    let newValue = value - 1
    
    if (value >= 1) heartScore.setScore(entity, newValue)
})

// When Players First spawned
world.afterEvents.playerSpawn.subscribe((event) => {
    const player = event.player
    
    player.runCommand("scoreboard objectives add heart dummy") 
    player.runCommand("scoreboard players add @s heart 0")

    const heartScore = world.scoreboard?.getObjective("heart")
    let value = heartScore.getScore(player)
    let newValue = value - 1
    
    if (value >= 1) player.runCommand(`effect @s health_boost infinite ${value - 1} true`)
})

// Nambah Heartnyia
world.afterEvents.itemCompleteUse.subscribe(({ source: player, itemStack: item }) => {
    if (item.typeId === "mv:hearted_apple") {
        const heartScore = world.scoreboard?.getObjective("heart")
        let value = heartScore.getScore(player)
        
        if (value >= 5) {
            player.runCommand("title @s title Max Heart Reached!")
            player.runCommand("title @s subtitle You can't have more than 20 Hearts.")
            return
        }
        
        heartScore.addScore(player, 1)
        
        value = heartScore.getScore(player)

        player.runCommand(`effect @s health_boost infinite ${value - 1} true`)
    } 
    
    if (item.typeId === "minecraft:milk_bucket") {
        const heartScore = world.scoreboard?.getObjective("heart")
        let value = heartScore.getScore(player)
        player.runCommand(`effect @s health_boost infinite ${value - 1} true`)
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

// Hearted Apple Functions
// const PlusHeart = {
//     onConsume({ source }) {
//         source.runCommand("scoreboard players add @s heart 1");
//     }
// };

// Menerapkan Buff dan Fungsi dari Hearted Apple
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    // Register the custom component for use in the item JSON file:
    itemComponentRegistry.registerCustomComponent("mv:hearted_apple_effects", HeartedAppleComponent);
    // itemComponentRegistry.registerCustomComponent("mv:plus_heart", PlusHeart);
});