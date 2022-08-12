import styles from './styles.module.scss'
import { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext, usePlayer } from '../../contexts/PLayerContext';
import Slider from 'rc-slider';


import 'rc-slider/assets/index.css' // estilizacao padrao do rc-slider
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';



export default function Player() {

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying,
        isShuffling,
        togglePlay,
        setPlayingState, 
        playNext, 
        playPrevious,
        hasNext,
        hasPrevious, 
        isLooping,
        toggleLoop,
        toggleShuffle,
        clearPlayerState,
    
    } = usePlayer()
    const episode = episodeList[currentEpisodeIndex]
    const audioReferencia = useRef<HTMLAudioElement>(null); // referencia para ler elemetos HTML
    // audioReferencia -> como se fosse o document.querySelectorAll(x) ou getElementebtyETC...
    
    /* 
        Efeitos colaterais no react e: quando alguma coisa muda, 
        algo eh executado, ou seja, sideEffects -> useEffect
    */

    const [progress, setProgress] = useState(0);
        
    useEffect(() => {
        if(!audioReferencia.current) return

        if(isPlaying) {
            audioReferencia.current.play();
        } else {
            audioReferencia.current.pause();
        }

    }, [isPlaying])

    function setupProgressListener() {
        audioReferencia.current.currentTime = 0;

        audioReferencia.current.addEventListener('timeupdate', () => {
            // timeupdate -> disparado varias vezes enquanto o audio esta tocando 
            setProgress(Math.floor(audioReferencia.current.currentTime));
        });
    }

    function handleSeek(amount: number) {
        audioReferencia.current.currentTime = amount;
        setProgress(amount)
    }

    function handleEpisodeEnded() {
        if(hasNext) {
            playNext()
        } else {
            clearPlayerState()
        }
    }

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong> Playing now   </strong>
            </header>              
    
            <div className={styles.emptyPlayer}>
                    { episodeList[currentEpisodeIndex] ?  
                                       
                        (
                            <div>
                                <img src={episode?.thumbnail} alt="image do podcast"    /> 
                                <strong className={styles.titulo}> {episode.title} </strong>
                                <span> {episode.members} </span>  
                            </div>
                                 
                        )
                        : (
                            <div>
                                <strong> Select a podcasto to listen </strong>
                                  
                            </div>
                        )
                        
                    } 
            </div>


            <footer className={!episode ?  styles.empty : ''}>
                <div className={styles.progress}>
                    <span className={styles.timer}> {convertDurationToTimeString(progress)} </span>
                    <div className={styles.slider}>
                        { episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{backgroundColor: '#b35700'}}
                                handleStyle={{borderColor: '#b35700'}}
                            />
                        ) : 
                            (<div className={styles.emptySlider} />)
                        }
                    </div>
                    <span className={styles.timer}> {convertDurationToTimeString(episode?.duration ?? 0)}</span>
                    
                </div>

               {
                    episode ? 
                    (
                        <audio src={episode.url} 
                         autoPlay
                         ref={audioReferencia}
                         loop={isLooping}
                         onPlay={() => setPlayingState(true)}
                         onPause={() => setPlayingState(false)}
                         onLoadedMetadata={setupProgressListener}
                         onEnded={handleEpisodeEnded}
                                   
                        />
                    ) : 
                    (<p>{/*void*/}</p> )

               }
                <div className={styles.buttons}>
                    <button 
                        type="button" 
                        disabled={!episode}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                            <img src="/shuffle.svg" alt="change" />
                    </button>
                    <button type="button" disabled={!episode || !hasNext}  onClick={playNext}>
                            <img src="/play-previous.svg" alt="play Next" />
                    </button>
                    <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay} >
                            { isPlaying ? <img src="/pause.svg" alt="play" /> : 
                                          <img src="/play.svg" alt="play" />}
                    </button>
                    <button type="button"  disabled={!episode || !hasPrevious} onClick={playPrevious}>
                            <img src="/play-next.svg" alt="Play Previous"  />
                    </button>
                    <button 
                        type="button" 
                        className={isLooping ?  styles.repeat : ''}  
                        disabled={!episode || episodeList.length === 1}
                        onClick={toggleLoop}
                    >
                            <img src="/repeat.svg" alt="repeat" />
                    </button>
                </div>
            </footer>
        </div>
    );
}


