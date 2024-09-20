import { useEffect, useReducer, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import "./style.css"

export default function IndexPopup() {
  const [zoom, setZoom] = useState(1)
  const [isLinkZoomChecked, setIsLinkZoomChecked] = useState(false)
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
      console.log(currentTab)
      setZoom(zoomInfo.globalZoom)
      setIsLinkZoomChecked(zoomInfo.linkZoom)
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

  return (
    <div className="flex w-[400px] flex-col p-4 text-[24px]">
      <div className="mb-24">
        <h1 className="font-bold">Webpage Enhancer for VR</h1>
      </div>
      {isLoading ? (
        <div className="">Loading...</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <label htmlFor="zoom">Zoom level: {zoom.toFixed(2)}</label>
            <div className="flex flex-row">
              <input
                className="range range-lg"
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
            </div>
          </div>
          <div className="divider"></div>
          <div className="flex flex-col gap-4">
            <label htmlFor="zoom">UI Zoom Mode</label>
            <label className="label cursor-pointer">
              <span className="text-[20px]">Bigger Text Link</span>
              <input
                type="checkbox"
                className="checkbox checkbox-lg"
                onChange={async (e) => {
                  const zoomInfo = await chrome.runtime.sendMessage({
                    target: "background",
                    action: "set-link-zoom",
                    detail: {
                      linkZoom: e.target.checked
                    }
                  })
                  console.log(zoomInfo, isLinkZoomChecked)
                  setIsLinkZoomChecked(zoomInfo.linkZoom)
                }}
                checked={isLinkZoomChecked}
              />
            </label>
          </div>
        </div>
      )}
      {/* <a href="/tabs/check.html" target="_blank">
        <button>Open</button>
      </a>
      {currentUrl} */}
    </div>
  )
}
