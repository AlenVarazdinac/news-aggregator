const BaseSelect = ({ name, options, value, onSelectChange }) => {

  const handleChange = (event) => {
    onSelectChange(event)
  }

  if (!options) return

  return (
    <select name={name} value={value} onChange={handleChange}>
      {options.map((option, index) => (
        <option key={`${name}-option-${index}`} value={option.value}>{option.label}</option>
      ))}
    </select>
  )
}

export default BaseSelect
