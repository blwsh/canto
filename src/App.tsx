import {SpotifyApi, Track} from "@spotify/web-api-ts-sdk";
import {useEffect, useState} from "react";

import './App.css';

const recommendations = [
  {"name": "Don't Stop Believin'", "artists": ["Journey"]},
  {"name": "Bohemian Rhapsody", "artists": ["Queen"]},
  {"name": "Mr. Brightside", "artists": ["The Killers"]},
  {"name": "Sweet Caroline", "artists": ["Neil Diamond"]},
  {"name": "Livin' on a Prayer", "artists": ["Bon Jovi"]},
  {"name": "I Wanna Dance With Somebody (Who Loves Me)", "artists": ["Whitney Houston"]},
  {"name": "Can't Stop the Feeling! (From the DreamWorks Animation Film Trolls)", "artists": ["Justin Timberlake"]},
  {"name": "Shallow", "artists": ["Lady Gaga", "Bradley Cooper"]},
  {"name": "Hey Ya!", "artists": ["Outkast"]},
  {"name": "Uptown Funk", "artists": ["Mark Ronson feat. Bruno Mars"]},
  {"name": "I Will Survive", "artists": ["Gloria Gaynor"]},
  {"name": "Dancing Queen", "artists": ["ABBA"]},
  {"name": "Let It Go", "artists": ["Idina Menzel"]},
  {"name": "A Sky Full Of Stars", "artists": ["Coldplay"]},
  {"name": "Africa", "artists": ["Toto"]},
  {"name": "September", "artists": ["Earth, Wind & Fire"]},
  {"name": "Like a Prayer", "artists": ["Madonna"]},
  {"name": "YMCA", "artists": ["Village People"]},
  {"name": "I'm Gonna Be (500 Miles)", "artists": ["The Proclaimers"]},
  {"name": "Walk This Way", "artists": ["Run-D.M.C. feat. Aerosmith"]}
];

const CLIENT_ID = "118849aa401e4f1f9abf398b5cc66b7a"

function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [imgIndex2, setImgIndex2] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setImgIndex(-1)
      setImgIndex2(-1)
      return
    }

    const interval = setInterval(() => {
      setImgIndex(Math.floor(Math.random() * (tracks.length - 1)));
      setImgIndex2(Math.floor(Math.random() * (tracks.length - 1)));
    }, 300);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [tracks, loading]);

  useEffect(() => {
    const sdk = SpotifyApi.withUserAuthorization(CLIENT_ID, "http://localhost:3000", [
      "user-library-read"
    ]);

    sdk.currentUser.tracks.savedTracks(50).then((response) => {
      setTracks(response.items.map((item) => item.track))

      setTimeout(() => {
        Promise.all(recommendations.map(recommendation => {
          // @ts-ignore
          return sdk.search(`${recommendation.name} ${recommendation.artists.join(', ')}`, ["track"])
        })).then((results) => {
          setTracks(results.map((result) => {
            return result.tracks?.items[0]
          }))

          setLoading(false)
        })
      }, 5000)
    })
  }, []);

  return loading ? (
    <div className={`grid ${!loading ? 'loaded' : ''}`}>
      {tracks.map((track, i) => (
        track.album.images.length > 0 &&
        <img key={track.id} className={imgIndex === i || imgIndex2 === i ? 'bright' : ''}
             src={track.album.images[0].url} alt={track.name}/>
      ))}
    </div>
  ) : (
    <div>
      <div className="recommendations">
        {tracks.map((track, i) => (
          <div key={track.id} className="track">
            <img src={track.album.images[0].url} alt={track.name}/>
            <h3>{track.name}</h3>
            <p>{track.artists.map((artist) => artist.name).join(', ')}</p>
          </div>
        ))}
      </div>

      <div className='controls'>
        <button>More 🥰</button>
        <button>More 🎷</button>
        <button>More 🤘</button>
        <button data-tooltip='This is a paid feature' disabled>Ask Canto</button>
      </div>
    </div>
  );
}

export default App;
