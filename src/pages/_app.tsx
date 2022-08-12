
import Header from '../components/Header';
import '../styles/globals.scss'
import styles from '../styles/app.module.scss';
import Player from '../components/Player';
import { PlayerContext } from '../contexts/PLayerContext';
import { useState } from 'react';
import { PlayerContextProvider } from '../contexts/PLayerContext'  


function MyApp({ Component, pageProps }) {

  
  return (
      <PlayerContextProvider> 
        <div className={styles.appWrapper}>
          <main>
            <Header/>
            <Component {...pageProps} /> 
          </main>
          <Player />
        </div>
      </PlayerContextProvider>  
      
    );
}
 
export default MyApp




