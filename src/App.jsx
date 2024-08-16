import { useCallback, useEffect, useState } from "react"
import moment from "moment"
import { fetchArticles } from "./services/fetchArticles"
import BaseSelect from "./components/BaseSelect"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./App.css"

function App() {
  const [keywordTerm, setKeywordTerm] = useState("")
  const [articles, setArticles] = useState([])
  const [dateValue, setDateValue] = useState(7)
  const [fromDate, setFromDate] = useState(
    moment().subtract(7, "days").format("YYYY-MM-DD")
  )
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"))
  const [source, setSource] = useState("newsapi")
  const [category, setCategory] = useState("all")
  const [loading, setLoading] = useState(false)

  const categoryOptions = [
    { value: "all", label: "All" },
    { value: "cars", label: "Cars" },
    { value: "business", label: "Business" },
    { value: "food", label: "Food" },
    { value: "health", label: "Health" },
    { value: "science", label: "Science" },
    { value: "sports", label: "Sports" },
    { value: "technology", label: "Technology" },
  ]

  const sourceOptions = [
    { value: "newsapi", label: "News API" },
    { value: "newyorktimes", label: "New York Times" },
    { value: "theguardian", label: "The Guardian" },
  ]

  const dateOptions = [
    { value: "7", label: "Last 7 Days" },
    { value: "14", label: "Last 14 Days" },
    { value: "30", label: "Last 30 Days" },
    { value: "custom", label: "Custom" },
  ]

  const onDatePickerChange = (dates) => {
    const [start, end] = dates
    const formattedStartDate = moment(start).format("YYYY-MM-DD")
    const formattedEndDate = moment(end).format("YYYY-MM-DD")
    setFromDate(start)
    setToDate(end)
  }

  const loadArticles = useCallback(async () => {
    setLoading(true)
    const options = {
      keyword: keywordTerm,
      startDate: fromDate,
      endDate: toDate,
      sourceFilter: source,
      categoryFilter: category,
    }
    const fetchedArticles = await fetchArticles(options)
    setArticles(fetchedArticles)
    setLoading(false)
  }, [keywordTerm, fromDate, toDate, source, category])

  useEffect(() => {
    loadArticles()
  }, [fromDate, toDate, source, category])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (keywordTerm) {
        loadArticles()
      }
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [keywordTerm, loadArticles])

  const handleKeywordChange = (event) => {
    setKeywordTerm(event.target.value)
  }

  const handleDateChange = (event) => {
    const days = event.target.value
    setDateValue(days)
    if (days === "custom") return

    const subtractedDays = moment().subtract(days, "days").format("YYYY-MM-DD")
    setFromDate(subtractedDays)
  }

  const handleSourceChange = (event) => {
    const selectedSource = event.target.value
    setSource(selectedSource)
  }

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value
    setCategory(selectedCategory)
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

        <BaseSelect
          name="date"
          value={dateValue}
          options={dateOptions}
          onSelectChange={handleDateChange}
        />

        {dateValue === "custom" && (
          <DatePicker
            selected={fromDate}
            onChange={onDatePickerChange}
            startDate={fromDate}
            endDate={toDate}
            selectsRange
          />
        )}

        <BaseSelect
          name="source"
          value={source}
          options={sourceOptions}
          onSelectChange={handleSourceChange}
        />

        <BaseSelect
          name="category"
          value={category}
          options={categoryOptions}
          onSelectChange={handleCategoryChange}
        />

        {loading && <p>Loading articles...</p>}
        {articles.length === 0 && !loading && <p>No articles found.</p>}
        {!loading &&
          articles.map((article, index) => (
            <div key={index} className="article">
              <h3>{article.title}</h3>
              <p>{article.publishedAt}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
              {article.image && <img src={article.image} alt={article.title} />}
            </div>
          ))}
      </div>
    </>
  )
}

export default App
