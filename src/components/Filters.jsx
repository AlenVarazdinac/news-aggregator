import BaseSelect from "./BaseSelect"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import {
  categoryOptions,
  dateOptions,
  sourceOptions,
} from "../utils/filterOptions"

const Filters = ({
  keywordTerm,
  dateValue,
  customStartDate,
  customEndDate,
  source,
  category,
  onKeywordChange,
  onDateChange,
  onDatePickerChange,
  onSourceChange,
  onCategoryChange,
  onSaveFilters,
  onLoadFilters,
}) => (
  <div className="filter">
    <input
      type="text"
      value={keywordTerm}
      onChange={onKeywordChange}
      placeholder="Search for articles..."
    />
    <BaseSelect
      name="date"
      value={dateValue}
      options={dateOptions}
      onSelectChange={onDateChange}
    />
    {dateValue === "custom" && (
      <DatePicker
        selected={customStartDate}
        onChange={onDatePickerChange}
        startDate={customStartDate}
        endDate={customEndDate}
        selectsRange
      />
    )}
    <BaseSelect
      name="source"
      value={source}
      options={sourceOptions}
      onSelectChange={onSourceChange}
    />
    <BaseSelect
      name="category"
      value={category}
      options={categoryOptions}
      onSelectChange={onCategoryChange}
    />
    <div className="preferred-filters">
      <button id="save-filters" onClick={onSaveFilters}>
        Save filters
      </button>
      <button id="load-filters" onClick={onLoadFilters}>
        Load filters
      </button>
    </div>
  </div>
)

export default Filters
