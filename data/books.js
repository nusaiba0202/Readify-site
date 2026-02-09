/* 
   Book dataset for Explorer page.
*/

const books = [
  {
    id: 1,
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    genre: "Fable",
    cover: "img_book/book1.png",
    synopsis:
      "A poetic tale of a pilot stranded in the desert who meets a young prince visiting from another planet. A meditation on loneliness, friendship, love and loss.",
    prequels: ["The Hobbit"],
    sequels: ["The Two Towers", "The Return of the King"],
    reviews: [
      { reviewer: "Lena", rating: 5, comment: "Timeless and moving." },
      { reviewer: "Mark", rating: 4, comment: "Simple but profound." }
    ]
  },
  {
    id: 2,
    title: "The Fellowship of the Ring",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    cover: "img_book/book2.png",
    synopsis:
      "The first volume of the epic Lord of the Rings, following Frodo Baggins as he begins his journey to destroy the One Ring.",
    prequels: ["The Hobbit"],
    sequels: ["The Two Towers", "The Return of the King"],
    reviews: [
      { reviewer: "Carl", rating: 5, comment: "An epic beginning." },
      { reviewer: "Ava", rating: 4, comment: "Rich world-building." }
    ]
  },
  {
    id: 3,
    title: "Norwegian Wood",
    author: "Haruki Murakami",
    genre: "Fiction",
    cover: "img_book/book3.png",
    synopsis:
      "A coming-of-age story set in 1960s Tokyo that explores love, loss and mental illness through the eyes of Toru Watanabe.",
    prequels: [],
    sequels: [],
    reviews: [
      { reviewer: "Priya", rating: 4, comment: "Melancholic and beautiful." }
    ]
  },
  {
    id: 4,
    title: "Beloved",
    author: "Toni Morrison",
    genre: "Historical Fiction",
    cover: "img_book/book4.png",
    synopsis:
      "A powerful novel about an escaped enslaved woman, Sethe, and the haunting legacy of slavery and memory.",
    prequels: [],
    sequels: [],
    reviews: [
      { reviewer: "Jamal", rating: 5, comment: "Haunting and necessary." },
      { reviewer: "Olivia", rating: 5, comment: "Incredibly written." }
    ]
  },
  {
    id: 5,
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    genre: "Classic",
    cover: "img_book/book5.png",
    synopsis:
      "A novel about the fall of an Igbo community under colonial pressure and the life of Okonkwo, a respected leader.",
    prequels: [],
    sequels: [],
    reviews: [
      { reviewer: "Diego", rating: 5, comment: "A cornerstone of African literature." }
    ]
  }
];
