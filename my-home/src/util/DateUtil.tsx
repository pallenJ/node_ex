import dateFormat from "dateformat";
export const dateFomatArticle = (_date: any, compare = true) => {
    //console.log(dateFormat(_date,'yyyy-mm-dd H:MM:ss')+'/'+ dateFormat(new Date(),'yyyy-mm-dd H:MM:ss'))
    
    if (compare) {
       const timestamp = Date.parse(_date);
       let rsTemp = Date.now() - timestamp;
       const nowDate = new Date();
       if((rsTemp= Math.floor(rsTemp/1000))<60)
            return 'JustNow';
       else if((rsTemp= Math.floor(rsTemp/60))<60)
            return `${rsTemp} ms ago`
       else if((rsTemp= Math.floor(rsTemp/60))<24)
            return `${rsTemp} hs ago`
       else if((rsTemp= Math.floor(rsTemp/24))<7)
            return `${rsTemp} ds ago`
       else if(rsTemp<30)
            return `${Math.floor(rsTemp/7)} wks ago`
       else if(rsTemp<365)
            return `${nowDate.getMonth()=== (_date as Date).getMonth()?12: (nowDate.getMonth()-(_date as Date).getMonth())%12} mons ago`
       else
            return `${nowDate.getFullYear()-(_date as Date).getFullYear()}`
    }
    return dateFormat(Date.parse(_date), 'yyyy-mm-dd H:M:ss');
}