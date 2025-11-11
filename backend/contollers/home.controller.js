import axios from "axios";
export const setHome = async (req, res) => {
  const { term } = req.params;
  const response = await axios.get(
    `https://openlibrary.org/subjects/${term}.json?ebook=true&limit=20`
  );
  if (!response.data.works || response.data.works.length === 0) {
    return res.status(400).json({ success: false, message: "No Result Found" });
  }
  res.status(200).json({ success: true, content: response.data.works });
};
