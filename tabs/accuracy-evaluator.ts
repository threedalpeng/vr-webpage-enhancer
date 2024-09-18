import { useMemo, type MouseEvent } from "react"
import { useImmer } from "use-immer"

interface Point {
  x: number
  y: number
}

export default function useAccuracyEvaluator() {
  const [prevClickPoint, updatePrevClickPoint] = useImmer<Point | null>(null)
  const [gaps, updateGaps] = useImmer<number[]>([])
  const [timestamps, updateTimestamps] = useImmer<number[]>([])
  const gapAvgScore = useMemo(
    () =>
      gaps.length === 0 ? 0 : gaps.reduce((a, b) => a + b, 0) / gaps.length,
    [gaps]
  )

  const evaluateGap = (
    targetPoint: Point,
    clickPoint: Point,
    moveDelta: Point
  ) => {
    const deltaLength = Math.sqrt(
      moveDelta.x * moveDelta.x + moveDelta.y * moveDelta.y
    )
    const aX = moveDelta.x / deltaLength
    const aY = moveDelta.y / deltaLength
    console.log(aX, aY)

    const gapX = targetPoint.x - clickPoint.x
    const gapY = targetPoint.y - clickPoint.y

    const gap = gapX * aX + gapY * aY

    return gap
  }

  const getStd = (gaps: number[]) => {
    const bias = gaps.reduce((prev, cur) => prev + cur, 0) / gaps.length
    const variance =
      gaps.reduce((prev, cur) => prev + (cur - bias) ** 2, 0) / gaps.length
    const std = Math.sqrt(variance)
    return std
  }

  const getEffectiveWidth = () => {
    return 4.311 * getStd(gaps)
  }

  const onSectionClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect()
    const targetCenter = {
      x: (rect.left + rect.right) / 2,
      y: (rect.top + rect.bottom) / 2
    }
    const clickPoint = { x: e.clientX, y: e.clientY }
    if (prevClickPoint === null) {
      updatePrevClickPoint((point) => (point = clickPoint))
      return
    }
    const moveDelta = {
      x: clickPoint.x - prevClickPoint.x,
      y: clickPoint.y - prevClickPoint.y
    }
    console.log(targetCenter, moveDelta, clickPoint)

    const gap = evaluateGap(targetCenter, clickPoint, moveDelta)
    updateGaps((gaps) => {
      console.log("gap:", gap, [...gaps])
      gaps.push(gap)
    })

    console.log(gapAvgScore)
  }

  const onCircleClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect()
    const targetCenter = {
      x: (rect.left + rect.right) / 2,
      y: (rect.top + rect.bottom) / 2
    }
    const clickPoint = { x: e.clientX, y: e.clientY }
    if (prevClickPoint === null) {
      updatePrevClickPoint((point) => (point = clickPoint))
      return
    }
    const moveDelta = {
      x: clickPoint.x - prevClickPoint.x,
      y: clickPoint.y - prevClickPoint.y
    }
    console.log(targetCenter, moveDelta, clickPoint)

    const gap = evaluateGap(targetCenter, clickPoint, moveDelta)
    updateGaps((gaps) => {
      console.log("gap:", gap, [...gaps])
      gaps.push(gap)
    })

    console.log(gapAvgScore)
  }

  const onOutsideClick = () => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect()
    const targetCenter = {
      x: (rect.left + rect.right) / 2,
      y: (rect.top + rect.bottom) / 2
    }
    const clickPoint = { x: e.clientX, y: e.clientY }
    if (prevClickPoint === null) {
      updatePrevClickPoint((point) => (point = clickPoint))
      return
    }
    const moveDelta = {
      x: clickPoint.x - prevClickPoint.x,
      y: clickPoint.y - prevClickPoint.y
    }
    console.log(targetCenter, moveDelta, clickPoint)

    const gap = evaluateGap(targetCenter, clickPoint, moveDelta)
    updateGaps((gaps) => {
      console.log("gap:", gap, [...gaps])
      gaps.push(gap)
    })

    console.log(gapAvgScore)
  }

  return {
    gaps,
    gapAvgScore,
    getEffectiveWidth,
    onSectionClick
  }
}
