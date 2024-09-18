interface MessageRequest<T> {
  target: "popup" | "background"
  action: string
  detail: T
}
