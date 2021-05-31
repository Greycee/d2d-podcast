import { Headline, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@door2door/web-components'
import { Play } from 'react-feather';
import  { GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'
import styles from './home.module.scss'
import { usePlayer } from '../contexts/PlayerContext';

type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  duration: number,
  durationAsString: string,
  url: string,
}

type HomeProps = {
  latestEpisodes: Episode[],
  allEpisodes: Episode[]
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  const { playList } = usePlayer()

  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <Headline variant="level2">Latest Episodes</Headline>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return(
              <Paper elevation={2} key={episode.id}>
                  <li>
                    <Image width={192} height={192} objectFit="cover" src={episode.thumbnail} alt={episode.title}/>
                    <div className={styles.episodeDetails}>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                      <span>{episode.durationAsString}</span>
                    </div>
                    <button type="button" onClick={() => playList(episodeList, index)}><Play /></button>
                </li>
              </Paper>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <Headline variant="level2">All Episodes</Headline>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Podcast</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allEpisodes.map((episode, index) => {
              return(
                <TableRow key={episode.id}>
                  <TableCell>
                    <Image width={120} height={120} src={episode.thumbnail} alt={episode.title} objectFit="cover" />
                  </TableCell>
                  <TableCell>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </TableCell>
                  <TableCell>{episode.durationAsString}</TableCell>
                  <TableCell><button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}><Play /></button></TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 10,
      _sort: 'id',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url
    }
  })
  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }
}