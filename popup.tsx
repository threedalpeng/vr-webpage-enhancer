import { useEffect, useReducer, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import "./style.css"

export default function IndexPopup() {
  const [zoom, setZoom] = useState(1)
  const [zoomMode, setZoomMode] = useState(1)
  const [isLoading, setLoading] = useState(true)
  const [currentUrl, setCurrentUrl] = useState("")

  useEffect(() => {
    console.log("effect")
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentTab = tabs[0]
      const currentUrl = new URL(currentTab.url)
      const zoomInfo = await chrome.runtime.sendMessage({
        target: "background",
        action: "get-tab-zoom",
        detail: {
          tabId: currentTab.id,
          host: currentUrl.host,
          url: currentUrl.host + currentUrl.pathname
        }
      })
      console.log(zoomInfo)
      setZoom(zoomInfo.globalZoom)
      setZoomMode(zoomInfo.uiZoomMode)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const onmessage = (message) => {
      if (message.target !== "popup") return

      if (message.action === "set-zoom") {
        console.log(message)
        setZoom(message.detail.zoom)
      }
    }
    chrome.runtime.onMessage.addListener(onmessage)
    return () => {
      chrome.runtime.onMessage.removeListener(onmessage)
    }
  }, [])

  // useEffect(() => {
  //   if (isLoading) return
  //   chrome.tabs.setZoom(zoom)
  // }, [zoom])

  return (
    <div className="flex w-80 flex-col p-4 text-[20px]">
      <div>
        <h1 className="font-bold">Webpage Enhancer for VR</h1>
      </div>
      {isLoading ? (
        <div className="">Loading...</div>
      ) : (
        <div className="flex flex-col">
          <label htmlFor="zoom">Zoom level</label>
          <div className="flex flex-row">
            <input
              className=""
              name="zoom"
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={zoom}
              onChange={async (e) => {
                const zoomInfo = await chrome.runtime.sendMessage({
                  target: "background",
                  action: "set-global-zoom",
                  detail: {
                    globalZoom: Number.parseFloat(e.target.value)
                  }
                })
                setZoom(zoomInfo.globalZoom)
              }}></input>

            <span className="flex-1">{zoom.toFixed(2)}</span>
          </div>
        </div>
      )}
      <a href="/tabs/check.html" target="_blank">
        <button>Open</button>
      </a>
      {currentUrl}
    </div>
  )
}
