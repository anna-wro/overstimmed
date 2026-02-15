/** @fileoverview Quadrant statistics calculator for energy-stimulation correlation data. */
type CorrelationDataPoint = {
  energy: number
  stimulation: number
  type: string
  comfortable: boolean
}

export const calculateQuadrantStats = (data: CorrelationDataPoint[]) => {
  const quadrants = {
    q1: { positive: 0, neutral: 0, negative: 0, total: 0 }, // High Energy, Low Stimulation
    q2: { positive: 0, neutral: 0, negative: 0, total: 0 }, // High Energy, High Stimulation  
    q3: { positive: 0, neutral: 0, negative: 0, total: 0 }, // Low Energy, Low Stimulation
    q4: { positive: 0, neutral: 0, negative: 0, total: 0 }, // Low Energy, High Stimulation
  }

  data.forEach((point) => {
    let quadrant: keyof typeof quadrants
    
    if (point.energy >= 5 && point.stimulation < 5) quadrant = 'q1'
    else if (point.energy >= 5 && point.stimulation >= 5) quadrant = 'q2'
    else if (point.energy < 5 && point.stimulation < 5) quadrant = 'q3'
    else quadrant = 'q4'

    quadrants[quadrant][point.type as keyof typeof quadrants.q1]++
    quadrants[quadrant].total++
  })

  const total = data.length
  
  return {
    quadrants: [
      {
        name: "High Energy, Low Stimulation",
        ...quadrants.q1,
        percent: Math.round((quadrants.q1.total / total) * 100),
        positivePercent: quadrants.q1.total > 0 ? Math.round((quadrants.q1.positive / quadrants.q1.total) * 100) : 0,
        color: "bg-mint-500",
      },
      {
        name: "High Energy, High Stimulation", 
        ...quadrants.q2,
        percent: Math.round((quadrants.q2.total / total) * 100),
        positivePercent: quadrants.q2.total > 0 ? Math.round((quadrants.q2.positive / quadrants.q2.total) * 100) : 0,
        color: "bg-lavender-500",
      },
      {
        name: "Low Energy, Low Stimulation",
        ...quadrants.q3, 
        percent: Math.round((quadrants.q3.total / total) * 100),
        positivePercent: quadrants.q3.total > 0 ? Math.round((quadrants.q3.positive / quadrants.q3.total) * 100) : 0,
        color: "bg-sand-500",
      },
      {
        name: "Low Energy, High Stimulation",
        ...quadrants.q4,
        percent: Math.round((quadrants.q4.total / total) * 100), 
        positivePercent: quadrants.q4.total > 0 ? Math.round((quadrants.q4.positive / quadrants.q4.total) * 100) : 0,
        color: "bg-blush-500",
      },
    ],
    total,
  }
} 