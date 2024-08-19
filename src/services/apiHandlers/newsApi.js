import axios from "axios"

export const fetchNewsApiArticles = async (params) => {
  const { startDate, endDate, keyword, categoryFilter } = params
  const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY

  const res = await axios.get("https://newsapi.org/v2/top-headlines", {
    headers: { "X-Api-Key": NEWSAPI_KEY },
    params: {
      q: keyword,
      from: startDate,
      to: endDate,
      pageSize: 20,
      page: 1,
      language: "en",
      sortBy: "publishedAt",
      categoryFilter,
    },
  })

  return res.data.articles.map((article) => ({
    title: article.title,
    url: article.url,
    image: article.urlToImage,
    publishedAt: article.publishedAt,
    sourceFilter: article.source?.name,
  }))
}
