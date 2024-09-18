import React from "react"

import "../style.css"

import useAccuracyEvaluator from "./accuracy-evaluator"

export default function AccuracyEvaluatorPage() {
  const { gaps, gapAvgScore, getEffectiveWidth, onSectionClick } =
    useAccuracyEvaluator()

  const radius = 200
  const arr = [...new Array(12).keys()]
  return (
    <div className="h-screen w-screen">
      {arr.map((i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 h-[44px] w-[44px] rounded-full bg-slate-400"
          style={{
            transform: `translate(calc(${radius}px * cos(pi * (2 * ${i} + 1) / 12) - 50%), calc(${radius}px * sin(pi * (2 * ${i} + 1) / 12) - 50%)`
          }}></div>
      ))}
      <div className="absolute left-0 top-0">
        <p>bias: {gapAvgScore}</p>
        <p>effective width: {getEffectiveWidth()}</p>
        <button
          className="btn"
          style={{
            width: `${getEffectiveWidth()}px`,
            height: `${getEffectiveWidth() / 3}px`
          }}>
          Ok?
        </button>
      </div>
    </div>
  )
}
