import axios from "axios"

export const fetchNyTimesArticles = async (params) => {
  const { startDate, endDate, keyword, categoryFilter } = params
  const NY_API_KEY = import.meta.env.VITE_NY_TIMES_API_KEY

  const requestParams = {
    q: keyword,
    "api-key": NY_API_KEY,
    page: 1,
    begin_date: startDate,
    end_date: endDate,
    sort: "newest",
  }

  if (categoryFilter !== "all") {
    requestParams.fq = `news_desk:(${
      categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)
    })`
  }

  const res = await axios.get(
    "https://api.nytimes.com/svc/search/v2/articlesearch.json",
    { params: requestParams }
  )

  return res.data.response.docs.map((article) => ({
    title: article.headline.main,
    url: article.web_url,
    image:
      article.multimedia.length > 0
        ? `https://www.nytimes.com/${article.multimedia[0].url}`
        : "",
    publishedAt: article.pub_date,
    sourceFilter: article.source,
  }))
}
