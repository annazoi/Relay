import "./style.css";

const Search = ({ onChange }) => {
  return (
    <div className="search-container">
      <input
        className="search-content"
        type="text"
        placeholder="Search post..."
        onChange={onChange}
      />
    </div>
  );
};

export default Search;
