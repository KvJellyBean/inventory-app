const pool = require("./pool");

async function getItemsWithCategories() {
  const query = `
        SELECT i.id, i.name, i.quantity, i.price, i.image_path, c.name AS categories
        FROM items i
        LEFT JOIN item_categories ic ON i.id = ic.item_id
        LEFT JOIN categories c ON ic.category_id = c.id
        `;
  const { rows } = await pool.query(query);
  const items = rows.reduce((acc, row) => {
    const existingItem = acc.find((i) => i.id === row.id);
    if (existingItem) {
      existingItem.categories.push(row.categories);
    } else {
      acc.push({
        id: row.id,
        name: row.name,
        quantity: row.quantity,
        price: row.price,
        image: row.image_path,
        categories: [row.categories],
      });
    }
    return acc;
  }, []);
  return items;
}

async function getItemById(itemId) {
  const query = `
    SELECT i.id, i.name, i.quantity, i.price, i.image_path, c.name AS category_name
    FROM items i
    LEFT JOIN item_categories ic ON i.id = ic.item_id
    LEFT JOIN categories c ON ic.category_id = c.id
    WHERE i.id = $1
    `;
  const { rows } = await pool.query(query, [itemId]);

  if (rows.length === 0) {
    return null;
  }

  const item = {
    id: rows[0].id,
    name: rows[0].name,
    quantity: rows[0].quantity,
    price: rows[0].price,
    image: rows[0].image_path,
    categories: [],
  };

  rows.forEach((row) => {
    if (row.category_name) {
      item.categories.push(row.category_name);
    }
  });

  item.categories = [...new Set(item.categories)];

  return item;
}

async function getItemsByCategory(categoryName) {
  const query = `
    SELECT i.id, i.name, i.quantity, i.price, i.image_path, c.name AS categories
    FROM items i  
    LEFT JOIN item_categories ic ON i.id = ic.item_id
    LEFT JOIN categories c ON ic.category_id = c.id
    WHERE c.name = $1
    `;
  const { rows } = await pool.query(query, [categoryName]);
  const items = rows.reduce((acc, row) => {
    const existingItem = acc.find((i) => i.id === row.id);
    if (existingItem) {
      existingItem.categories.push(row.categories);
    } else {
      acc.push({
        id: row.id,
        name: row.name,
        quantity: row.quantity,
        price: row.price,
        image: row.image_path,
        categories: [row.categories],
      });
    }
    return acc;
  }, []);
  return items;
}

async function getCategories() {
  const query = "SELECT * FROM categories";
  const { rows } = await pool.query(query);
  return rows;
}

async function getCategoryById(categoryId) {
  const query = `
        SELECT c.name, c.id
        FROM categories c
        WHERE c.id = $1;
      `;
  const { rows } = await pool.query(query, [categoryId]);
  return rows[0];
}

async function addItem(name, quantity, price, imagePath, categoryIds) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertItemQuery = `
        INSERT INTO items (name, quantity, price, image_path)
        VALUES ($1, $2, $3, $4) RETURNING id;
      `;
    const { rows } = await client.query(insertItemQuery, [
      name,
      quantity,
      price,
      imagePath,
    ]);
    const itemId = rows[0].id;

    const insertCategoryQuery = `
        INSERT INTO item_categories (item_id, category_id)
        VALUES ($1, $2);
      `;

    for (const categoryId of categoryIds) {
      await client.query(insertCategoryQuery, [itemId, categoryId]);
    }

    await client.query("COMMIT");
    return itemId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function addCategory(name) {
  const query = `
        INSERT INTO categories (name)
        VALUES ($1)
        RETURNING id;
      `;
  const { rows } = await pool.query(query, [name]);
  return rows[0].id;
}

async function updateItem(
  itemId,
  name,
  quantity,
  price,
  imagePath,
  categoryIds
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateItemQuery = `
        UPDATE items
        SET name = $1, quantity = $2, price = $3, image_path = $4
        WHERE id = $5;
      `;
    await client.query(updateItemQuery, [
      name,
      quantity,
      price,
      imagePath,
      itemId,
    ]);

    const deleteCategoriesQuery = `
        DELETE FROM item_categories
        WHERE item_id = $1;
      `;
    await client.query(deleteCategoriesQuery, [itemId]);

    const insertCategoryQuery = `
        INSERT INTO item_categories (item_id, category_id)
        VALUES ($1, $2);
      `;

    for (const categoryId of categoryIds) {
      await client.query(insertCategoryQuery, [itemId, categoryId]);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function updateCategory(categoryId, name) {
  const query = `
        UPDATE categories
        SET name = $1
        WHERE id = $2;
      `;
  await pool.query(query, [name, categoryId]);
}

async function deleteItem(itemId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const deleteCategoriesQuery = `
        DELETE FROM item_categories
        WHERE item_id = $1;
      `;
    await client.query(deleteCategoriesQuery, [itemId]);

    const deleteItemQuery = `
        DELETE FROM items
        WHERE id = $1;
      `;
    await client.query(deleteItemQuery, [itemId]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function deleteCategory(categoryId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const checkItemsQuery = `
        SELECT COUNT(*)
        FROM item_categories
        WHERE category_id = $1;
      `;
    const { rows } = await client.query(checkItemsQuery, [categoryId]);
    const count = parseInt(rows[0].count);

    if (count > 0) {
      throw new Error("Cannot delete category with associated items");
    }

    const deleteCategoryQuery = `
        DELETE FROM categories
        WHERE id = $1;
      `;
    await client.query(deleteCategoryQuery, [categoryId]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  getItemsWithCategories,
  getItemById,
  getItemsByCategory,
  getCategories,
  getCategoryById,
  addItem,
  addCategory,
  updateItem,
  updateCategory,
  deleteItem,
  deleteCategory,
};
