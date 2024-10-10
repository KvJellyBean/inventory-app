const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_path TEXT
);

CREATE TABLE IF NOT EXISTS item_categories (
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (item_id, category_id)
);

INSERT INTO categories (name) VALUES
('Electronics'),
('Books'),
('Clothing'),
('Home Decor'),
('Toys'),
('Stationery');

INSERT INTO items (name, quantity, price, image_path) VALUES
('Smartphone', 50, 699.99, '/images/smartphone.jpg'),
('Laptop', 30, 999.99, '/images/laptop.jpg'),
('Tablet', 25, 499.99, '/images/tablet.jpg'),
('Novel', 100, 19.99, '/images/novel.jpg'),
('Cookbook', 80, 29.99, '/images/cookbook.jpg'),
('Magazine', 150, 9.99, '/images/magazine.jpg'),
('T-Shirt', 200, 15.99, '/images/tshirt.jpg'),
('Jeans', 100, 39.99, '/images/jeans.jpg'),
('Sweater', 50, 49.99, '/images/sweater.jpg'),
('Wall Art', 70, 24.99, '/images/wall_art.jpg'),
('Vase', 40, 19.99, '/images/vase.jpg'),
('Cushion', 60, 15.99, '/images/cushion.jpg'),
('Stuffed Animal', 80, 29.99, '/images/stuffed_animal.jpg'),
('Puzzle', 90, 14.99, '/images/puzzle.jpg'),
('Board Game', 50, 39.99, '/images/board_game.jpg'),
('Notebook', 150, 5.99, '/images/notebook.jpg'),
('Pen Set', 200, 9.99, '/images/pen_set.jpg'),
('Craft Supplies', 70, 24.99, '/images/craft_supplies.jpg');

INSERT INTO item_categories (item_id, category_id) VALUES
(1, 1),  
(2, 1),  
(3, 1),  
(4, 2),  
(5, 2),  
(6, 2),  
(7, 3),  
(8, 3),  
(9, 3),  
(10, 4),  
(11, 4), 
(12, 4), 
(13, 5),   
(14, 5), 
(15, 5), 
(16, 6), 
(17, 6), 
(18, 6),   
(1, 6),  
(3, 4),   
(7, 4),   
(9, 1);  
`;

function populateDatabase() {
  console.log("Populating database...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  client.connect();
  client.query(SQL, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log("Tables created!");
    }
    client.end();
  });
}

populateDatabase();
