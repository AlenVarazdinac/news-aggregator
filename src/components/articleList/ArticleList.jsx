import Article from "../article/Article"
import "./articleList.css"

const ArticleList = ({ articles, loading }) => (
  <div className="articles">
    {loading && <p>Loading articles...</p>}
    {articles.length === 0 && !loading && <p>No articles found.</p>}
    {!loading &&
      articles.map((article, index) => (
        <Article key={index} article={article} />
      ))}
  </div>
)

export default ArticleList
