/* eslint-disable no-undef */
const { expect } = require('chai')
const request = require('supertest')
const db = require('../src/db')
const app = require('../src/app')

describe('Read Artists', () => {
  let artists;
  let album;
  beforeEach(async () => {
    let artistData;
    let albumData;
    
    artistData = await Promise.all([
        db.query('INSERT INTO Artists (name, genre) VALUES ($1, $2) RETURNING *',
        ['Tame Impala', 'rock'])
    ]);
    artists = artistData.map(({ rows }) => rows[0]);
    const artistID = artists[0].id;
    
    albumData = await Promise.all([db.query(`INSERT INTO Album (name, year, artist_id) VALUES ($1, $2, $3) RETURNING *`,
        ['Currents', 2015, artistID])
    ]);
    album = albumData.map(({ rows }) => rows[0]);
    });

    describe('GET /albums', () => {
        it('returns all album records in the database', async () => {
            const { status, body } = await (await request(app).get('/albums')).send();
            expect(status).to.equal(200);
            expect(body.length).to.equal(1);
            body.forEach((albumRecord) => {
                const expected = album.find((a) => a.id === albumRecord.id);
                expect(albumRecord).to.deep.equal(expected);
            });
        });
    });
    describe('GET /albums/{id}', () => {
        it('returns the album with the correct id', async () => {
            const { status, body } = await (await request(app).get(`albums/${album[0].id}`)).send();
            expect(status).to.equal(200);
            expect(body).to.deep.equal(album[0]);
        });
        it('returns a 404 if the album does not exist', async () => {
            const { status } = await (await request(app).get('/albums/999999999')).send();
            expect(status).to.equal(404);
        });
    });
});