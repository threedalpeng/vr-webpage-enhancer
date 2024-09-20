import { querySelectorAllDeep } from "query-selector-shadow-dom"

export {}

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.target !== "tab") return

  if (req.action === "link-zoom") {
    console.log("hi")
    if (req.detail.zoom) {
      querySelectorAllDeep("a").forEach((a: HTMLAnchorElement) => {
        const height = a.getBoundingClientRect().height
        if (0 < height && height < 44) {
          const target = document.createElement("div")
          target.className = "vr-text-link-zoom-container"
          a.style.position =
            a.style.position === "" ? "relative" : a.style.position
          a.appendChild(target)
          target.style.position = "absolute"
          target.style.left = "50%"
          target.style.top = "50%"
          target.style.transform = "translate(-50%,-50%)"
          target.style.width = "max(calc(100% + 4px), 44px)"
          target.style.height = "max(calc(100% + 4px), 44px)"
          target.style.backgroundColor = "rgb(0 0 0 / 10%)"
        }
      })
    } else {
      querySelectorAllDeep("a").forEach((a: HTMLAnchorElement) => {
        const x = a.getElementsByClassName("vr-text-link-zoom-container")
        if (x.length > 0) {
          ;[...x].forEach((target) => {
            target.remove()
          })
        }
      })
    }
  }
})

window.addEventListener("load", (e) => {
  chrome.runtime.sendMessage({})
})
