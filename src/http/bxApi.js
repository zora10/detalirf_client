
export const dealAdd = (sendName, sendNumber, code, brand, name, grip, price, count,) => {
    const contactData = {
        fields: {
            NAME: `${sendName}`,
            PHONE: [{ VALUE: `+${sendNumber}`, VALUE_TYPE: 'WORK' }]
        }
    }

    const telegram_api = '7086708799:AAFVV5zVfG1QnMen-Io1EG_mIsFon9EpJ5A';
    const id_tg = '5359516739';
    const sendAPI = `https://api.telegram.org/bot${telegram_api}/sendMessage`
    const texttt = `Заявка с сайта\nИмя : ${sendName}\nНомер : ${sendNumber}\nАртикул : ${code}\nТовар : ${name}\nФирма : ${brand}\nКатегория : ${grip}\nЦена : ${price}\nКоличество : ${count}`
    try {
        const resq = fetch(sendAPI,{
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
    const contactData = {
        fields: {
            NAME: `${sendName}`,
            PHONE: [{ VALUE: `+${sendNumber}`, VALUE_TYPE: 'WORK' }]
        }
    }
    const telegram_api = '7086708799:AAFVV5zVfG1QnMen-Io1EG_mIsFon9EpJ5A';
    const id_tg = '5359516739';
    const sendAPI = `https://api.telegram.org/bot${telegram_api}/sendMessage`
    const texttt = `Заявка с сайта\nИмя : ${sendName}\nНомер : ${sendNumber}`
    try {
        const resq = fetch(sendAPI,{
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
    const contactData = {
        fields: {
            NAME: 'Без имени',
            PHONE: [{ VALUE: `+${sendNumber}`, VALUE_TYPE: 'WORK' }]
        }
    }
    const telegram_api = '7086708799:AAFVV5zVfG1QnMen-Io1EG_mIsFon9EpJ5A';
    const id_tg = '5359516739';
    const sendAPI = `https://api.telegram.org/bot${telegram_api}/sendMessage`
    const texttt = `Заявка с сайта\nИмя : Без Имени\nНомер : ${sendNumber}`
    try {
        const resq = fetch(sendAPI,{
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