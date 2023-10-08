const express = require("express")
const cors = require("cors")
const axios = require("axios")
const Genius = require("genius-lyrics");
const Client = new Genius.Client("NxEOYDpXCf2w0duofLbAsuJxv_iUSPv-f6whgwiCpyF8Qs47jApxpBxMJYCPfjLi");
const app = express()
let port = process.env.PORT || 3001;
app.use(cors())
app.use(express.json())


app.get("/lyrics/:id", async (req, res) => {
    // console.log(req.body.artists.map(e => e.name))
    try {
        const lyrics = await getLyrics(req.params.id)
        if (lyrics) {
            res.json({ lyrics: lyrics })

        }
        else {
            res.json({ lyrics: "No lyrics found" })
        }
    }
    catch (err) {
        res.json({ lyrics: "No lyrics found for the song" })
    }
})

app.post("/get-songs-list", async (req, res) => {
    try {
        const songs = await getSongList(req.body.artist, req.body.track)
        res.send(songs.map((e) => e._raw))

    } catch (error) {
        console.log(error.message)
        res.json({ songs: "error fetching songs list" })
    }
})

// app.listen(3000)
app.listen(port, () => {
    console.log(`http://localhost:${port}/lyrics`)
});

async function getLyrics(id=-1) {
    try {
        let i = 0, lyrics = null
          const songs = await Client.songs.get(+id);
          if (songs) {
            lyrics = await songs.lyrics(true)
          }
        return lyrics;
    }
    catch (error) {
        console.error(error);
        return null;
      }
}

const getSongList = async (artist = "", song) => {
    try {
        const songs = await Client.songs.search(`${song} ${artist}`);
        return songs;
    } catch (error) {
        console.error(error);
        return null;
    }

}


