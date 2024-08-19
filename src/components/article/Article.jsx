import moment from "moment"
import "./article.css"

const Article = ({ article, index }) => (
  <div key={index} className="article">
    {article.image && <img src={article.image} alt={article.title} />}
    <h3>{article.title}</h3>
    <p>{moment(article.publishedAt).format("LLL")}</p>
    <a href={article.url} target="_blank" rel="noopener noreferrer">
      Read more
    </a>
  </div>
)

export default Article
