
import { useContext, useEffect } from "react";
import Header from "../components/Header";
import { GetStaticProps } from "next"; // tipagem da function 
import { type } from "os";
import { api } from "../services/api";
import {format, parseISO } from 'date-fns'; // parseISO string para data 
import ptBR from 'date-fns/locale/pt-BR'
import convertDurationToTimeString from "../utils/convertDurationToTimeString";
import styles from './home.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router' 
import { PlayerContext, usePlayer } from "../contexts/PLayerContext";
import Head from 'next/head';

// SPA 
// SSR
// SSG 

/* 
Ira buscar na pasta Header em componentes e AUTOMATICAMENTE, fara uma busca pelo index responsavel 

*/

type Episodes = {
  id: string;
  title: string;
  members: string;
  published_at?: string; 
  durationAsString?: string;
  thumbnail: string;
  description?: string; 
  duration:  number;
  url: string;
  publishedAt?: string;
  // . . . 
}

type HomesProps = {
  latestEpisodes: Episodes[];
  allEpisodes: Episodes[];
}


//Array no typescript -> uma function que recebe um parametro


export default function Home({latestEpisodes, allEpisodes}: HomesProps) {

  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes') // busca a API com objetos em json
  //         .then(response => response.json()) // retorna dado no forma JSON
  //         .then(data => console.log(data))
  // }, []) // requisicao no modelo SPA,
  // // dados carregados no momento em que entra no site 


  const episodeList = [...latestEpisodes, ...allEpisodes]; // coloca todos episodeos dentro de uma unica lista 

  const { playList } = usePlayer();
 
  //const { episodeList, currentEpisodeIndex }= useContext(PlayerContext)

  //const episode = episodeList[currentEpisodeIndex]
  
  return (
     <div className={styles.homepage}>

      <Head>
         <title>  Home | Podcastr </title>
      </Head>

        <section className={styles.latestEpisodes}>
             <h2> Last Releases </h2>

             <ul>
                {latestEpisodes.map((episode, index) => {
                  return (
                    <li key={episode.id}>
                        
                        <Image 
                          width={192} 
                          height={192} 
                          src={episode.thumbnail} 
                          alt={episode.title} 
                          objectFit="cover"
                        />

                        <div className={styles.episodeDetails}>
                            <Link href={`/episodes/${episode.id}`}>
                              <a > { episode.title} </a>
                            </Link>
                            
                            <p> {episode.members} </p>
                            <span> {`${episode.publishedAt} Duration: `} </span>
                            <span> {episode.durationAsString} </span>
                        </div>

                        <button type="button" onClick={() => playList(episodeList, index)} >
                          <img src="/play-green.svg" alt="Play episode " />
                        </button>
 
                    </li>                  
                  )
                })}
             </ul>
        </section>

        <section className={styles.allEpisodes}>
              <h2> All Episodeos </h2>

              <table cellSpacing={0}>
                  <thead>
                      <tr>
                        <th>{/*void para imagem  */}</th>
                        <th>Podcast</th>
                        <th>Members</th>
                        <th>Date</th>
                        <th>Duration</th>
                      </tr>
                  </thead>
                  <tbody>
                      {allEpisodes.map((episode, index) => {
                        return (
                            <tr key={episode.id}>
                                <td>
                                    <Image 
                                      width={120}
                                      height={120}
                                      src={episode.thumbnail}
                                      alt={episode.title}
                                      objectFit="cover"                                    
                                    />
                                </td>
                                <td>
                                  <Link href={`/episodes/${episode.id}`}>
                                    <a > {episode.title } </a> 
                              
                                  </Link> 
                                </td>
                                <td> {episode.members} </td>
                                <td> {episode.publishedAt} </td>
                                <td> {episode.durationAsString}</td>
                                <td>
                                  <button type="button" className="buttonPlayy" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                                      <img src="/play-green.svg" alt="Play music" />
                                  </button>
                                </td>
                            </tr>
                        )
                      })}    
                  </tbody>
              </table>
        </section>

     </div>

  )
}

export  const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
     params: {
      _litmit: 12,
      _sort: 'published_at',
      _order: 'desc'
     }
  }) 

 const episodes = data.map(episode => { // verify 
   return {
     id: episode.id,
     title: episode.title, 
     thumbnail: episode.thumbnail, 
     members: episode.members, 
     publishedAt: format(parseISO(episode.published_at ), 'd MMM  yy', {locale: ptBR} ), 
     duration: Number(episode.file.duration),
     durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
     description: episode.description,
     url: episode.file.url, 

   };
  })

    console.log(` aqui esta const {data} => ${data}`)

   const latestEpisodes = episodes.slice(0, 3); // 3 objetos JSON 
   const allEpisodes = episodes.slice(3, episodes.length);

   return {
     props: { // passada autamoticamente para props 
       latestEpisodes,
       allEpisodes,
     },
     revalidate: 60 * 60 * 8,  // importante para nao ficar renderizando toda vez que surgir um novo usuaria em determinada pagina 
   }
} 
            


// a cada 8 horas quando uma pessoa acessar essa pagina, 
// a pessoa vai gerar uma nova versao  dessa pagina
// sera gerado por dia apenas 3 chamadaas sera feitas 
// enquanto houver pessoas acessando nesse intervalo 
/// sera consumido uma pagina estatica 


/* 
Dados devem ser formatados, antes mesmos de chegarem no 
componente para serem renderizados 


*/











