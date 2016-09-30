import 'whatwg-fetch';

const endPoint = 'http://localhost:5000';

/**
 * @return {string}
 */
function absoluteUrl(part) {
    return endPoint + part;
}

let access_token;

export function auth(login, password) {

    const options = {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'}),
        body: `username=${login}&password=${password}`,
    };

    return fetch(absoluteUrl('/token'), options)
        .then(checkStatus)
        .then(parseJSON)
        .then(response => {
            access_token = response.access_token;
        });
}


function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error
    }
}

function parseJSON(response) {
    return response.json()
}

function defaultGet(relativeUrl) {

    const options = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        })
    };

    return fetch(absoluteUrl(relativeUrl), options)
        .then(checkStatus)
        .then(parseJSON)
        .catch(error => console.log('request failed', error))
}

export function getTables() {
    return defaultGet('/table')
}

export function initizlizeDatrabaseScheme() {
    return defaultGet('/database')
}

export function getDatabase() {
    return defaultGet('/database')
}

export function getTable(name) {
    return defaultGet('/table/' + name)
}


export function select(table, filter) {
    const params = `?tableName=${table}&` + Object.keys(filter || {}).map(key => `${key}=${filter[key]}`).join('&');
    return defaultGet('/data' + params)
}

export function insert(table, entity) {

    const options = {
        method: "POST",
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }),
        body: JSON.stringify({
            tableName: table.name,
            entity
        })
    };

    return fetch(absoluteUrl('/data'), options)
        .then(checkStatus)
        .then(parseJSON)
        .then(response => response.data)
        .catch(error => console.log('request failed', error))
}

export function update(table, entity) {

    const options = {
        method: "PUT",
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }),
        body: JSON.stringify({
            tableName: table,
            entity
        })
    };

    return fetch(absoluteUrl('/data'), options)
        .then(checkStatus)
        .then(parseJSON)
        .then(response => response.data)
        .catch(error => console.log('request failed', error))
}

export function remove(table, entity) {

    const options = {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }),
        body: JSON.stringify({
            tableName: table.name,
            entity
        })
    };

    return fetch(absoluteUrl('/data'), options)
        .then(checkStatus)
        .then(parseJSON)
        .then(response => response.data)
        .catch(error => console.log('request failed', error))
}
