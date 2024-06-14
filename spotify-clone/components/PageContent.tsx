"use client";
import {Song} from "@/types";
import React from "react";
import SongItem from "@/components/SongItem";

interface PageContentProps {
    songs: Song[];
}

const PageContent: React.FC<PageContentProps> = ({songs}) => {

  //No songs available = render just the text
  if (songs.length === 0) {
      return(
        <div className={"mt-4 text-neutral-400"}>
            No songs available.
        </div>
      );
  }

  //If songs available, render songs in grid structure
  return(
    <div className={"grid grid-col-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mt-4"}>
        {songs.map((item) => (
            <SongItem key={item.id} onClick={() => {}} data={item}/>
        ))}
    </div>
  );
}

export default PageContent;