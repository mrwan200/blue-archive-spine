// Main
function exportAnimation(FPS = 60) {
  let exportCanvas = document.createElement("canvas");
  exportCanvas.id = "export-canvas";
  exportCanvas.style.display = "none";
  document.body.appendChild(exportCanvas);
  let exportVideo = document.createElement("video");
  exportVideo.controls = true;
  exportVideo.id = "export-video";

  let appExport = new PIXI.Application({
    width: 720,
    height: 1024,
    view: exportCanvas,
  });

  let cb = function (loader, res) {
    let exportChar = new PIXI.spine.Spine(res.char.spineData);
    exportChar.scale.x = exportChar.scale.y = char.scale.x;
    // console.log(char.x)
    // console.log(char.y)
    exportChar.x = char.x;
    exportChar.y = char.y;
    exportChar.state.setAnimation(0, option.animations.value, 0);

    appExport.stage.addChild(exportChar);

    // Export Section
    let videoStream = exportCanvas.captureStream(FPS); //default to 60
    let mediaRecorder = new MediaRecorder(videoStream);

    let chunks = [];
    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = function (e) {
      let blob = new Blob(chunks, { type: option.exportType.value });
      chunks = [];
      let videoURL = URL.createObjectURL(blob);
      exportVideo.src = videoURL;
    };
    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };

    // Get Animation Length
    let animLength = 0;
    for (var i in char.spineData.animations) {
      if (char.spineData.animations[i].name == option.animations.value) {
        animLength = char.spineData.animations[i].duration;
        break;
      }
    }

    //Modal Popup
    document.getElementById("rendering").style.display = "block";
    document.getElementById("complete").style.display = "none";
    UIkit.modal(document.getElementById("modal-exporter")).show();
    // Progressbar
    document.getElementById("export-progress").value = 0;
    let progress = setInterval(function () {
      document.getElementById("export-progress").value += 1;
    }, animLength * 10);

    // Record
    mediaRecorder.start();
    setTimeout(function () {
      mediaRecorder.stop();
      //Free Resources
      // appExport.stage.children.pop();
      appExport.stage.children = [];
      // appExport.loader.resources = {}; // fuck
      exportCanvas.remove();
      clearInterval(progress);

      //Update modal
      document.getElementById("rendering").style.display = "none";
      document.getElementById("complete").style.display = "block";
      document.getElementById("result").appendChild(exportVideo);
    }, animLength * 1000);
  }

  const bg = PIXI.Sprite.from(`./${(option.models.value).replace('.skel', '_Bg.png')}`);
  bg.x = 0;
  bg.y = 0;
  bg.width = 1024;
  bg.height = 1024;
  appExport.stage.addChild(bg);

  PIXI.Assets
    .load(`./${option.models.value}`)
    .then(r => cb(null, {
      char: {
        spineData: r.spineData
      }
    }));
}

// char.state.setAnimation(0, "Idle_01", false);
// mediaRecorder.start();
// setTimeout(function (){ mediaRecorder.stop(); }, 4000);
