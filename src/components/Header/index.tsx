import styles from './styles.module.scss';
import Link from 'next/link';

export default function Header() {
    
    
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed) 
    function dataAtual() {
        return today.toDateString();
    }


    return (

        <header className={styles.headerContainer}>
            <Link href={'/'}>
                <img src="/logo.svg" alt="Logo da Podcastr"/>
                
            </Link>
            <p> Listen your heart and enjoy de the song </p> 
            <span> {dataAtual()} </span>
        </header>
    ); 
}

/*

no next -> onde tem pages... serao rotas
// e consequentemente tudo que esta na pasta puclic, eh publico 

*/ 