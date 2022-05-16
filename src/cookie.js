const axios = require('axios')
const Cookies = require('js-cookie')


export async function checkCookie() {
    let UUID = await Cookies.get('user')
    let response = await axios.post("http://localhost:9000/cookies", {
            UUID: UUID
        })
        .then((data) =>  data.data) 
        .catch((err) => console.error(err));

        return response;
    } 
    

export async function getCookie() {
    let user = Cookies.get('user');
    return user;

}