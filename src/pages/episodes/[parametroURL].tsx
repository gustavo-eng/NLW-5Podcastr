import Link from 'next/link';
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { GetStaticPaths, GetStaticProps } from 'next';
import {useRouter} from 'next/router'
import { api } from '../../services/api'
import convertDurationToTimeString from '../../utils/convertDurationToTimeString'
import styles from './episode.module.scss';
import Image from 'next/image' ; 
import { useContext } from 'react';
import { PlayerContext, usePlayer } from '../../contexts/PLayerContext';
import Head from 'next/head';
type Episode = {
  id: string;
  title: string;
  members: string;
  published_at?: string; 
  durationAsString?: string;
  thumbnail: string;
  description: string; 
  duration:  number;
  url: string;
  publishedAt?: string;
}


type EpisodeProps = {
    episode: Episode;
}

export default function Episode({episode}: EpisodeProps) {

    //const {} = useContext(PlayerContext)
    const { play } = usePlayer();

    //const router = useRouter()

    return (
        <div className={styles.episode}>

        <Head>
            <title>  Episodes | Podcastr </title>
        </Head>
            <div className={styles.thumbnailContainer}>
                <Link href={`../`}> 
                    <button type='button'>   
                        <img src="/arrow-left.svg" alt="Voltar"  />
                    </button>
                </Link>

                    <Image  width={700}  height={160} src={episode.thumbnail} objectFit="cover" />
                    <button type='button' onClick={() => play(episode)}>
                            <img src="/play.svg" alt="Play episode"/>
                    </button>                    
            </div>

            <header>
                <h1> {episode.title} </h1>
                <span> {episode.members} </span>
                <span> {episode.publishedAt} </span>
                <span> {episode.durationAsString} </span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}} />
                
            
        </div>
    )

}

// hooks como o useRouter() pode ser utilzado apenas dentro de componentes 

export  const getStaticPaths: GetStaticPaths = async () => {

    const { data } = await api.get('episodes', {
        params: {
         _litmit: 2,
         _sort: 'published_at',
         _order: 'desc'
        }
     }) 

     // gerando array de paths dos episodeos 

     const paths = data.map(episode => {
        return {
            params: {
                parametroURL: episode.id
            }
        }
     })

    return {
        paths,
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async (contexto) => {
    
    const { parametroURL } = contexto.params;
    const { data } = await api.get(`/episodes/${parametroURL}`)


    const episode = {
            id: data.id,
            title: data.title, 
            thumbnail: data.thumbnail, 
            members: data.members, 
            publishedAt: format(parseISO(data.published_at ), 'd MMM  yy', {locale: ptBR} ), 
            duration: Number(data.file.duration),
            durationAsString: convertDurationToTimeString(Number(data.file.duration)),
            description: data.description,
            url: data.file.url,    
    };
    

    return {
        props: { episode },
        revalidate: 60 * 60 * 24 // sera renderizado essa pagina a cada 24 horas 
    }
}


//<img src="/arrow-left.svg" alt="Voltar"  /> -> primeiro dentro do botao
//  <img src="/play.svg" alt="Play episode" className='seta'/> -> segundo dentro do segundo button 

