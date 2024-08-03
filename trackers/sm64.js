window.specificUpdate = function specificUpdate() {
    let count = Object.groupBy(received, (x) => x.item);
    let locations = [...(our_game.checked_locations || []), ...(our_game.missing_locations || [])]// Object.values(game_package.games["Ocarina of Time"].location_name_to_id)
    let locations_details = locations.map(
        x => {
            return {
                id: x,
                name: game_package.games["Super Mario 64"].location_id_to_name[x],
                checked: (our_game.checked_locations || []).includes(x)
            }
        }
    )

    function inv(id) {
        return count[id]?.length || 0
    }
    function has(id) {
        if (id.includes) {
            //Is a name, convert to id
            id = game_package.games["Super Mario 64"].item_name_to_id[id];
        }
        return inv(id) > 0;
    }
    function is100Coins() {
        return our_game.checked_locations?.find(x => (game_package.games["Super Mario 64"].location_id_to_name[x] || "").includes("100 Coins")) ||
            our_game.missing_locations?.find(x => (game_package.games["Super Mario 64"].location_id_to_name[x] || "").includes("100 Coins"))
    }
    function locationExist(name) {
        return our_game.checked_locations?.find(x => (game_package.games["Super Mario 64"].location_id_to_name[x] || "") == name) ||
            our_game.missing_locations?.find(x => (game_package.games["Super Mario 64"].location_id_to_name[x] || "") == name)
    }
    function exist(name) {
        return (game_package.games["Super Mario 64"].item_name_to_id[name])
    }
    function isCompleted(name) {
        return our_game.checked_locations?.filter(x => (game_package.games["Super Mario 64"].location_id_to_name[x] || "").includes(name))?.length >= 1
    }
    let action_item_table = {
        "Double Jump": 3626185,
        "Triple Jump": 3626186,
        "Long Jump": 3626187,
        "Backflip": 3626188,
        "Side Flip": 3626189,
        "Wall Kick": 3626190,
        "Dive": 3626191,
        "Ground Pound": 3626192,
        "Kick": 3626193,
        "Climb": 3626194,
        "Ledge Grab": 3626195
    }
    /*"Triple Jump": 3626186,
    "Long Jump": 3626187,
    "Backflip": 3626188,
    "Side Flip": 3626189,
    "Wall Kick": 3626190,
    "Dive": 3626191,
    "Ground Pound": 3626192,
    "Kick": 3626193,
    "Climb": 3626194,
    "Ledge Grab": 3626195*/
    //our_game.slot_data.MoveRandoVec //Need to check if randomized
    let abilities = {
        "back-flip": has(3626188) || !isMoveRandomized("Backflip"),
        "climb": has(3626194) || !isMoveRandomized("Climb"),
        "dive": has(3626191) || !isMoveRandomized("Dive"),
        "ground-pound": has(3626192) || !isMoveRandomized("Ground Pound"),
        "kick": has(3626193) || !isMoveRandomized("Kick"),
        "ledge-grab": has(3626195) || !isMoveRandomized("Ledge Grab"),
        "long-jump": has(3626187) || !isMoveRandomized("Long Jump"),
        "side-flip": has(3626189) || !isMoveRandomized("Side Flip"),
        "triple-jump": has(3626186) || !isMoveRandomized("Triple Jump"),
        "wall-kick": has(3626190) || !isMoveRandomized("Wall Kick"),
        "metal": has(3626182),
        "wing": has(3626181),
        "vanish": has(3626183)
    }
    function isMoveRandomized(name) {
        let id = (1 << (action_item_table[name] - action_item_table['Double Jump']))
        return (our_game.slot_data.MoveRandoVec & id) > 0
    }


    let keys = {
        1: inv(3626178) > 0 || inv(3626180) > 0,
        2: inv(3626179) > 0 || inv(3626180) > 1
    }
    let power_stars = inv(3626000);

    for (let abilityBox of $("[data-ability]")) {
        let box = $(abilityBox);
        let ab = box.attr("data-ability");
        if (abilities[ab])
            box.addClass("obtained");
        else
            box.removeClass("obtained");
    }
    for (let abilityBox of $("[data-cap]")) {
        let box = $(abilityBox);
        let ab = box.attr("data-cap");
        if (abilities[ab])
            box.addClass("obtained");
        else
            box.removeClass("obtained");
    }
    for (let abilityBox of $("[data-door]")) {
        let box = $(abilityBox);
        let ab = box.attr("data-door");
        if (power_stars >= our_game.slot_data[ab])
            box.addClass("obtained");
        else
            box.removeClass("obtained");
    }
    for (let abilityBox of $("[data-mips]")) {
        let box = $(abilityBox);
        let ab = box.attr("data-mips");
        if (power_stars >= our_game.slot_data["MIPS" + ab + "Cost"]) {
            box.addClass("reachable");
            if (isCompleted("MIPS " + ab)) {
                box.addClass("obtained");
            }
        }
        else {
            box.removeClass("reachable");
            box.removeClass("obtained");
        }
    }
    for (let abilityBox of $("[data-toad]")) {
        let box = $(abilityBox);
        let ab = box.attr("data-toad");
        if (power_stars >= {
            "Basement":12,
            "Second Floor":25,
            "Third Floor":35
        }[ab]) {
            box.addClass("reachable");
            if (isCompleted("Toad (" + ab+")")) {
                box.addClass("obtained");
            }
        }
        else {
            box.removeClass("reachable");
            box.removeClass("obtained");
        }
    }
    for (let abilityBox of $("[data-key]")) {
        let box = $(abilityBox);
        let ab = box.attr("data-key");
        if (keys[ab])
            box.addClass("obtained");
        else
            box.removeClass("obtained");
    }
    for (let abilityBox of $("[data-fill]")) {
        let box = $(abilityBox);
        let ab = box.attr("data-fill");
        if (ab == "power_stars")
            box.text(power_stars + "");
    }
    for (let abilityBox of $("[data-prefix]")) {
        let box = $(abilityBox);
        let prefix = box.attr("data-prefix");

        //Is there a status bar
        let bar = box.siblings(".status")
        if (bar.length == 0) {
            bar = $("<div>").addClass("status");
            bar.insertAfter(box);
        }
        let bar2 = box.siblings(".status-2")
        if (bar2.length == 0) {
            bar2 = $("<div>").addClass("status-2");
            bar2.insertAfter(bar);
        }

        //Is 100 coins stars enabled
        if (is100Coins() && locationExist(prefix + "100 Coins")) {
            let _100coins = bar.find(".coins");
            if (_100coins.length == 0) {
                bar.append(_100coins = $("<img>").addClass("coins").attr("src", "trackers/sm64/settings/Coin.png"))
            }
            //Check or add status coin
            if (isCompleted(prefix + "100 Coins"))
                _100coins.addClass("completed")
            else
                _100coins.removeClass("completed")
        }
        //Is there a cannon there
        if (exist("Cannon Unlock " + prefix.replace(":", "").replace(" ", ""))) {
            let _cannon = bar.find(".cannon");
            if (_cannon.length == 0) {
                bar.append(_cannon = $("<img>").addClass("cannon").attr("src", "trackers/sm64/varios/Cannon.png"))
            }
            //Check or add status coin
            if (has("Cannon Unlock " + prefix.replace(":", "").replace(" ", "")))
                _cannon.addClass("obtained")
            else
                _cannon.removeClass("obtained")
            //Add cannon status
        }
        if (locationExist(prefix + "Bob-omb Buddy")) {
            let _cannon = bar.find(".buddy");
            if (_cannon.length == 0) {
                bar.append(_cannon = $("<img>").addClass("buddy").attr("src", "trackers/sm64/settings/pinkbomb.png"))
            }
            //If Bob-omb buddy exists for that level
            if (isCompleted(prefix + "Bob-omb Buddy"))
                _cannon.addClass("completed")
            else
                _cannon.removeClass("completed")

        }
        //locations_details

        let loc_for_world = locations_details.filter(x => x.name.startsWith(prefix))
        let checked_in_world = loc_for_world.filter(x => x.checked).length;

        bar2.text(checked_in_world + "/" + loc_for_world.length)
        {
            //Validate based on logic because blanks could misfire
            let third_floor = keys[2] && power_stars >= our_game.slot_data.SecondFloorDoorCost;

            let lvl = box.attr("data-lvl");

            function canReach(id) {
                let requirements = {
                    BOB_OMB_BATTLEFIELD: true,
                    WHOMPS_FORTRESS: power_stars >= 1,
                    JOLLY_ROGER_BAY: power_stars >= 3,
                    COOL_COOL_MOUNTAIN: power_stars >= 3,
                    BIG_BOOS_HAUNT: power_stars >= 12,
                    HAZY_MAZE_CAVE: keys[1],
                    LETHAL_LAVA_LAND: keys[1],
                    SHIFTING_SAND_LAND: keys[1],
                    DIRE_DIRE_DOCKS: keys[1] && power_stars >= our_game.slot_data.BasementDoorCost,
                    SNOWMANS_LAND: keys[2],
                    WET_DRY_WORLD: keys[2],
                    TALL_TALL_MOUNTAIN: keys[2],
                    TINY_HUGE_ISLAND_TINY: keys[2],
                    TINY_HUGE_ISLAND_HUGE: keys[2],
                    TICK_TOCK_CLOCK: third_floor,
                    RAINBOW_RIDE: third_floor,
                    THE_PRINCESS_SECRET_SLIDE: power_stars >= 1,
                    BOWSER_IN_THE_DARK_WORLD: power_stars >= our_game.slot_data.FirstBowserDoorCost,
                    TOWER_OF_THE_WING_CAP: power_stars >= 10,
                    VANISH_CAP_UNDER_THE_MOAT: abilities["ground-pound"] && keys[1],
                    BOWSER_IN_THE_FIRE_SEA: power_stars >= our_game.slot_data.BasementDoorCost && keys[1] && isCompleted("DDD: Board Bowser's Sub"),//Replace true with accessing DDD
                    WING_MARIO_OVER_THE_RAINBOW: third_floor,
                    END: third_floor && power_stars >= our_game.slot_data.StarsToFinish
                }
                if (id == 1) {
                    return third_floor && power_stars >= our_game.slot_data.StarsToFinish;
                }
                let entry = Object.entries(our_game.slot_data.AreaRando).filter(x => x[1] == id)[0];
                if (!entry) return true;
                let level = [
                    ['BOB_OMB_BATTLEFIELD', 91],
                    ['WHOMPS_FORTRESS', 241],
                    ['JOLLY_ROGER_BAY', 121],
                    ['COOL_COOL_MOUNTAIN', 51],
                    ['BIG_BOOS_HAUNT', 41],
                    ['HAZY_MAZE_CAVE', 71],
                    ['LETHAL_LAVA_LAND', 221],
                    ['SHIFTING_SAND_LAND', 81],
                    ['DIRE_DIRE_DOCKS', 231],
                    ['SNOWMANS_LAND', 101],
                    ['WET_DRY_WORLD', 111],
                    ['TALL_TALL_MOUNTAIN', 361],
                    ['TINY_HUGE_ISLAND_TINY', 132],
                    ['TINY_HUGE_ISLAND_HUGE', 131],
                    ['TICK_TOCK_CLOCK', 141],
                    ['RAINBOW_RIDE', 151],
                    ['THE_PRINCESS_SECRET_SLIDE', 271],
                    ['THE_SECRET_AQUARIUM', 201],
                    ['BOWSER_IN_THE_DARK_WORLD', 171],
                    ['TOWER_OF_THE_WING_CAP', 291],
                    ['CAVERN_OF_THE_METAL_CAP', 281],
                    ['VANISH_CAP_UNDER_THE_MOAT', 181],
                    ['BOWSER_IN_THE_FIRE_SEA', 191],
                    ['WING_MARIO_OVER_THE_RAINBOW', 311],
                    ['END', 1]
                ].find(x => x[1] == entry[0]);
                //Level name
                if (level[0] == "CAVERN_OF_THE_METAL_CAP")
                    return canReach(71);
                if (level[0] == "THE_SECRET_AQUARIUM") {
                    return power_stars > 3 && (abilities["back-flip"] || abilities["ledge-grab"] || abilities["triple-jump"])
                }
                if (level[0] == "END")
                    return third_floor && keys[2] && power_stars >= our_game.slot_data.StarsToFinish;
                return requirements[level[0]];
            }
            //requirements.CAVERN_OF_THE_METAL_CAP:false,//This one is weird ... as it needs HMC
            //requirements.THE_SECRET_AQUARIUM:power_stars>1,//AND MOVE

            let has_requirement = (lvl == 132 || lvl == 131) ? (canReach(131) || canReach(132)) : canReach(lvl)
            if (has_requirement)
                box.addClass("obtained");
            else
                box.removeClass("obtained");

        }
    }
};
class SM64Level {
    static BOB_OMB_BATTLEFIELD = 91
    static WHOMPS_FORTRESS = 241
    static JOLLY_ROGER_BAY = 121
    static COOL_COOL_MOUNTAIN = 51
    static BIG_BOOS_HAUNT = 41
    static HAZY_MAZE_CAVE = 71
    static LETHAL_LAVA_LAND = 221
    static SHIFTING_SAND_LAND = 81
    static DIRE_DIRE_DOCKS = 231
    static SNOWMANS_LAND = 101
    static WET_DRY_WORLD = 111
    static TALL_TALL_MOUNTAIN = 361
    static TINY_HUGE_ISLAND_TINY = 132
    static TINY_HUGE_ISLAND_HUGE = 131
    static TICK_TOCK_CLOCK = 141
    static RAINBOW_RIDE = 151
    static THE_PRINCESS_SECRET_SLIDE = 271
    static THE_SECRET_AQUARIUM = 201
    static BOWSER_IN_THE_DARK_WORLD = 171
    static TOWER_OF_THE_WING_CAP = 291
    static CAVERN_OF_THE_METAL_CAP = 281
    static VANISH_CAP_UNDER_THE_MOAT = 181
    static BOWSER_IN_THE_FIRE_SEA = 191
    static WING_MARIO_OVER_THE_RAINBOW = 311
}