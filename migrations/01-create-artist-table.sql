  -- migrations/01-create-artist-table.sql
  CREATE TABLE Artists (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  genre VARCHAR(255) NOT NULL
  );