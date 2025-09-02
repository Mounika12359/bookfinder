import { Link } from "react-router-dom";

export default function Favorites({ favourites, removeFromFavourites }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>My Favorites</h2>
      {favourites.length === 0 ? (
        <p>No favorite books yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {favourites.map((book) => {
            const bookId = book.key.replace("/works/", ""); // 👈 clean id
            return (
              <li
                key={book.key}
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                <Link to={`/book/${bookId}`}>
                  <strong>{book.title}</strong>
                </Link>
                <button
                  onClick={() => removeFromFavourites(book.key)}
                  style={{ marginLeft: "15px", color: "red" }}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
