// 1. Find all books by George Orwell
db.books.find(
  { author: "George Orwell" }
)

// 2. Find books published after 1950
db.books.find(
  { year: { $gt: 1950 } }
)

// 3. Find books with "the" in the title (case-insensitive)
db.books.find(
  { title: /the/i }
)

// 4. Project only the title and author (exclude _id)
db.books.find(
  {},
  { _id: 0, title: 1, author: 1 }
)

// 5. Sort books by year in descending order
db.books.find().sort({ year: -1 })

// 6. Find books by Tolkien and project title/year only
db.books.find(
  { author: /Tolkien/i },
  { _id: 0, title: 1, year: 1 }
)
// 1. Count books per author
db.books.aggregate([
  { $group: { _id: "$author", total_books: { $sum: 1 } } },
  { $sort: { total_books: -1 } }
])

// 2. Average publication year per author
db.books.aggregate([
  { $group: { _id: "$author", avgYear: { $avg: "$year" } } },
  { $sort: { avgYear: 1 } }
])

// 3. Get oldest book(s)
db.books.aggregate([
  { $sort: { year: 1 } },
  { $limit: 1 }
])

// 4. List all books grouped by decade
db.books.aggregate([
  {
    $project: {
      title: 1,
      author: 1,
      decade: { $subtract: ["$year", { $mod: ["$year", 10] }] }
    }
  },
  { $group: { _id: "$decade", books: { $push: "$title" } } },
  { $sort: { _id: 1 } }
])
// 1. Create index on author to speed up queries
db.books.createIndex({ author: 1 })

// 2. Create compound index on author and year
db.books.createIndex({ author: 1, year: -1 })

// 3. Create text index on title to support search
db.books.createIndex({ title: "text" })

// 4. Example search using text index
db.books.find({ $text: { $search: "rings" } })