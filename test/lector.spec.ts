import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Lector } from "../src/models/lector.js";
import { Libro } from "../src/models/libro.js";

const primerLector = {
    nombre: "Juan Pérez",
    nombre_usr: "juanperez",
    mail: "juan.perez@example.com",
    generos_fav: ["ficción", "historia"]
};

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
  await Lector.deleteMany();
  await Libro.deleteMany();
});

describe("POST /lectores", () => {
    test("Crea el primer lector", async () => {
        const respuesta = await request(app)
            .post("/lectores")
            .send(primerLector)
            .expect(201);
        expect(respuesta.body).to.deep.include({
            nombre: "Juan Pérez",
            nombre_usr: "juanperez",
            mail: "juan.perez@example.com",
            generos_fav: ["ficción", "historia"]
        });
    });
});

describe('GET /lectores', () => {
  test('Should get a lector by username', async () => {
    await new Lector(primerLector).save();
    await request(app)
      .get('/lectores?nombre_usr=juanperez')
      .expect(200);
  });

  test('Should not find a lector by username', async () => {
    await request(app)
      .get('/lectores?nombre_usr=mariagarcia')
      .expect(404);
  });
});

describe('PATCH /lectores', () => {
  test('Should update a lector', async () => {
    await new Lector(primerLector).save();
    const respuesta = await request(app)
      .patch('/lectores?nombre_usr=juanperez')
      .send({ nombre: 'Juan P. Pérez' })
      .expect(200);
    expect(respuesta.body).to.deep.include({
      nombre: 'Juan P. Pérez',
      nombre_usr: 'juanperez',
      mail: 'juan.perez@example.com',
      generos_fav: ['ficción', 'historia']
    });
  });
});

describe('PATCH /lectores', () => {
  test('Should not update a lector with invalid fields', async () => {
    await new Lector(primerLector).save();
    await request(app)
      .patch('/lectores?nombre_usr=juanperez')
      .send({ edad: 30 })
      .expect(400);
  });
});

describe('DELETE /lectores', () => {
  test('Should delete a lector', async () => {
    await new Lector(primerLector).save();
    await request(app)
      .delete('/lectores?nombre_usr=juanperez')
      .expect(200);
  });
    test('should delete reviews of a deleted lector', async () => {
        const lector = await new Lector(primerLector).save();
        const libro = await new Libro(primerLibro).save();
        libro.resenias.push({
            lector: lector,
            comentario: "Excelente libro, lo recomiendo mucho.",
            calificacion: 5
        });
        await libro.save();

        await request(app)
        .delete('/lectores?nombre_usr=juanperez')
        .expect(200);

        const libroActualizado = await Libro.findById(libro._id);
        expect(libroActualizado?.resenias).toHaveLength(0);
    });
});