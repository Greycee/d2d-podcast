import { createContext, useState, ReactNode, useContext } from 'react'

type Episode = {
  title: string,
  thumbnail: string,
  duration: number,
  url: string,
}

type PlayerContextData = {
  episodeList: Episode[],
  currentEpisodeIndex: number,
  play: (episode: Episode) => void,
  playList: (list: Episode[], index: number) => void,
  isPlaying: boolean,
  togglePlay: () => void,
  hasNext: boolean,
  playNext: () => void,
  hasPrevious: boolean,
  playPrevious: () => void,
  setPlayingState: (state: boolean) => void,
  toggleLoop: () => void,
  isLooping: boolean,
  toggleShuffle: () => void,
  isShuffling: boolean,
  clearPlayerState: () => void,
}

type PlayerContextProviderProps = {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({children}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  function play(episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function toggleLoop() {
    setIsLooping(!isLooping)
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  const hasPrevious = currentEpisodeIndex > 0 

  function playPrevious() {
    if (hasPrevious) { 
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  function clearPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  return (
    <PlayerContext.Provider value={{episodeList, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayingState, playList, hasNext, playNext, hasPrevious, playPrevious, toggleLoop, isLooping, toggleShuffle, isShuffling, clearPlayerState}}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}