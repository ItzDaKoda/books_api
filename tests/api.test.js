const request = require("supertest");
const express = require("express");

// Import the app setup directly from server.js
const app = require("../server"); // make sure server.js exports the app instance

describe("Books API", () => {
  let server;

  // Start the server before tests
  beforeAll(() => {
    server = app.listen(4000);
  });

  // Close the server after tests
  afterAll((done) => {
    server.close(done);
  });

  // ================================
  //          GET TESTS
  // ================================
  test("GET /api/books should return all books", async () => {
    const res = await request(server).get("/api/books");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("GET /api/books/:id should return a specific book", async () => {
    const res = await request(server).get("/api/books/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title");
    expect(res.body.id).toBe(1);
  });

  test("GET /api/books/:id should return 404 for non-existent book", async () => {
    const res = await request(server).get("/api/books/999");
    expect(res.statusCode).toBe(404);
  });

  // ================================
  //          POST TESTS
  // ================================
  test("POST /api/books should add a new book", async () => {
    const newBook = {
      title: "Brave New World",
      author: "Aldous Huxley",
      genre: "Dystopian",
      copiesAvailable: 4,
    };

    const res = await request(server).post("/api/books").send(newBook);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Brave New World");
  });

  // ================================
  //          PUT TESTS
  // ================================
  test("PUT /api/books/:id should update an existing book", async () => {
    const updatedBook = { title: "The Great Gatsby (Updated)" };
    const res = await request(server).put("/api/books/1").send(updatedBook);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("The Great Gatsby (Updated)");
  });

  test("PUT /api/books/:id should return 404 if book not found", async () => {
    const res = await request(server)
      .put("/api/books/999")
      .send({ title: "Ghost Book" });
    expect(res.statusCode).toBe(404);
  });

  // ================================
  //         DELETE TESTS
  // ================================
  test("DELETE /api/books/:id should delete a book", async () => {
    const res = await request(server).delete("/api/books/2");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  test("DELETE /api/books/:id should return 404 if book not found", async () => {
    const res = await request(server).delete("/api/books/999");
    expect(res.statusCode).toBe(404);
  });
});
