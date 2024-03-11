"use client";
import { useEffect, useState } from "react";
import Search from "@/util/Search";

let API_TOKEN = "";

async function getAuthKey() {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "8144dd1f03334ac4ac05061238ed85f7",
      client_secret: "6e500cf879684f33a3b90b34c70a65ad",
    }),
  };
  const keyResponse = await fetch(
    "https://accounts.spotify.com/api/token",
    options
  );
  const key = await keyResponse.json();
  API_TOKEN = key.access_token;
}

export default function Home() {
  //search entered by user
  const [search, setSearch] = useState("");
  //search results from the api
  const [searchResults, setSearchResults] = useState([]);
  //current playlist
  const [currentPlaylist, setCurrentPlaylist] = useState("");
  //current playlist songs
  const [playlistSongs, setPlaylistSongs] = useState([]);
  //download list states
  // const [downloadsList, setDownloadsList] = useState([]);

  useEffect(() => {
    //fetch only if the search contains any value
    search &&
    /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?\/[a-zA-Z0-9]{2,}/.test(
      search
    )
      ? setCurrentPlaylist(
          getPlaylist(search.slice(search.lastIndexOf("/") + 1))
        )
      : getPlaylistSearchResults(search).then((playlists) =>
          setSearchResults([...playlists])
        );
  }, [search]);

  useEffect(() => {
    getAuthKey();
  }, []);

  // function addToList(videoId, videoName, thumbnail) {
  //   for (const vid of downloadsList) {
  //     //if the video exists in the download list show an alert an abort the addition operation
  //     if (vid.videoId === videoId) {
  //       alert("video already exists");
  //       return;
  //     }
  //   }
  //   //add the video to the downloads list
  //   setDownloadsList((prev) => {
  //     return [...prev, { videoId, videoName, thumbnail }];
  //   });
  // }

  // function removeAllDownloads() {
  //   setDownloadsList([]);
  // }

  // function removeFromList(videoId) {
  //   let tempDownloadsList = [];
  //   for (const vid of downloadsList) {
  //     if (vid.videoId !== videoId) {
  //       //add all other videos except for the one whose name is sent to the function
  //       tempDownloadsList = [...tempDownloadsList, vid];
  //     }
  //   }
  //   //update the downloads list
  //   setDownloadsList([...tempDownloadsList]);
  // }

  // function downloadAll() {
  //   for (const vid of downloadsList) {
  //     getVideoMp3File(vid.videoId, vid.videoName);
  //   }
  //   removeAllDownloads();
  // }

  ///copies the object from the search results to the current playlist
  function handlePlaylistClick(playlistId) {
    //assign the clicked playlist to current playlist state
    setCurrentPlaylist(
      searchResults.find((playlist) => {
        return playlist.id === playlistId;
      })
    );
  }

  const playlistCards = searchResults.map((playlist) => {
    const playlistId = playlist.id,
      title = playlist.name,
      imageUrl = playlist.images[0].url;
    return (
      <div
        key={playlistId}
        className="flex felx-row flex-nowrap justify-start items-center gap-x-4 w-[350px] p-3 bg-slate-500 hover:bg-slate-700 hover:cursor-pointer rounded-lg shadow-lg shadow-green-500/50"
        onClick={() => handlePlaylistClick(playlistId)}
      >
        {/* display the fetched playlist */}
        <img
          src={imageUrl}
          alt="title"
          className="rounded-lg w-20 h-20 border border-slate-400 "
        />
        <div className="flex flex-col">
          {/* playlist title here */}
          <h5 className="mb-2 text-lg font-bold text-gray-900">{title}</h5>
          <span>
            By:{" "}
            <a
              href={playlist.owner.external_urls.spotify}
              target="_blank"
              className="font-bold text-sm text-violet-800 hover:text-violet-700"
            >
              {playlist.owner.display_name}
            </a>
          </span>
          <a
            href={playlist.external_urls.spotify}
            target="_blank"
            className="font-bold text-sm text-green-400 hover:text-green-500"
          >
            view in spotify
          </a>
        </div>
      </div>
    );
  });

  // const playlistSongs = currentPlaylist.map((song)=>{
  //   return(

  // )

  //create the cards for the downloads list
  // const downloadsListCards = downloadsList.map((video) => {
  //   return (
  //     <div
  //       key={video.videoId}
  //       className="bg-slate-600 w-full h-24 p-2 rounded-md flex flex-row justify-between items-center"
  //     >
  //       <p className="text-slate-300 text-md font-semibold w-56">
  //         {video.videoName}
  //       </p>
  //       <button
  //         className="text-slate-300  bg-red-500 rounded-md font-semibold px-3 py-1 hover:bg-slate-800 w-20 h-10 "
  //         onClick={() => removeFromList(video.videoId)}
  //       >
  //         Remove
  //       </button>
  //     </div>
  //   );
  // });

  return (
    <div className="">
      <Search
        onSearchClick={setSearch}
        placeholderValue={"Search for a playlist or enter a playlist link..."}
      />
      <div className="flex flex-row p-4 justify-between">
        {/* playlist cards container */}
        <div
          className={`flex flex-col flex-nowrap 
           py-5 justify-center gap-5`}
        >
          {playlistCards}
        </div>
        {/* playlist songs list here */}
        {!!currentPlaylist && currentPlaylist.tracks && (
          <div className="flex felx-col flex-nowrap gap-4 p-3 bg-red">
            {currentPlaylist.tracks.items.map((song) => {
              console.log(song.name);
              return <div key={song.name}>{song.name}</div>;
            })}
          </div>
        )}
        {/* downloads list container, don't show if the downloads list is empty */}
        {/* {downloadsList.length !== 0 && (
          <div
            className={`bg-slate-300 rounded-lg w-[800px] max-h-[1100px] mr-9 px-4 py-4 overflow-y-scroll`}
          > */}
        {/* downloads list control buttons */}
        {/* <div className="flex flex-row justify-between"> */}
        {/* <button
                className="text-slate-300  bg-slate-700 rounded-md font-semibold px-3 py-1 hover:bg-slate-800"
                onClick={downloadAll}
              >
                Download All
              </button>
              <button
                className="text-slate-300  bg-slate-700 rounded-md font-semibold px-3 py-1 hover:bg-slate-800"
                onClick={removeAllDownloads}
              >
                Remove All
              </button>
            </div> */}
        {/* downloads list videos cards */}
        {/* <div className="w-full my-4 flex flex-col gap-y-4 rounded-md">
              {downloadsListCards}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}

async function getPlaylistSearchResults(searchInput) {
  if (searchInput.length > 0) {
    const options = {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    };
    //get the search results of the entered text
    const playlistResultResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=playlist&limit=5`,
      options
    );
    const playlistResultData = await playlistResultResponse.json();
    return playlistResultData.playlists.items;
  }
  return [];
}

async function getPlaylist(playlistId) {
  //get the playlist from spotify
  const options = {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };
  const playlistResponse = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    options
  );
  const playlistData = await playlistResponse.json();
  console.log(playlistData);
  return playlistData;
}

//get the search results using youtube api
// async function getSearchResults(videoTitle) {
//   const options = {
//     headers: {
//       Accept: "application/json",
//     },
//   };
//   const searchResultsResponse = await fetch(
//     `https://www.googleapis.com/youtube/v3/search?key=AIzaSyAVUpF36gRO-H4bRwq5o4kRb9AFotteCKE&q=${videoTitle}&type=video&part=snippet&maxResults=5&videoDuration=any&videoCategoryId=10`,
//     options
//   );
//   const searchResultsData = await searchResultsResponse.json();
//   return searchResultsData;
// }

//get and download the video mp3 file
// async function getVideoMp3File(videoId, videoName) {
//   try {
//     //send get request to the backend
//     const mp3FileResp = await fetch(
//       `https://video-converter-backend-production-b841.up.railway.app/${videoId}`
//     );
//     //search for the blob thingy
//     const mp3FileData = await mp3FileResp.blob();
//     if (mp3FileResp.ok) {
//       //search for this thing
//       const url = window.URL.createObjectURL(mp3FileData);
//       //create an anchor tag, assign it the url and download path, and click it, all of this just to download the mp3 file.
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${videoName}.mp3`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       //search for this thing too
//       window.URL.revokeObjectURL(url);
//     } else {
//       alert("Error converting video");
//     }
//   } catch (error) {
//     console.error("Error converting video", error);
//   }
// }
