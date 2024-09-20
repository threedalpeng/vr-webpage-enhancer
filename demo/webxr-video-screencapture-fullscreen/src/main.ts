import {
  ArcRotateCamera,
  Color3,
  Engine,
  Mesh,
  MeshBuilder,
  PointerEventTypes,
  Scene,
  StandardMaterial,
  Vector3,
  VideoTexture
} from "@babylonjs/core"

import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"

import { originCanvas } from "./dom"

const engine = new Engine(originCanvas, true)

async function createScene() {
  const scene = new Scene(engine)
  var camera = new ArcRotateCamera(
    "arcR",
    -Math.PI / 2,
    Math.PI / 2,
    15,
    Vector3.Zero(),
    scene
  )
  camera.attachControl(originCanvas, true)
  const ANote0Video = MeshBuilder.CreatePlane(
    "plane",
    {
      height: 5.4762,
      width: 7.3967,
      sideOrientation: Mesh.DOUBLESIDE
    },
    scene
  )
  ANote0Video.position = new Vector3(0, 0, 0.1)
  return { scene, ANote0Video }
}

const { scene, ANote0Video } = await createScene()

;(document.getElementById("button1") as HTMLButtonElement).addEventListener(
  "click",
  async () => {
    originCanvas.requestFullscreen({ navigationUI: "hide" }).then(async () => {
      const displayMedia = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
        preferCurrentTab: true
      })
      const videoEl = document.createElement("video")
      videoEl.srcObject = displayMedia
      var ANote0VideoMat = new StandardMaterial("m", scene)
      var ANote0VideoVidTex = new VideoTexture("vidtex", videoEl, scene)
      ANote0VideoMat.diffuseTexture = ANote0VideoVidTex
      ANote0VideoMat.roughness = 1
      ANote0VideoMat.emissiveColor = Color3.White()
      ANote0Video.material = ANote0VideoMat
      scene.onPointerObservable.add(function (evt) {
        if (evt.pickInfo!.pickedMesh === ANote0Video) {
          //console.log("picked");
          if (ANote0VideoVidTex.video.paused) ANote0VideoVidTex.video.play()
          else ANote0VideoVidTex.video.pause()
          console.log(ANote0VideoVidTex.video.paused ? "paused" : "playing")
        }
      }, PointerEventTypes.POINTERPICK)

      engine.runRenderLoop(function () {
        scene.render()
      })
      // Watch for browser/canvas resize events
      window.addEventListener("resize", function () {
        engine.resize()
      })
    })
  }
)
