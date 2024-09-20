import { Storage, type StorageCallbackMap } from "@plasmohq/storage"

const storage = new Storage()
async function getFromStorageWithDefault<T>(key: string, defaultValue: T) {
  const value = await storage.get<T>(key)
  console.log(value)
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

export async function setLinkZoom(v: boolean) {
  await storage.set("link-zoom", v)
}
export async function getLinkZoom() {
  return await getFromStorageWithDefault("link-zoom", false)
}

export function onStorageWatch(callbackMap: StorageCallbackMap) {
  storage.watch(callbackMap)
}
