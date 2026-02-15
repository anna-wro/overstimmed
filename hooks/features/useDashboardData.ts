/** @fileoverview Aggregates entries, derived stats, and insights for the dashboard page. */
import { useEntries } from "./useEntries"
import { useDashboardDerived } from "./dashboard/useDashboardDerived"

export const useDashboardData = () => {
  const { entries, loading, error, refetch } = useEntries()
  const { latestEntry, recentEntries, stats } = useDashboardDerived(entries)
  return {
    latestEntry,
    entries,
    recentEntries,
    stats,
    loading,
    error,
    refetchEntries: refetch,
  }
}
