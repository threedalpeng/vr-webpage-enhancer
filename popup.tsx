import { useReducer } from "react"

import "./style.css"

export default function IndexPopup() {
  const [count, increase] = useReducer((c) => c + 1, 0)

  return (
    <div>
      <a href="chrome-extension://kglnkpndoebbefnamddleeloenppaakk/tabs/accuracy-evaluate.html" target="_blank">
        <button>Open</button>
      </a>
    </div>
  )
}
