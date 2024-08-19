import axios from "axios"

export const fetchGuardianArticles = async (params) => {
  const { startDate, endDate, keyword, categoryFilter } = params
  const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY

  const requestParams = {
    q: keyword,
    "api-key": GUARDIAN_API_KEY,
    "page-size": 20,
    pages: 1,
    "from-date": startDate,
    "to-date": endDate,
    "show-elements": "image",
  }

  if (categoryFilter !== "all") {
    requestParams.tag = `${categoryFilter}/${categoryFilter}`
  }

  const res = await axios.get("https://content.guardianapis.com/search", {
    params: requestParams,
  })

  return res.data.response.results.map((article) => ({
    title: article.webTitle,
    url: article.webUrl,
    image: article.elements?.[0]?.assets?.[0]?.file || "",
    publishedAt: article.webPublicationDate,
    sourceFilter: "The Guardian",
  }))
}
