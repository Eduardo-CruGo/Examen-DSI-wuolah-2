import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Libro } from "../src/models/libro.js";

const primerLibro = {
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    anio: 1967,
    editorial: "Editorial Sudamericana",
    n_paginas: 417,
  genero: ["ficción"],
  resenias: []
}

beforeEach(async () => {
  await Libro.deleteMany();
});

describe("POST /libros", () => {
    test("Crea el primer libro", async () => {
        const respuesta = await request(app)
            .post("/libros")
            .send(primerLibro)
            .expect(201);
        expect(respuesta.body).to.deep.include({
            titulo: "Cien años de soledad",
            autor: "Gabriel García Márquez",
            anio: 1967,
            editorial: "Editorial Sudamericana",
            n_paginas: 417,
          genero: ["ficción"],
        });
    });
});

describe('GET /libros', () => {
  test('Should get all libros', async () => {
    await new Libro(primerLibro).save();
    await request(app)
      .get('/libros')
      .expect(200);
  });

  test('Should not find any libro', async () => {
    await request(app)
      .get('/libros')
      .expect(404);
  });
});

describe('GET /libros/:id', () => {
  test('Should get a libro by id', async () => {
    const libro = await new Libro(primerLibro).save();
    await request(app)
      .get(`/libros/${libro._id}`)
      .expect(200);
  });
});

describe('PATCH /libros/:id', () => {
  test('Should update a libro', async () => {
    const libro = await new Libro(primerLibro).save();
    const respuesta = await request(app)
      .patch(`/libros/${libro._id}`)
      .send({ titulo: 'Cien años de soledad (Edición revisada)' })
      .expect(200);
    expect(respuesta.body).to.deep.include({
      titulo: 'Cien años de soledad (Edición revisada)',
      autor: "Gabriel García Márquez",
      anio: 1967,
      editorial: "Editorial Sudamericana",
      n_paginas: 417,
      genero: ["ficción"],
    });
  });
});

describe('DELETE /libros/:id', () => {
  test('Should delete a libro', async () => {
    const libro = await new Libro(primerLibro).save();
    await request(app)
      .delete(`/libros/${libro._id}`)
      .expect(200);
  });
});