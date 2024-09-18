import {
  getGlobalZoom,
  getUiZoomMode,
  onStorageWatch,
  setGlobalZoom
} from "~libs/store"

export {}

chrome.runtime.onMessage.addListener(
  async (message: MessageRequest<any>, sender, sendResponse) => {
    if (message.target !== "background") return

    const globalZoom = await getGlobalZoom()
    const uiZoomMode = await getUiZoomMode()
    const baseResponse = {
      globalZoom,
      uiZoomMode
    }

    switch (message.action) {
      case "get-zoom-info":
        break
      case "get-tab-zoom":
        const { tabId, host, url } = message.detail
        sendResponse(baseResponse)
        break
      case "get-global-zoom":
        sendResponse(baseResponse)
        break
      case "set-global-zoom":
        setGlobalZoom(message.detail.globalZoom)
        sendResponse(baseResponse)
        break
      case "load-zoom":
        chrome.tabs.setZoom(globalZoom)
        // setGlobalZoom(message.detail.globalZoom)
        // sendResponse({
        //   globalZoom
        // })
        break
    }
  }
)

onStorageWatch({
  "global-zoom": (change) => {
    console.log("GlobalZoomChange")
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.setZoom(tab.id, change.newValue)
        // chrome.tabs.sendMessage(tab.id, {
        //   target: "tab",
        //   action: "set-zoom",
        //   detail: {
        //     zoom: change.newValue
        //   }
        // })
        chrome.runtime.sendMessage({
          target: "popup",
          action: "set-zoom",
          detail: {
            zoom: change.newValue
          }
        })
      })
    })
  }
})

chrome.tabs.getZoom()

chrome.tabs.onZoomChange.addListener(async (e) => {
  if ((await getGlobalZoom()) === e.newZoomFactor) return
  await setGlobalZoom(e.newZoomFactor)
})
