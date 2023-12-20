"use client";
import { useEffect, useState } from "react";
import Search from "@/util/Search";

async function getSearchResults(videoTitle) {
  const options = {
    headers: {
      Accept: "application/json",
    },
  };
  const searchResultsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=AIzaSyAVUpF36gRO-H4bRwq5o4kRb9AFotteCKE&q=${videoTitle}&type=video&part=snippet&maxResults=5&videoDuration=short`,
    options
  );
  const searchResultsData = await searchResultsResponse.json();
  return searchResultsData;
}

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
        className="w-[300px] p-2 bg-slate-500 border border-teal-500 rounded-lg shadow"
      >
        <iframe
          src={`https://www.youtube.com/embed/${video.id.videoId}`}
          className="rounded-lg w-full h-60"
        />
        <div className="px-auto py-2 text-center">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
            {video.snippet.title}
          </h5>
          {/* add two buttons here download, and convert to mp3*/}
        </div>
      </div>
    );
  });
  // onSearchClick={setSearch}
  return (
    <div className="">
      <Search onSearchClick={setSearch} />
      <div className="flex flex-row flex-wrap w-full p-5 justify-center gap-10">
        {videoCards}
      </div>
    </div>
  );
}
