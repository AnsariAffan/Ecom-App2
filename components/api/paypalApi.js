import axios from 'axios';

let baseUrl = "https://api-m.sandbox.paypal.com";
const base64 = require('base-64');

let clientId = 'Adid4BLWYFKUbifiZywRifn381twtPLPECBFjijiWMV2a6911lbnhetHvZQvrr2VW912HQomm-fg2qGo';
let secretKey = 'EM6UXQPSZGVn4lBPpNTEO1K4WEER21t6sJXibVV0uF8uEK_AzlzazYadfvjRKFOuT6u0z9dckT5dDqxo';

const generateToken = () => {
    
    var headers = new Headers()
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Authorization", "Basic " + base64.encode(`${clientId}:${secretKey}`));

    var requestOptions = {
        method: 'POST',
        headers: headers,
        body: 'grant_type=client_credentials',
    };

    return new Promise((resolve, reject) => {

        fetch(baseUrl + '/v1/oauth2/token', requestOptions).then(response => response.text()).then(result => {
            console.log(result)
            const { access_token } = JSON.parse(result)
            console.log("result print", access_token)
            resolve(access_token)
        }).catch(error => {
            console.log("error raised", error)
            reject(error)
        })
    })

}


export default {
    generateToken,
}

