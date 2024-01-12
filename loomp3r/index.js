import WaveSurfer from "https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js";
import RegionsPlugin from "https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js";

// XXX: Hack to allow interaction and listen to region-out
let disableRegionOut = false;
let disableRegionOutPauseMillis = 0;
const setDisableRegionOutTrue = () => {
  disableRegionOut = true;
  setTimeout(() => {
    disableRegionOut = false;
    disableRegionOutPauseMillis = 0;
  }, 100 + disableRegionOutPauseMillis);
};
let paused = false;

const initWavesurfer = async (blob) => {
  try {
    await initWavesurferInternal(blob);
    return true;
  } catch (err) {
    console.log(`Error loading file: ${err}`);
  }
  return false;
};

const initWavesurferInternal = async (blob) => {
  const ws = WaveSurfer.create({
    container: "#waveform",
    loop: true,
    mediaControls: true,
  });

  await ws.load(blob);

  ws.on("interaction", (e) => {
    console.log("interaction");
    paused = false;
    setDisableRegionOutTrue();
  });

  const wsRegions = ws.registerPlugin(RegionsPlugin.create({
    container: "#waveform",
    loop: true,
  }));

  wsRegions.enableDragSelection({
    color: "rgba(255, 0, 0, 0.1)",
    loop: true,
  });

  wsRegions.on("region-clicked", (region, e) => {
    e.stopPropagation();
    const start = region.start / ws.getDuration();
    region.loop = true;
    setDisableRegionOutTrue();
    region.play();
    paused = false;
  });

  wsRegions.on("region-out", async (region) => {
    if (disableRegionOut) {
      disableRegionOut = false;
      return;
    }

    if (paused) return;
    paused = true;

    if (Math.abs(region.end - ws.getCurrentTime()) > 0.1) return;

    const start = region.start / ws.getDuration();
    ws.pause();
    ws.seekTo(start);
    region.loop = true;

    let pause = 0;
    try {
      pause = parseInt($("#pause-secs").val());
    } catch (ignore) { }
    const pauseMillis = pause * 1000;
    disableRegionOutPauseMillis = pauseMillis;
    let timerInterval;
    if (pause) {
      let timeLeftMillis = pauseMillis;
      console.log("pausing for " + pause + " seconds");
      $("#timer").text(timeLeftMillis + "ms");
      $("#timer").css("width", "0%");
      $("#timer-wrapper").show();
      paused = true;
      timerInterval = setInterval(() => {
        if (!paused) {
          console.log("interrupted");
          // Let this be interruptable.
          // This fucking sucks.
          if (timerInterval) clearInterval(timerInterval);
          timerInterval = null;
          $("#timer-wrapper").hide();
          return;
        }
        timeLeftMillis -= 100;
        const perc = (pauseMillis - timeLeftMillis) / pauseMillis * 100;
        $("#timer").css("width", perc + "%");
        $("#timer").text(timeLeftMillis + "ms");
        if (timeLeftMillis <= 0) {
          $("#timer-wrapper").hide();
          region.play();
          paused = false;
          if (timerInterval) clearInterval(timerInterval);
        }
      }, 100);
    } else {
      region.play();
      paused = false;
    }
  });

  const saveRegions = () => {
    const json = JSON.stringify(wsRegions.regions);
    localStorage.setItem("regions", json);
  };

  const restoreRegions = () => {
    try {
      const json = JSON.parse(localStorage.getItem("regions"));
      debugger
      for (const region of json) {
        wsRegions.addRegion(region);
      }
    } catch (err) {
      alert(err);
    }
  };

  wsRegions.on("region-update-end", (region) => {
    region.loop = true;
    saveRegions();
  });

  wsRegions.on("region-created", saveRegions);
  wsRegions.on("region-removed", saveRegions);

  if (localStorage.getItem("regions")) {
    $("#restore-btn").show();
    $("#restore-btn").click(restoreRegions);
  } else {
    $("#restore-btn").hide();
  }
};

const main = async () => {
  const params = new URLSearchParams(document.location.search);
  const file = params.get("load");
  if (file) {
    if (await initWavesurfer(file)) {
      $("#upload-wrapper").hide();
      $("#player").show();
      return;
    }
    $("#waveform").empty();
    alert(`problem loading ${file}`);
  }

  $("#upload").change(() => {
    const file = document.getElementById("upload").files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = async (e) => {
      const blob = fileReader.result;
      if (await initWavesurfer(blob)) {
        $("#upload-wrapper").hide();
        $("#player").show();
        return;
      }
      $("#waveform").empty();
      alert(`problem loading ${file}`);
    };
  });
};

main();