

export default function convertDurationToTimeString(duration: number) {
    const hours = Math.floor(duration/3600) // arredonda para baixo 
    const minutes = Math.floor((duration % 3600) / 60)
    const seconds = (duration / 60).toFixed(2) 

    // duration em segundos 

    const timeString = [hours, minutes, seconds]
            .map(unit => String(unit).padStart(2, '0'))
            .join(':')
    
    return timeString; 
}


// parei em 00:23:46

/*
const finalResult = [hours, minutes, seconds]
            .map(unit => String(unit).padStart(2, '0'))
            .join(':')

essa funcao caso a hora for 1, essa funcao ira por ZERO antes 
para que fique 01 hours e isso sucessivamente para todas as unidades


*/