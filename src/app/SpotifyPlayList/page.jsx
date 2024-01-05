"use client";
import { useEffect, useState } from "react";
import Search from "@/util/Search";

const API_TOKEN =
  "BQAoiVS4RIvRK-wSHfwZ8sEgbc3tjo1_4Awlgz4pBf8Af4tgNb4GY5MR8HtHK0RxREL_Cq5-i_nihDaVGLLZI8Dvv0kopbkJqjSlLPMfX3slt-Q1BBU";

export default function Home() {
  //search entered by user
  const [search, setSearch] = useState("");
  //search results from the api
  const [searchResults, setSearchResults] = useState([]);
  //current playlist
  const [currentPlaylist, setCurrentPlaylist] = useState({});

  //download list states
  const [downloadsList, setDownloadsList] = useState([]);

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

  function addToList(videoId, videoName, thumbnail) {
    for (const vid of downloadsList) {
      //if the video exists in the download list show an alert an abort the addition operation
      if (vid.videoId === videoId) {
        alert("video already exists");
        return;
      }
    }
    //add the video to the downloads list
    setDownloadsList((prev) => {
      return [...prev, { videoId, videoName, thumbnail }];
    });
  }

  function removeAllDownloads() {
    setDownloadsList([]);
  }

  function removeFromList(videoId) {
    let tempDownloadsList = [];
    for (const vid of downloadsList) {
      if (vid.videoId !== videoId) {
        //add all other videos except for the one whose name is sent to the function
        tempDownloadsList = [...tempDownloadsList, vid];
      }
    }
    //update the downloads list
    setDownloadsList([...tempDownloadsList]);
  }

  function downloadAll() {
    for (const vid of downloadsList) {
      getVideoMp3File(vid.videoId, vid.videoName);
    }
    removeAllDownloads();
  }

  const videoCards = searchResults.map((video) => {
    const videoId = video.id.videoId;
    const videoTitle = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.default.url;
    return (
      <div
        key={videoId}
        className="flex felx-col flex-wrap justify-center w-[350px] p-2 bg-slate-500 rounded-lg shadow-lg shadow-violet-700/50"
      >
        {/* display the fetched video */}
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen={true}
          className="rounded-lg w-80 h-48 border border-slate-400 "
        />
        <div className="px-auto py-2 text-center flex flex-col justify-between">
          {/* video title here */}
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
            {videoTitle}
          </h5>
          {/* video card control buttons */}
          <div className="flex flex-wrap gap-x-5 justify-center py-3">
            {/* download button */}
            <button
              onClick={() => getVideoMp3File(videoId, videoTitle)}
              className="text-slate-300  bg-slate-700 rounded-md font-semibold px-3 py-1 hover:bg-slate-800"
            >
              Download MP3
            </button>
            {/* add to download list button */}
            <button
              onClick={() => addToList(videoId, videoTitle, thumbnail)}
              className="text-slate-300 bg-slate-700 rounded-md font-semibold px-3 py-1 hover:bg-slate-800"
            >
              Add to download list
            </button>
          </div>
        </div>
      </div>
    );
  });

  const playlistCards = searchResults.map((playlist) => {
    const playlistId = playlist.id,
      title = playlist.name,
      imageUrl = playlist.images.url;
    return (
      <div
        key={playlistId}
        className="flex felx-col flex-wrap justify-center w-[350px] p-2 bg-slate-500 rounded-lg shadow-lg shadow-violet-700/50"
      >
        {/* display the fetched playlist */}
        <img
          src={imageUrl}
          alt="title"
          className="rounded-lg w-80 h-48 border border-slate-400 "
        />
        <div className="px-auto py-2 text-center flex flex-col justify-between">
          {/* video title here */}
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
            {videoTitle}
          </h5>
          {/* video card control buttons */}
          <div className="flex flex-wrap gap-x-5 justify-center py-3">
            {/* download button */}
            <button
              onClick={() => getVideoMp3File(videoId, videoTitle)}
              className="text-slate-300  bg-slate-700 rounded-md font-semibold px-3 py-1 hover:bg-slate-800"
            >
              Download MP3
            </button>
            {/* add to download list button */}
            <button
              onClick={() => addToList(videoId, videoTitle, thumbnail)}
              className="text-slate-300 bg-slate-700 rounded-md font-semibold px-3 py-1 hover:bg-slate-800"
            >
              Add to download list
            </button>
          </div>
        </div>
      </div>
    );
  });

  //create the cards for the downloads list
  const downloadsListCards = downloadsList.map((video) => {
    return (
      <div
        key={video.videoId}
        className="bg-slate-600 w-full h-24 p-2 rounded-md flex flex-row justify-between items-center"
      >
        <p className="text-slate-300 text-md font-semibold w-56">
          {video.videoName}
        </p>
        <button
          className="text-slate-300  bg-red-500 rounded-md font-semibold px-3 py-1 hover:bg-slate-800 w-20 h-10 "
          onClick={() => removeFromList(video.videoId)}
        >
          Remove
        </button>
      </div>
    );
  });

  return (
    <div className="">
      <Search
        onSearchClick={setSearch}
        placeholderValue={"Search for a playlist or enter a playlist link..."}
      />
      <div className="flex flex-row p-4 justify-between">
        {/* video cards container */}
        <div
          className={`flex flex-row flex-wrap 
           py-5 justify-center gap-10`}
        >
          {videoCards}
        </div>
        {/* downloads list container, don't show if the downloads list is empty */}
        {downloadsList.length !== 0 && (
          <div
            className={`bg-slate-300 rounded-lg w-[800px] max-h-[1100px] mr-9 px-4 py-4 overflow-y-scroll`}
          >
            {/* downloads list control buttons */}
            <div className="flex flex-row justify-between">
              <button
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
            </div>
            {/* downloads list videos cards */}
            <div className="w-full my-4 flex flex-col gap-y-4 rounded-md">
              {downloadsListCards}
            </div>
          </div>
        )}
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
  return playlistData;
}

//get the search results using youtube api
async function getSearchResults(videoTitle) {
  const options = {
    headers: {
      Accept: "application/json",
    },
  };
  const searchResultsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=AIzaSyAVUpF36gRO-H4bRwq5o4kRb9AFotteCKE&q=${videoTitle}&type=video&part=snippet&maxResults=5&videoDuration=any&videoCategoryId=10`,
    options
  );
  const searchResultsData = await searchResultsResponse.json();
  return searchResultsData;
}

//get and download the video mp3 file
async function getVideoMp3File(videoId, videoName) {
  try {
    //send get request to the backend
    const mp3FileResp = await fetch(
      `https://video-converter-backend-production-b841.up.railway.app/${videoId}`
    );
    //search for the blob thingy
    const mp3FileData = await mp3FileResp.blob();
    if (mp3FileResp.ok) {
      //search for this thing
      const url = window.URL.createObjectURL(mp3FileData);
      //create an anchor tag, assign it the url and download path, and click it, all of this just to download the mp3 file.
      const a = document.createElement("a");
      a.href = url;
      a.download = `${videoName}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      //search for this thing too
      window.URL.revokeObjectURL(url);
    } else {
      alert("Error converting video");
    }
  } catch (error) {
    console.error("Error converting video", error);
  }
}
