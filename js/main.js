let app;
let char;
let audioList = []
let isCharacterLoaded = false;
let debug = 0; //set via console

function reCanvas() {
    app = new PIXI.Application(
        {
            // width: window.innerWidth,
            // height: window.innerHeight,
            width: 720,
            height: 1024,
            view: document.getElementById("screen")
        }
    );
}

async function loadChar(model) {
    isCharacterLoaded = false;
    // remove previous spine
    if(app.stage.children.length > 0) {
        // app.stage.children.pop();
        app.stage.children = []
    }

    // frontend-only
    // assets/spine/Gcg_CardFace_Char_Avatar_Ayaka_Spine/Gcg_CardFace_Char_Avatar_Ayaka_Spine_Bg.png
    // document.body.style.backgroundImage = `url('/${model.replace('.skel', '_Bg.png')}');`
    document.body.style = `background: url('${model.replace('.skel', '_Bg.png')}'), black;`

    const bg = PIXI.Sprite.from(`./${model.replace('.skel', '_Bg.png')}`);
    bg.x = 0;
    bg.y = 0;
    bg.width = 720;
    bg.height = 1024;
    app.stage.addChild(bg);

    // load new spine
    await PIXI.Assets.load(`./${model}`)
        .then(r => onAssetsLoaded(null, {
            char: {
                spineData: r.spineData
            }
        }));
}

function onAssetsLoaded(loader,res) {
    char = new PIXI.spine.Spine(res.char.spineData);

    // console.log(char)
    // console.log(char.spineData.height)
    // console.log(char.spineData.width)

    // Scaler
    char.scale.x = 1;
    char.scale.y = 1;

    // Centerize
    char.x = 720 / 2;
    char.y = 1024 / 2;

    //Set option value
    // option.scale.value = 0.5;
    // option.x.value = char.x;
    // option.y.value = char.y;

    // Insert animations to index.html
    const animations = res.char.spineData.animations;
    let check = 0;
    option.animations.innerHTML = "";
    for(var i in animations) {
        let a = document.createElement("option");
        a.value = a.innerHTML = animations[i].name;
        option.animations.append(a)
        if(animations[i].name == "Start_Idle_01")
            check = 1;
    }

    //Play Animation
    if(check) {
        char.state.setAnimation(0, "Start_Idle_01", option.loop.checked);
        optionAnimations.value = "Start_Idle_01";
    } else {
        char.state.setAnimation(0, animations[0].name, option.loop.checked);
    }

    //Add to main canvas
    app.stage.addChild(char);
    isCharacterLoaded = true;
}

function playAnimation(name) {
    char.state.setAnimation(0, name, option.loop.checked);
}