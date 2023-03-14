/* eslint-disable no-undef */
const { expect } = require('chai')
const request = require('supertest')
const db = require('../src/db')
const app = require('../src/app')

describe('Update Album', () => {
    let artist;
    let album;
    let singleArtistID;
    beforeEach(async () => {
        let albumData;
        let artistData;

        artistData = await Promise.all([db.query(`INSERT INTO Artists (name, genre) VALUES ($1, $2) RETURNING *`,
        ['Tame Impala', 'rock'])
        ]);
        artist = artistData.map(({ rows }) => rows[0]);
        singleArtistID = artist[0].id;

        albumData = await Promise.all([db.query('INSERT INTO Albums (name, date, artistID) VALUES ($1, $2, $3) RETURNING *',
        ['Currents', 2015, singleArtistID]),
        ]);

        album = albumData.map(({ rows }) => rows[0]);
    });

    describe('PATCH /albums{id}', () => {
        it('updates the album and returns the updated record', async () => {
            const { status, body } = await request(app).patch(`/albums/$album[0].id`)
            .send({ name: 'new album', date: 2023, artistID: singleArtistID});
            expect(status).to.equal(200);
            expect(body).to.deep.equal({
                id: album[0].id,
                name: 'new album',
                date: 2023,
                artistID: singleArtistID
            });

            it('returns a 404 if the album does not exist', async () => {
                const { status } = await (await request(app).patch('/albums/99999999')).send({ name: 'new album', date: 2023, artistID: singleArtistID});
                expect(status).to.equal(404);
            });
        });
    });
});