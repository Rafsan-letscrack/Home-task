const KEY = "quiz-master:results"

// Read all saved results (newest first). Returns [] if nothing is saved.
export function loadResults() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? []
  } catch {
    return []
  }
}

// Add one result to the front of the list (keep at most 50).
export function saveResult(entry) {
  localStorage.setItem(KEY, JSON.stringify([entry, ...loadResults()].slice(0, 50)))
}

export function clearResults() {
  localStorage.removeItem(KEY)
}
