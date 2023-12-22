"use client";
import { useEffect, useState } from "react";
import Search from "@/util/Search";

export default function Home() {
  //search entered by user
  const [search, setSearch] = useState("");
  //search results from the api
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    //fetch only if the search contains any value
    search &&
      getSearchResults(search).then((videos) => setSearchResults(videos.items));
  }, [search]);

  const videoCards = searchResults.map((video) => {
    const videoId = video.id.videoId;
    const videoTitle = video.snippet.title;
    return (
      <div
        key={videoId}
        className="flex felx-col flex-wrap justify-center w-[350px] p-2 bg-slate-500 border border-teal-500 rounded-lg shadow"
      >
        {/* display the fetched video */}
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen={true}
          className="rounded-lg w-80 h-48"
        />
        <div className="px-auto py-2 text-center">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
            {videoTitle}
          </h5>
          <div className="flex flex-wrap gap-x-5 justify-center py-3">
            <button
              onClick={() => getvideoMp3File(videoId, videoTitle)}
              className="text-slate-300  bg-slate-700 rounded-md font-semibold px-3 py-1 hover:bg-slate-800"
            >
              Download MP3
            </button>
            <button
              onClick={() => addToList()}
              className="text-slate-300  bg-slate-700 rounded-md font-semibold px-3 py-1 hover:bg-slate-800"
            >
              Add to download list
            </button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="">
      <Search onSearchClick={setSearch} />
      <div className="flex flex-row flex-wrap w-full p-5 justify-center gap-10">
        {videoCards}
      </div>
    </div>
  );
}

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

async function getvideoMp3File(videoId, videoName) {
  try {
    const mp3FileResp = await fetch(`http://localhost:3003/${videoId}`);
    const mp3FileData = await convertResponse.blob();

    if (mp3FileResp.ok) {
      //search for this thing
      const url = window.URL.createObjectURL(mp3FileData);
      //create an anchor tag, assign it the url and download path, and click it.
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

function addToList() {}
