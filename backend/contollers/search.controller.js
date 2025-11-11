import axios from "axios";
export const search = async (req, res) => {
  const { query } = req.params;
  console.log("Search term received:", query);

  try {
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(
        query
      )}&fields=*,availability&limit=5`
    );

    const works = response.data.docs;

    if (!works || works.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No results found" });
    }

    const books = works.map((work) => ({
      id: work.key,
      title: work.title,
      author: work.author_name?.[0] || "Unknown",
      description: work.first_sentence?.[0] || "",
      coverImage: work.cover_i
        ? `https://covers.openlibrary.org/b/id/${work.cover_i}-L.jpg`
        : null,
    }));

    res.status(200).json({ success: true, content: books });
  } catch (error) {
    console.error("Search controller error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
