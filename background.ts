import {
  getGlobalZoom,
  getLinkZoom,
  onStorageWatch,
  setGlobalZoom,
  setLinkZoom
} from "~libs/store"

export {}

const createBaseResponse = async () => {
  const globalZoom = await getGlobalZoom()
  const linkZoom = await getLinkZoom()
  const baseResponse = {
    globalZoom,
    linkZoom
  }
  return baseResponse
}

chrome.runtime.onMessage.addListener(
  async (message: MessageRequest<any>, sender, sendResponse) => {
    if (message.target !== "background") return

    switch (message.action) {
      case "get-zoom-info":
        break
      case "get-tab-zoom":
        const { tabId, host, url } = message.detail
        console.log('popup start')
        sendResponse(await createBaseResponse())
        break
      case "get-global-zoom":
        sendResponse(await createBaseResponse())
        break
      case "set-global-zoom":
        await setGlobalZoom(message.detail.globalZoom)
        sendResponse(await createBaseResponse())
        break
      case "set-link-zoom":
        await setLinkZoom(message.detail.linkZoom)
        sendResponse(await createBaseResponse())
        break
      case "load-zoom":
        chrome.tabs.setZoom(await getGlobalZoom())
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
    console.log("global zoom change")
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
      })
      chrome.runtime.sendMessage({
        target: "popup",
        action: "set-zoom",
        detail: {
          zoom: change.newValue
        }
      })
    })
  },
  "link-zoom": (change) => {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          target: "tab",
          action: "link-zoom",
          detail: {
            zoom: change.newValue
          }
        })
      })
    })
  }
})

chrome.tabs.onZoomChange.addListener(async (e) => {
  if ((await getGlobalZoom()) === e.newZoomFactor) return
  console.log(e)
  await setGlobalZoom(e.newZoomFactor)
})
