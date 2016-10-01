import 'whatwg-fetch';

const endPoint = 'http://localhost:5000';

/**
 * @return {string}
 */
function absoluteUrl(part) {
    return endPoint + part;
}

export const auth = {

    access_token: undefined,

    authenticated() {
        return Boolean(auth.access_token);
    },

    authorized() {
        return Boolean(auth.access_token);
    },

    login(login, password) {
        const options = {
            method: 'POST',
            headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'}),
            body: `username=${login}&password=${password}`,
        };

        return fetch(absoluteUrl('/token'), options)
            .then(checkStatus)
            .then(parseJSON)
            .then(response => {
                auth.access_token = response.access_token;
                localStorage.token = auth.access_token;
            });
    },

    logout() {
        auth.access_token = undefined;
        localStorage.removeItem('token');
    }
};

auth.access_token = localStorage.token;



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
            'Authorization': `Bearer ${auth.access_token}`
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
            'Authorization': `Bearer ${auth.access_token}`
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
            'Authorization': `Bearer ${auth.access_token}`
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
            'Authorization': `Bearer ${auth.access_token}`
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
