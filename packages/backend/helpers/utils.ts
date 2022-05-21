// this set of method contains the information 
// about querrying and organising data for the network calls.

import db from "../src/setup.db";
import api from './api';

const QUERIES = {
    weeks_data: (id: string, dates: Array<string>) => `SELECT * FROM records WHERE fusionid="${id}" AND date IN ("${dates.join('","')}") ORDER BY date;`,
    update_record: (id: string, date: string, value: number) => `UPDATE records SET value=${value} WHERE fusionid="${id}" AND date="${date}";`,
    key_exists: (id: string, date: string) => `SELECT EXISTS(SELECT 1 FROM records WHERE fusionid="${id}" AND date="${date}");`,
    insert_record: (id: string, date: string, value: number) => `INSERT INTO records(fusionid, date, value) VALUES("${id}", "${date}", ${value});`,
    create_user: (id: string, date: string) => `INSERT INTO users(id, date, rate_limit) VALUES("${id}", "${date}", 10);`,
    update_user: (id: string, date: string, limit: number) => `UPDATE users SET rate_limit=${limit}, date="${date}" WHERE id="${id}";`,
    get_user: (id: string) => `SELECT * FROM users WHERE id="${id}";`,
    all_records: `SELECT * FROM records;`,
    all_users: `SELECT * FROM users;`
    // reset_user: (id: string, date: string) =>  `UPDATE users SET date=${date}, limit=10 WHERE id="${id}";`,
}

function constructResonse(db: any, apiKey: string, stockId: string, date: string){
    let fusionid = `${apiKey}::${stockId}`
    let dates = getDateArray(date);
    let query = QUERIES['weeks_data'](fusionid, dates);

    // dates.forEach((date) => {
    //     db.run(QUERIES['insert_record'](fusionid, date, getRandomInt(100)), errorCallback)
    // })

    interface Records {
        fusionid: string,
        date: string,
        value: number
    }

    return new Promise((resolve, reject) => {
        db.all(query, (err: any, rows: Array<Records>) => {
            if (err) {
              reject(err);
            } else {
                let response: any = [], 
                temp: any = {};
                rows.forEach((row) => {
                    temp[row.date] = row.value;
                })
                dates.forEach((date) => {
                    response.push({
                        name: date,
                        uv: temp[date] ?? 0
                    })
                })
                response = response.reverse()
                resolve(response);
            }
        });
    })
}

function updateRecords(db: any, apiKey: string, stockId: string, dt: string, stockValue: number) {
    const fusionid = `${apiKey}::${stockId}`
    let date = getDateString(dt);
    console.log(fusionid, date)
    return new Promise<void>((resolve, reject) => {
        db.get(QUERIES['key_exists'](fusionid, date), (err: any, res: any) => {
            if(err) {
                console.log(err)
            } else {
                console.log(Object.values(res)[0]);
                if(Object.values(res)[0]){
                    db.run(QUERIES['update_record'](fusionid, date, stockValue), (err: any) => {
                        if (err) {
                            console.log(err);
                            reject();
                        }
                        resolve();
                    })
                } else {
                    db.run(QUERIES['insert_record'](fusionid, date, stockValue), (err: any) => {
                        if (err) {
                            console.log(err);
                            reject();
                        }
                        resolve();
                    })
                }
            }
        })
    })
}

function createUser(db: any, apikey: string) {
    let date = new Date().toISOString().split("T")[0];
    let query = QUERIES['create_user'](apikey, date);
    return new Promise<void>((resolve, reject) => {
        db.run(query, (err: any) => {
            if(err) reject(err);
            resolve();
        })
    })
}

function getUser(db: any, apikey: string) {
    return new Promise((resolve, reject) => {
        db.get(QUERIES['get_user'](apikey), (err: any, result: any) => {
            if(err) reject(err);
            resolve(result);
        })
    })
}

function updateUser(db: any, user: any) {
    let date = new Date().toISOString().split("T")[0];
    let apikey = user.id;
    let query: string;
    if(user.date == date){
        query = QUERIES['update_user'](apikey, date, user.rate_limit - 1)
    } else {
        query = QUERIES['update_user'](apikey, date, 9)
    }
    db.run(query, (err: any) => {
        if(err) console.log(err);
    })
}


function floodDb(apikey: string, date: string, stockId: string){
    let fusionid = `${apikey}::${stockId}`
    let dates = getLast30Dates(date);
    dates.forEach((dt) => {
        let randomValue = getRandomInt(100);
        db.run(QUERIES['insert_record'](fusionid, dt, randomValue), (err) => {})
    })
}

/**
 * 
 * Some Utility Functions down here...
 */

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max + 10);
}

function errorCallback(err: any) {
    if (err) {
        console.log("Error Occured", err);
    }
}

function getLast30Dates(date: string){
    let d: Date = new Date(date);
    let dates: Array<string> = [];
    for(let i=1; i < 30; i++){
        let temp = new Date();
        temp.setDate(d.getDate() - i);
        dates.push(temp.toISOString().split("T")[0]);
    }
    return dates;
}

function getDateArray(date: string) {
    let d: Date = new Date(date);
    let dates: Array<string> = [];
    let temp = [-3, -2, -1, 0, 1, 2, 3]
    temp.forEach((n) => {
        let temp = new Date();
        temp.setDate(d.getDate() - n);
        dates.push(temp.toISOString().split("T")[0]);
        return;
    })
    return dates;
}

function getDateString(date: string){
    let d = new Date(date);
    return d.toISOString().split("T")[0];
}

export default {
    constructResonse,
    updateRecords,
    getDateArray,
    getDateString,
    createUser,
    updateUser,
    getUser,
    floodDb,
}
