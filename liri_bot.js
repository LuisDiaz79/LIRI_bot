require("dotenv").config();
const keys = require("./keys.js");
const request = require("request");
const Spotify = require("node-spotify-api");
const imdb = require('imdb-api');
const moment = require("moment");
const json = require('prettyjson');

const action = process.argv[2];


switch (action) {
    case 'concert-this':
        const artist = process.argv[3];
        request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`, function (error, response, body) {

            // If there were no errors and the response code was 200 (i.e. the request was successful)...
            if (!error && response.statusCode === 200) {

                // Then we print out the imdbRating
                const res = JSON.parse(body);

                console.log(`Venue: ${res[0].venue.name}`);
                console.log(`Venue location: ${res[0].venue.city}, ${res[0].venue.region}. ${res[0].venue.country}`);
                console.log(`Date : ${res[0].datetime}`);
            }
        });

        break;
    case 'spotify-this-song':
        const spotify = new Spotify(keys.spotify);
        const song = process.argv.slice(3).join(" ");
        spotify
            .search({ type: 'track', query: song })
            .then(response => {
                console.log(`Artist : ${response.tracks.items[0].artists[0].name}`);
                console.log(`Song name : ${response.tracks.items[0].name}`);
                console.log(`URL : ${response.tracks.items[0].artists[0].external_urls.spotify}`);
                console.log(`Album Name : ${response.tracks.items[0].name}`);
            })
            .catch(err => console.log(err));

        break;
    case 'movie-this':
        const movie_name = process.argv.slice(3).join(" ");
        imdb.get(
            { name: movie_name },
            { apiKey: keys.imdb.apiKey, timeout: 30000 })
            .then(response => {

                console.log(`TItle: ${response.title}`);
                console.log(`Year: ${response.year}`);
                console.log(`Rating: ${response.rating}`);
                console.log(`Country: ${response.country}`);
                console.log(`Plot: ${response.plot}`);

            }).catch(err => console.log(err));
        break;
    case 'do-what-it-says':


        break;
    default:
        break;
}