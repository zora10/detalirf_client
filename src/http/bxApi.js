
export const dealAdd = (sendName, sendNumber, code, brand, name, grip, price, count,) => {
    

    const telegram_api = '7086708799:AAFVV5zVfG1QnMen-Io1EG_mIsFon9EpJ5A';
    const id_tg = '1449401216';
    const sendAPI = `https://api.telegram.org/bot${telegram_api}/sendMessage`
    const texttt = `Заявка с сайта\nИмя : ${sendName}\nНомер : ${sendNumber}\nАртикул : ${code}\nТовар : ${name}\nФирма : ${brand}\nКатегория : ${grip}\nЦена : ${price}\nКоличество : ${count}`
    try {
        fetch(sendAPI,{
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                chat_id : id_tg,
                text : texttt,
            })
        });
    } catch (error) {
        console.log("denny");
    }
}

export const callAdd = (sendName, sendNumber) => {
    const telegram_api = '7086708799:AAFVV5zVfG1QnMen-Io1EG_mIsFon9EpJ5A';
    const id_tg = '1449401216';
    const sendAPI = `https://api.telegram.org/bot${telegram_api}/sendMessage`
    const texttt = `Заявка с сайта\nИмя : ${sendName}\nНомер : ${sendNumber}`
    try {
        fetch(sendAPI,{
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                chat_id : id_tg,
                text : texttt,
            })
        });
    } catch (error) {
        console.log("denny");
    }
}




export const formAdd = (sendNumber) => {
    
    const telegram_api = '7086708799:AAFVV5zVfG1QnMen-Io1EG_mIsFon9EpJ5A';
    const id_tg = '1449401216';
    const sendAPI = `https://api.telegram.org/bot${telegram_api}/sendMessage`
    const texttt = `Заявка с сайта\nИмя : Без Имени\nНомер : ${sendNumber}`
    try {
        fetch(sendAPI,{
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                chat_id : id_tg,
                text : texttt,
            })
        });
    } catch (error) {
        console.log("denny");
    }
    
}