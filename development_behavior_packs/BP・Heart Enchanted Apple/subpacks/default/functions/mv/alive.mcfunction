# Skorbor
scoreboard objectives add heart dummy §4Heart
scoreboard objectives add status dummy
scoreboard objectives add player dummy
scoreboard players add @a heart 0
scoreboard players add @a player 0
scoreboard players add mv player 0

# Command
execute as @s[tag=gained] run scoreboard players set @s status 1
execute as @s[tag=gained] run scoreboard players remove @a[tag=dead,scores={heart=-9..40}] heart 1
function mv/max

# Joined
scoreboard players set @a[tag=!joined] heart 0
execute as @s[tag=!joined] run scoreboard players add mv player 1
scoreboard players operation @s[tag=!joined] player = mv player
execute if score @s player matches 1 run tag @s add player

# Warning
# tellraw @s[tag=!joined] {"rawtext":[{"text":"§l§6Thanks for using Hearted Golden Apple!\nDon't Forget to enable the Experimental:\n Holiday and Upcoming Feature\nor it won't work :>"}]}

# Plus n Minus
execute if score @s status matches 1 run scoreboard players add @s[scores={heart=-9..50}] heart 1
execute if score @s status matches 2 run scoreboard players remove @s[scores={heart=-8..50}] heart 1
# Reset the Player
execute if score @s status matches 1 run scoreboard players set @a status 0
execute if score @s status matches 2 run scoreboard players set @a status 0

# Done
gamerule sendcommandfeedback false
gamerule commandblockoutput false
scoreboard players set @a[scores={heart=-69420..-11}] heart -10
tag @a[tag=dead] remove dead
tag @s[tag=!joined] add joined
tag @e[tag=gained] add gained