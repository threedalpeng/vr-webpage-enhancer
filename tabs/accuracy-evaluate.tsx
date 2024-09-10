import React from "react"

import "../style.css"

import useAccuracyEvaluator from "./accuracy-evaluator"

export default function AccuracyEvaluatorPage() {
  const { gaps, gapAvgScore, getEffectiveWidth, onSectionClick } =
    useAccuracyEvaluator()
  return (
    <div className="h-screen w-screen">
      <div
        onMouseDown={(e) => {
          onSectionClick(e)
        }}
        className="absolute h-1/2 w-1/2">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2">
          x
        </div>
      </div>
      <div
        onMouseDown={(e) => {
          onSectionClick(e)
        }}
        className="absolute top-1/2 h-1/2 w-1/2">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2">
          x
        </div>
      </div>
      <div
        onMouseDown={(e) => {
          onSectionClick(e)
        }}
        className="absolute left-1/2 h-1/2 w-1/2">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2">
          x
        </div>
      </div>
      <div
        onMouseDown={(e) => {
          onSectionClick(e)
        }}
        className="absolute left-1/2 top-1/2 h-1/2 w-1/2">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2">
          x
        </div>
      </div>
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
