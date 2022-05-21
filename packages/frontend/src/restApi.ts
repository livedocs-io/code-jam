
function getGraphData(date: Date, apiKey: string) {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:4000", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                ApiKey: `${apiKey}`,
            },
            body: JSON.stringify({
                date,
            }),
        })
        .then((res) => res.json())
        .then((response) => resolve(response))
        .catch((e) => reject(e));
    })
}

function refreshData(date: Date, apiKey: string) {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:4000/refresh", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                ApiKey: `${apiKey}`,
            },
            body: JSON.stringify({
                date,
            }),
        })
        .then((res) => res.json())
        .then((response) => resolve(response))
        .catch((e) => reject(e));
    })
}

function floodData(date: Date, apiKey: string) {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:4000/flood", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                ApiKey: `${apiKey}`,
            },
            body: JSON.stringify({
                date,
            }),
        })
        .then((response) => resolve(response))
        .catch((e) => reject(e));
    })
}

export default {
    getGraphData,
    refreshData,
    floodData
}