import { Storage, type StorageCallbackMap } from "@plasmohq/storage"

const storage = new Storage()
async function getFromStorageWithDefault<T>(key: string, defaultValue: T) {
  const value = await storage.get<T>(key)
  if (value) return value
  else {
    await storage.set(key, defaultValue)
    return defaultValue
  }
}

export async function setGlobalZoom(v: number) {
  await storage.set("global-zoom", v)
}
export async function getGlobalZoom() {
  return await getFromStorageWithDefault("global-zoom", 1)
}

export type UiZoomMode = "global" | "input" | "link"
export async function setUiZoomMode(v: UiZoomMode) {
  await storage.set("ui-zoom-mode", v)
}
export async function getUiZoomMode() {
  return await getFromStorageWithDefault("ui-zoom-mode", "global")
}

export function onStorageWatch(callbackMap: StorageCallbackMap) {
  storage.watch(callbackMap)
}
