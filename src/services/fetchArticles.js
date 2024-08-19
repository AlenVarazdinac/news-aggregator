import { fetchNewsApiArticles } from "./apiHandlers/newsApi"
import { fetchGuardianArticles } from "./apiHandlers/guardianApi"
import { fetchNyTimesArticles } from "./apiHandlers/nyTimesApi"

const API_HANDLERS = {
  newsapi: fetchNewsApiArticles,
  theguardian: fetchGuardianArticles,
  newyorktimes: fetchNyTimesArticles,
}

export const fetchArticles = async (options) => {
  const { sourceFilter = "newsapi", ...params } = options
  const handler = API_HANDLERS[sourceFilter]
  if (!handler) {
    console.error("Unsupported source filter:", sourceFilter)
    return []
  }

  try {
    const response = await handler(params)
    return response
  } catch (error) {
    console.error("Error fetching articles:", error)
    return []
  }
}
