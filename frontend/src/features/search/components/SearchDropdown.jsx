import { Link } from "react-router-dom";

const SearchDropdown = ({ results, loading, query }) => {
  if (!query) return null;

  const highlightText = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="text-blue-500 font-semibold">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="absolute top-full left-0 w-full bg-white dark:bg-[#1A1D20] shadow-xl rounded-lg mt-2 z-50 max-h-[400px] overflow-y-auto">
      {loading && <div className="p-4 text-gray-500 text-sm">Searching...</div>}

      {!loading && results.length === 0 && (
        <div className="p-4 text-gray-500 text-sm">
          No results found for "{query}"
        </div>
      )}

      {!loading &&
        results.map((item) => (
          <Link
            key={item._id}
            to={`/product/${item._id}`}
            className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            <img
              src={item.images?.[0] || "/placeholder.png"}
              className="w-10 h-10 object-cover rounded"
              alt={item.title}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-black dark:text-white">
                {highlightText(item.title, query)}
              </span>
              <span className="text-xs text-gray-500">
                {highlightText(item.category, query)}
              </span>
            </div>
          </Link>
        ))}

      {/* View All */}
      {!loading && results.length > 0 && (
        <Link
          to={`/search?q=${query}`}
          className="block p-3 text-center text-blue-500 font-medium hover:underline"
        >
          View all results →
        </Link>
      )}
    </div>
  );
};

export default SearchDropdown;
