import { system } from "@minecraft/server";

const HeartedAppleComponent = {
    onConsume({ source }, { params }) {
        // Iterates over each object in the component's array.
        for (const { name, duration, amplifier } of params) {
            source.addEffect(name, duration, { amplifier });
        }
    },
};

const PlusHeart = {
    onConsume({ source }) {
        source.runCommand("scoreboard players set @s status 1");
    }
};

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    // Register the custom component for use in the item JSON file:
    itemComponentRegistry.registerCustomComponent("mv:hearted_apple_effects", HeartedAppleComponent);
    itemComponentRegistry.registerCustomComponent("mv:plus_heart", PlusHeart);
});