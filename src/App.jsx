import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./App.css"

function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

function App() {
  const [keywordTerm, setKeywordTerm] = useState('')
  const [articles, setArticles] = useState([])
  const [dateValue, setDateValue] = useState(7)

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(null)
  const onDatePickerChange = (dates) => {
    const [start, end] = dates
    console.log("startDate", startDate)
    console.log("endDate", endDate)
    setStartDate(start)
    setEndDate(end)
  }

  const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY
  const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY
  const NY_API_KEY = import.meta.env.VITE_NY_TIMES_API_KEY

  const fetchArticles = async (keyword = '') => {
    console.log('fetching articles...')
    // axios
    //   .get("https://newsapi.org/v2/top-headlines", {
    //     headers: {
    //       "X-Api-Key": NEWSAPI_KEY,
    //     },
    //     params: {
    //       q: keyword,
    //       from: "2024-07-15",
    //       to: "2024-08-15",
    //       pageSize: 20,
    //       page: 1,
    //       language: "en",
    //       sortBy: "publishedAt",
    //       category: "business",
    //     },
    //   })
    //   .then((res) => {
    //     if (!res.data.articles) {
    //       console.log("Something went wrong.")
    //       return
    //     }
    //     let articles = []
    //     res.data.articles.map((article) => {
    //       if (article.title === "[Removed]") return
    //       articles.push({
    //         title: article.title,
    //         url: article.url,
    //         image: article.urlToImage,
    //         publishedAt: article.publishedAt,
    //         source: article.source.name,
    //       })
    //     })

    //     console.log("NewsApi", res.data)
    //     console.log("articles", articles)
    //     setArticles(articles)
    //   })

    // axios
    //   .get("https://content.guardianapis.com/search", {
    //     params: {
    //       q: keyword,
    //       "api-key": GUARDIAN_API_KEY,
    //       "page-size": 20,
    //       pages: 1,
    //       "from-date": "2024-07-15",
    //       "to-date": "2024-08-15",
    //       tag: "business/business",
    //     },
    //   })
    //   .then((res) => {
    //     console.log("GuardianApi", res)
    //   })

    // axios
    //   .get("https://api.nytimes.com/svc/search/v2/articlesearch.json", {
    //     params: {
    //       q: keyword,
    //       "api-key": NY_API_KEY,
    //       page: 1,
    //       begin_date: "2024-07-15",
    //       end_date: "2024-08-15",
    //       sort: "newest",
    //       fq: 'news_desk:("Business")',
    //     },
    //   })
    //   .then((res) => {
    //     console.log("NYApi", res)
    //   })
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const articleObject = {
    title: "",
    description: "???",
    url: "",
    image: "",
    publishedAt: "",
    source: "",
  }

  const debouncedFetchArticles = useCallback(debounce(keyword => fetchArticles(keyword), 500), [])


  const handleKeywordChange = (event) => {
    const value = event.target.value
    console.log('value', value)
    setKeywordTerm(value)
    debouncedFetchArticles(value)
  }

  const handleDateChange = (event) => {
    console.log("date change", event.target.value)
    setDateValue(event.target.value)
  }

  const handleSourceChange = (event) => {
    console.log("source change", event.target.value)
  }

  const handleCategoryChange = (event) => {
    console.log("category change", event.target.value)
  }

  return (
    <>
      <div className="filter">
        <input
          type="text"
          value={keywordTerm}
          onChange={handleKeywordChange}
          placeholder="Search for articles..."
        />

        <select name="date" onChange={handleDateChange}>
          <option value="7">Last 7 Days</option>
          <option value="14">Last 14 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="custom">Custom</option>
        </select>

        {dateValue === "custom" && (
          <DatePicker
            selected={startDate}
            onChange={onDatePickerChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
          />
        )}

        <select name="source" onChange={handleSourceChange}>
          <option value="News API">News API</option>
          <option value="newyorktimes">New York Times</option>
          <option value="theguardian">The Guardian</option>
        </select>

        <select name="category" onChange={handleCategoryChange}>
          <option value="all">All</option>
          <option value="cars">Cars</option>
          <option value="business">Business</option>
          <option value="food">Food</option>
          <option value="health">Health</option>
          <option value="science">Science</option>
          <option value="sports">Sports</option>
          <option value="technology">Technology</option>
        </select>

        {articles.map((article, index) => (
          <p key={index}>{article.title}</p>
        ))}
      </div>
    </>
  )
}

export default App
