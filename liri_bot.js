require("dotenv").config();
const keys = require("./keys.js");
const request = require("request");
const Spotify = require("node-spotify-api");
const imdb = require('imdb-api');
const fs = require('fs');

const action = process.argv[2];
const value =  process.argv.slice(3).join(" ");

const concert = artist => {

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
}

const spotityThis = song => {
    const spotify = new Spotify(keys.spotify);

    spotify
        .search({ type: 'track', query: song })
        .then(response => {
            console.log(`Artist : ${response.tracks.items[0].artists[0].name}`);
            console.log(`Song name : ${response.tracks.items[0].name}`);
            console.log(`URL : ${response.tracks.items[0].artists[0].external_urls.spotify}`);
            console.log(`Album Name : ${response.tracks.items[0].name}`);
        })
        .catch(err => console.log(err));
}

const movieThis = movieName => {

    imdb.get(
        { name: movieName },
        { apiKey: keys.imdb.apiKey, timeout: 30000 })
        .then(response => {

            console.log(`TItle: ${response.title}`);
            console.log(`Year: ${response.year}`);
            console.log(`Rating: ${response.rating}`);
            console.log(`Country: ${response.country}`);
            console.log(`Plot: ${response.plot}`);

        }).catch(err => console.log(err));
}

const readfile = () => {
    fs.readFile("./random.txt", "utf8", (error, data) => {
        if (data) {
            var dataArr = data.split(",");
            dataArr = [
                dataArr[0],    //Command
                dataArr.slice(1, dataArr[1].length).join(" ").trim()   //Argument
            ]
            console.log(dataArr);
            api_finder(dataArr[0], dataArr[1]);
        } else if (error) {
            return console.log(error);
        }
    });
}

const api_finder = (action, val) => {
    switch (action) {
        case 'concert-this':
            concert(val)

            break;
        case 'spotify-this-song':
            spotityThis(val);
            break;
        case 'movie-this':
            movieThis(val)
            break;
        case 'do-what-it-says':
            readfile();

            break;
        default:
            break;
    }
}

api_finder(action, value);