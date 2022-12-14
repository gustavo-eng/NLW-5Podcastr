import {  createContext, ReactNode, useContext, useState } from "react";

type Episode = {
    title: string;
    members: string;
    duration: number;
    thumbnail: string;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[]; 
    currentEpisodeIndex: number;
    isPlaying: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void; 
    togglePlay: () => void;
    setPlayingState: (state: boolean) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void; 
    toggleLoop: () => void;
    toggleShuffle: () => void;
    clearPlayerState: () => void;
    
};

export const PlayerContext = createContext({} as PlayerContextData); // contexto no formato <PlayerContextData> 

type  PlayerContextProviderProps = {
    children: ReactNode; 
}

export function  PlayerContextProvider({children}) {

  
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }



  function togglePlay() {
    setIsPlaying(!isPlaying) // inverte valores para n precisar criar duas vars 
  }

  function toggleLoop() {
    setIsLooping(!isLooping)
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean) {
      setIsPlaying(state);
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext  = isShuffling || (currentEpisodeIndex + 1) <  episodeList.length; 

  function playNext() {
    
    const nextEpisodeIndex = currentEpisodeIndex + 1;
    if(isShuffling){
       const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
       setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if(hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }

  }

  function playPrevious() {
    if(hasPrevious) {
        setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  return (
    <PlayerContext.Provider 
        value ={
            {
                
                episodeList, 
                currentEpisodeIndex, 
                play, 
                isPlaying, 
                isShuffling,
                togglePlay, 
                setPlayingState,
                playList,
                playNext, 
                playPrevious,
                hasNext, 
                hasPrevious,
                isLooping,
                toggleLoop,
                toggleShuffle,
                clearPlayerState,
            }
        }> 
            {children}
    </PlayerContext.Provider>
  )

}


export const usePlayer = () => {
  return useContext(PlayerContext);
}
















