import { useEffect, useState } from 'react'
import { evaluationsApi } from '@/lib/api/evaluations'

interface ExpertSummary {
  pending: number
  reviewed: number
}

export function useExpertEvaluationsSummary() {
  const [summary, setSummary] = useState<ExpertSummary>({ pending: 0, reviewed: 0 })
  const [summaryLoading, setSummaryLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadSummary() {
      setSummaryLoading(true)
      try {
        const result = await evaluationsApi.getEvaluationsSummary()
        if (cancelled) return
        setSummary({ pending: result.pending, reviewed: result.reviewed })
        setSummaryLoading(false)
      } catch {
        if (!cancelled) setSummaryLoading(false)
      }
    }

    loadSummary()
    return () => {
      cancelled = true
    }
  }, [])

  return { summary, summaryLoading }
}
