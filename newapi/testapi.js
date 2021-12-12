const zeroPad = (num, places) => String(num).padStart(places, '0')

window.onload = function() {
    getTransaction();
};



let getTransaction = function (args) {
    let url = "https://wax.eosphere.io/v2/history/get_actions?account=aulxo.wam&limit=500&sort=desc&transfer.from=m.federation&after=2021-11-30T23:55:00.000Z&before=2021-11-30T23:59:59.999Z" + args;
    return new Promise(function (resolve) {
        https.get(url, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(JSON.parse(data));
            });
        });

    })
};


