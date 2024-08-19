import { useCallback, useEffect, useState } from "react"
import moment from "moment"
import { fetchArticles } from "./services/fetchArticles"
import "react-datepicker/dist/react-datepicker.css"
import "./App.css"
import Filters from "./components/filters/Filters"
import ArticleList from "./components/articleList/ArticleList"

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

  const [customStartDate, setCustomStartDate] = useState(new Date())
  const [customEndDate, setCustomEndDate] = useState(null)

  const onDatePickerChange = (dates) => {
    const [start, end] = dates
    setCustomStartDate(start)
    setCustomEndDate(end)
    if (start === null || end === null) return
    setDates(start, end)
  }

  const setDates = (startDate, endDate) => {
    const formattedStartDate = moment(startDate).format("YYYY-MM-DD")
    const formattedEndDate = moment(endDate).format("YYYY-MM-DD")
    setFromDate(formattedStartDate)
    setToDate(formattedEndDate)
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
    setArticles(fetchedArticles || [])
    setLoading(false)
  }, [keywordTerm, fromDate, toDate, source, category])

  useEffect(() => {
    loadArticles()
  }, [fromDate, toDate, source, category])

  useEffect(() => {
    const handler = setTimeout(() => {
      loadArticles()
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

  const saveUserFilters = () => {
    const filter = {
      keyword: keywordTerm,
      dateValue,
      toDate,
      fromDate,
      source,
      category,
    }
    localStorage.setItem("userFilters", JSON.stringify(filter))
  }

  const loadUserFilters = () => {
    const storedFilters = localStorage.getItem("userFilters")
    if (!storedFilters) return
    const filters = JSON.parse(storedFilters)

    setKeywordTerm(filters.keyword)
    setDateValue(filters.dateValue)
    if (filters.dateValue === "custom") {
      setCustomStartDate(filters.fromDate)
      setCustomEndDate(filters.toDate)
      setDates(filters.fromDate, filters.toDate)
    }
    setSource(filters.source)
    setCategory(filters.category)
  }

  return (
    <>
      <Filters
        keywordTerm={keywordTerm}
        dateValue={dateValue}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        source={source}
        category={category}
        onKeywordChange={handleKeywordChange}
        onDateChange={handleDateChange}
        onDatePickerChange={onDatePickerChange}
        onSourceChange={handleSourceChange}
        onCategoryChange={handleCategoryChange}
        onSaveFilters={saveUserFilters}
        onLoadFilters={loadUserFilters}
      />

      <ArticleList articles={articles} loading={loading} />
    </>
  )
}

export default App
