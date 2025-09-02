import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Bookcard.css"

export default function BookDetails({ favourites, addToFavourites }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`https://openlibrary.org/works/${id}.json`);
        const data = await res.json();
        setBook({ ...data, key: `/works/${id}` }); // include key for consistency
      } catch (err) {
        console.error("Error fetching book details:", err);
      }
    };
    fetchBook();
  }, [id]);

  if (!book) return <p>Loading book details...</p>;

  const isFavourite = favourites.some((fav) => fav.key === book.key);

  return (
    <div className="book-details">
      <h2>{book.title}</h2>
      {book.covers && (
        <img
          src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`}
          alt={book.title}
        />
      )}
      <p>
        <strong>Description:</strong>{" "}
        {book.description?.value || book.description || "No description found"}
      </p>
      <p>
        <strong>First Published:</strong> {book.first_publish_date || "Unknown"}
      </p>
      

      <button onClick={() => addToFavourites(book)}>
        {isFavourite ? "✅ Added to Favourites" : "Add to Favourites"}
      </button>
    </div>
  );
}
