import { Headline } from '@door2door/web-components'
import Image from 'next/image';
import styles from './styles.module.scss'
import { Headphones, Shuffle, ArrowLeft, Play, ArrowRight, Repeat, Pause } from 'react-feather';
import { usePlayer } from '../../contexts/PlayerContext';
import { useRef, useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)

  const [progress, setProgress] = useState(0)

  const { episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    togglePlay, 
    setPlayingState, 
    hasNext, 
    playNext, 
    hasPrevious, 
    playPrevious, 
    isLooping, 
    toggleLoop, 
    isShuffling, 
    toggleShuffle,
    clearPlayerState
  } = usePlayer()

  useEffect(() => {
    if(!audioRef.current) {
      return
    }
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleEpisodeEnded() {
    if(hasNext) {
      playNext()
    } else {
      clearPlayerState()
    }
  }

  const episode = episodeList[currentEpisodeIndex]

  return(
    <div className={styles.playerContainer}>
      <header>
        <Headphones />
        <Headline variant="level4">Playing now</Headline>
      </header>

      { episode 
      ? (
        <div className={styles.currentEpisode}>
          <Image width={500} height={500} src={episode.thumbnail} objectFit="cover"/>
          <Headline style={{marginTop: "1rem", textAlign: "center"}} variant="level4">{episode.title}</Headline>
        </div>
      ) 
      : (
      <div className={styles.emptyPlayer}>
        <Headline variant="level4"> Select a podcast to listen</Headline>
      </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            { episode ? (
            <Slider max={episode.duration} 
            onChange={handleSeek} 
            value={progress} 
            trackStyle={{backgroundColor: '#26c4b8'}} 
            handleStyle={{backgroundColor: '#ffffff', borderColor: '#26c4b8', borderWidth: 4}}/>) 
            : (<div className={styles.emptySlider} />)}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && (
          <audio src={episode.url} 
          autoPlay
          loop={isLooping}
          ref={audioRef}
          onPlay={() => setPlayingState(true)}
          onPause={()=> setPlayingState(false)}
          onEnded={handleEpisodeEnded}
          onLoadedMetadata={setupProgressListener}/>
        )}

        <div className={styles.buttons}>
          <button type="button" onClick={toggleShuffle} disabled={!episode || episodeList.length == 1}>
            <Shuffle color={isShuffling ? '#26c4b8' : '#ffffff'}/>
          </button>
          <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <ArrowLeft />
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <ArrowRight />
          </button>
          <button type="button" onClick={toggleLoop} disabled={!episode}>
            <Repeat color={isLooping ? '#26c4b8' : '#ffffff'}/>
          </button>
        </div>

      </footer>
    </div>
  )
}