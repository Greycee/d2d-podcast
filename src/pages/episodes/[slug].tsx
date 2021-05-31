import {GetStaticProps, GetStaticPaths} from 'next'
import { Headline } from '@door2door/web-components'
import { api } from '../../services/api'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'
import styles from './episode.module.scss'
import { ArrowLeft, Play } from 'react-feather';
import Image from 'next/image';
import { usePlayer } from '../../contexts/PlayerContext'

type Episode = {
  id: string,
  title: string,
  description: string,
  thumbnail: string,
  duration: number,
  durationAsString: string,
  url: string,
}

type EpisodeProps = { 
  episode: Episode
}

export default function Episode({episode}: EpisodeProps) {
  const { play } = usePlayer()
  return(
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <button><ArrowLeft /></button>
        <Image width={300} height={300} src={episode.thumbnail} objectFit="cover" objectPosition="top"/>
        <button type="button" onClick={() => play(episode)}><Play /></button>
      </div>
      <header>
        <Headline variant="level1">{episode.title}</Headline>
        <span>{episode.durationAsString}</span>
      </header>
      <div className={styles.description}>
        {episode.description}
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async(ctx) => {
  const {slug} = ctx.params
  const {data} = await api.get(`/episodes/${slug}`)
  const episode = {
    id: data.id,
    title: data.title,
    description: data.description,
    thumbnail: data.thumbnail,
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    url: data.file.url
  }
  return {
    props: {episode},
    revalidate: 60 * 60 * 24,
  }
}