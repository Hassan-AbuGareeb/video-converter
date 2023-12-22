"use client";
import { useEffect, useState } from "react";
import Search from "@/util/Search";
import Button from "@/util/Button";

export default function Home() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    search &&
      getSearchResults(search).then((videos) => setSearchResults(videos.items));
  }, [search]);

  const videoCards = searchResults.map((video) => {
    return (
      <div
        key={video.id.videoId}
        className="flex felx-col flex-wrap justify-center w-[300px] p-2 bg-slate-500 border border-teal-500 rounded-lg shadow"
      >
        <iframe
          src={`https://www.youtube.com/embed/${video.id.videoId}`}
          allowFullScreen={true}
          className="rounded-lg w-full h-48"
        />
        <div className="px-auto py-2 text-center">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
            {video.snippet.title}
          </h5>
          <div className="flex flex-wrap justify-center py-3">
            <button
              onClick={() =>
                convertVideo(video.id.videoId, video.snippet.title)
              }
              className="text-slate-300  bg-slate-800 rounded-md font-semibold px-3 py-1"
            >
              Download MP3
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

async function convertVideo(videoId, videoName) {
  try {
    const convertResponse = await fetch(
      `/.netlify/functions/server/${videoId}`
    );
    const convertData = await convertResponse.blob();

    if (convertResponse.ok) {
      const url = window.URL.createObjectURL(convertData);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${videoName}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      alert("Error converting video");
    }
  } catch (error) {
    console.error("Error converting video", error);
  }
}
