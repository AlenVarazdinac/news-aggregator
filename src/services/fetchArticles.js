import axios from "axios"
import moment from "moment"

export const fetchArticles = async (options) => {
  const {
    keyword = "",
    startDate = moment().subtract(7, "days").format("YYYY-MM-DD"),
    endDate = moment().format("YYYY-MM-DD"),
    sourceFilter = "newsapi",
    categoryFilter = "all",
  } = options || {}

  console.log("fetching articles...", keyword)

  let articles = []

  if (sourceFilter === "newsapi") {
    articles = await newsApiRequest(
      keyword,
      startDate,
      endDate,
      categoryFilter
    )
    console.log("newsApiArticles", articles)
  }

  if (sourceFilter === "theguardian") {
    articles = await guardianRequest(
      keyword,
      startDate,
      endDate,
      categoryFilter
    )
    console.log("guardianArticles", articles)
  }

  if (sourceFilter === "newyorktimes") {
    articles = await newYorkTimesRequest(
      keyword,
      startDate,
      endDate,
      categoryFilter
    )
    console.log("new york times articles", articles)
  }

  return articles
}

const newsApiRequest = async (keyword, startDate, endDate, categoryFilter) => {
  const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY

  const res = await axios.get("https://newsapi.org/v2/top-headlines", {
    headers: {
      "X-Api-Key": NEWSAPI_KEY,
    },
    params: {
      q: keyword,
      from: startDate,
      to: endDate,
      pageSize: 20,
      page: 1,
      language: "en",
      sortBy: "publishedAt",
      categoryFilter: categoryFilter,
    },
  })

  if (res.status !== 200) {
    console.log("Something went wrong")
    return
  }

  let articles = []
  res.data.articles.map((article) => {
    if (article.title === "[Removed]") return
    articles.push({
      title: article.title,
      url: article.url,
      image: article.urlToImage,
      publishedAt: article.publishedAt,
      sourceFilter: article.sourceFilter?.name,
    })
  })

  console.log("NewsApi", res.data)
  console.log("articles", articles)
  // setArticles(articles)
  return articles
}

const guardianRequest = async (keyword, startDate, endDate, categoryFilter) => {
  const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY

  let params = {
    q: keyword,
    "api-key": GUARDIAN_API_KEY,
    "page-size": 20,
    pages: 1,
    "from-date": startDate,
    "to-date": endDate,
    "show-elements": "image",
  }
  if (categoryFilter !== "all")
    params.tag = `${categoryFilter}/${categoryFilter}`

  const res = await axios.get("https://content.guardianapis.com/search", {
    params,
  })

  if (res.status !== 200) {
    console.log("Something went wrong")
    return
  }

  console.log("res guardian", res.data.response.results)

  let articles = []
  res.data.response.results.map((article) => {
    articles.push({
      title: article.webTitle,
      url: article.webUrl,
      image: article.elements && article.elements.length > 0 ? article.elements[0].assets[0].file : '',
      publishedAt: article.webPublicationDate,
      sourceFilter: "The Guardian",
    })
  })
  return articles
}

const newYorkTimesRequest = async (
  keyword,
  startDate,
  endDate,
  categoryFilter
) => {
  const NY_API_KEY = import.meta.env.VITE_NY_TIMES_API_KEY

  let params = {
    q: keyword,
      "api-key": NY_API_KEY,
      page: 1,
      begin_date: startDate,
      end_date: endDate,
      sort: "newest"
  }

  if (categoryFilter !== 'all') params.fq = `news_desk:(${
        categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)
      })`

  const res = await axios.get("https://api.nytimes.com/svc/search/v2/articlesearch.json", {
    params
  })

  if (res.status !== 200) {
    console.log("Something went wrong")
    return
  }

  console.log('ny times res', res.data.response.docs)

  let articles = []
  res.data.response.docs.map((article) => {
    articles.push({
      title: article.headline.main,
      url: article.web_url,
      image: article.multimedia.length > 0 ? `https://www.nytimes.com/${article.multimedia[0].url}` : '',
      publishedAt: article.pub_date,
      sourceFilter: article.source,
    })
  })
  return articles
}
