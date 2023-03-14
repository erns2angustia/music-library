/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');
const request = require('supertest');
const db = require('../src/db');
const app = require('../src/app');

describe('Delete Album', () => {
    let album;
    let artist;
    let singleArtistID;
    beforeEach(async () => {
        let albumData;
        let artistData;

        artistData = await Promise.all([db.query(`INSERT INTO Artists (name, genre) VALUES ($1, $2) RETURNING *`,
        ['Tame Impala', 'rock'])
        ]);
        artist = artistData.map(({ rows }) => rows[0]);
        singleArtistID = artist[0].id;
        
        albumData = await Promise.all([db.query(`INSERT INTO Album (name, year, artist_id) VALUES ($1, $2, $3) RETURNING *`,
        ['Currents', 2015, singleArtistID])
        ]);

        album = albumData.map(({ rows }) => rows[0]);

    describe('DELETE /albums/{id}', () => {
        it('deleted the album and returns the deleted data', async () => {
            const { status, body } = await (await request(app).delete(`albums/${album[0].id}`)).setEncoding();

            expect(status).to.equal(200);
            expect(body).to.deep.equal({
                id: album[0].id,
                name: 'Currents',
                date: 2015,
                artistID: singleArtistID
            });
        });
        it('returns a 404 if the album does not exist', async () => {
            const { status } = await (await request(app).delete('/albums/999999999')).send();
            expect(status).to.equal(404);
        });
    });
    });
});