import 'whatwg-fetch';

const endPoint = 'http://localhost:5000'

/**
 * @return {string}
 */
function absoluteUrl(part) {
    return endPoint + part;
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
    return fetch(absoluteUrl(relativeUrl))
        .then(checkStatus)
        .then(parseJSON)
        .then(json => {
            // console.log('parsed json', json);
            return json;
        })
        // .then(response => response)
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


export function select(table, filter=[]) {
    const params = `?tableName=${table}` + Object.keys(filter).map(key => `${key}:${params[key]}`).join('&');
    return defaultGet('/data' + params)
}

export function insert(table, entity) {
    const payload = {
        tableName: table.name,
        entity
    };

    return fetch(absoluteUrl('/data'), {
            method: "POST",
            body: JSON.stringify(payload)
        })
        .then(checkStatus)
        .then(parseJSON)
        .then(response => response.data)
        .catch(error => console.log('request failed', error))
}

export function update(table, entity) {

    const payload = {
        tableName: table.name,
        entity
    };

    return fetch(absoluteUrl('/data'), {
            method: "PUT",
            body: JSON.stringify(payload)
        })
        .then(checkStatus)
        .then(parseJSON)
        .then(response => response.data)
        .catch(error => console.log('request failed', error))
}

export function remove(table, entity) {

    const payload = {
        tableName: table.name,
        entity
    };

    return fetch(absoluteUrl('/data'), {
            method: 'DELETE',
            body: JSON.stringify(payload)
        })
        .then(checkStatus)
        .then(parseJSON)
        .then(response => response.data)
        .catch(error => console.log('request failed', error))
}
