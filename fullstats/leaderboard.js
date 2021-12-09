const zeroPad = (num, places) => String(num).padStart(places, '0')

window.onload = function() {
    run();
};

async function run() {
    let resultField = document.getElementById("resultField");
    resultField.textContent = "Loading...";
    totalmined = 0;
    const from = new Date("2021-12-01T00:00:00Z");
    const to = new Date("2021-12-15T00:00:00Z")
    let results = await downloadData(from, to);
    let usedResultsCnt = 0;

    const curr_event_lbl = document.getElementById("curr_event");
    curr_event_lbl.innerHTML = "Mines are counted in:\n" +
                               from.toISOString().replace('T', ' ').substring(0, 19)  + " UTC" +
                               "  -  " +
                               to.toISOString().replace('T', ' ').substring(0, 19) + " UTC";

    // test for null
    if (results) {
        let minerDict = {};
        let maxSingleMine = {
            miner: "",
            time: new Date('01 Jan 1970 00:00:00 GMT'),
            amount: 0.0
        };

        for (let i = 0; i < results.length; i++) {
            let mined = results[i].bounty / 10000;
            let time = results[i].block_timestamp;
            let miner = results[i].miner;

            totalmined = mined+totalmined;

            if (new Date(time) < from) {
                usedResultsCnt = i + 1;
                break;
            }
           if ("z.uxu.wamooiyo.wamsylhu.wamobpyq.wamgfowi.wamhknz2.wamntjrs.wamttkn2.wamfvaia.wamfqfyq.wamfozy4.wamf.vbg.wamlbjji.wam1aabm.wambd1vw.wamjjhra.wam2o5fi.wamvbbce.wamkzqx2.wamrkmx4.wamq2hu4.wamrzjhy.wamjivj.wamxgmzm.wamksvjg.wamtshwa.wamp1mjg.wampadjk.wamvgvgo.wamderjk.wamdzsba.wam1fucs.wamg1drs.wame5iwc.wamwo5xg.wamaneb2.wam2wqbq.wamvvaxg.wamm11ho.wambl3j2.wamzt.jo.wamfi5zk.wamjtec4.wamkbmb.wamjdhhg.wamvcrx2.wamy4kfg.wammnizi.wamhj3bq.wamk2jh.wamd1wzk.wam5giic.wamphlbq.wami2diy.wam3bcss.wam.vwzi.wamJt1zm.wammlgfq.wamkbyec.wamijlh2.wamfiphe.wamquhrc.wamagirc.wamqx1jo.wamkdbhy.wam35aju.wame1abg.wam".includes(results[i].miner)) {
            // if miner is already in
            if (miner in minerDict) {
                minerDict[miner].mined += mined;
                minerDict[miner].count++;
            } else {
                let struct = {mined: mined, count: 1};
                minerDict[miner] = struct;
            }

            if (maxSingleMine.amount < mined) {
                maxSingleMine.amount = mined;
                maxSingleMine.time = new Date(time);
                maxSingleMine.miner = miner;
            }
        }

        }

        console.log("Total items returned: " + results.length + " from that used: " + usedResultsCnt);
        console.log("Unique miners: " + Object.keys(minerDict).length);

        // create array from dict
        var items = Object.keys(minerDict).map(function(key) {
            return [key, minerDict[key]];
        });

        // sort the array based on the mined sum
        items.sort(function(first, second) {
            return second[1].mined - first[1].mined;
        });

        loadTableData(items);
        
        resultField.textContent =  "Total mined (not just whitelisted): " + totalmined.toFixed(4) + "\n" + "\n" + "Max amount by single mine:" + "\n" +
            maxSingleMine.miner + "\n" +
            maxSingleMine.amount.toFixed(4) + " TLM" + "\n" +
            maxSingleMine.time.toISOString().replace('T', ' ').replace('Z', '') + " UTC" + "\n" +
            "\n\n" +
            "Max sum. mined:" + "\n";
        resultField.textContent += items[0][0] + "\n" +
            items[0][1].mined.toFixed(4) + " TLM" + "\n" +
            "\n\n" +
            "Max mine count:" + "\n";
        // sort the array based on the mine count
        items.sort(function(first, second) {
            return second[1].count - first[1].count;
        });
        resultField.textContent += items[0][0] + "\n" +
            items[0][1].count +
            "\n\n" +
            "--------------------------------------" +
            "\n\n" +
            "Total number of miners:" + "\n" +
            items.length +
            "\n\n" +
            "Total number of mine attempts:" + "\n" +
            usedResultsCnt;
    }

}

function loadTableData(items) {
    const table = document.getElementById("testBody");
    rank = 1;
    items.forEach(item => {
        let row = table.insertRow();
        let cell0 = row.insertCell(0);
        cell0.innerHTML = rank;
        let cell1 = row.insertCell(1);
        cell1.innerHTML = item[0];
        let cell2 = row.insertCell(2);
        cell2.innerHTML = item[1].mined.toFixed(4) + " TLM";
        let cell3 = row.insertCell(3);
        cell3.innerHTML = item[1].count;
        rank++;
    });
}


// from is past, to is future
// we are polling newest to oldest
async function downloadData(from, to) {

    let doPollMore = true;
    let lastPolledGlobSeq = Number.MAX_VALUE;
    let retVal = []; // here comes the json.results

    while (doPollMore) {

        // theoretically we3 are wasting resources to not to define the 'from' parameter for the request
        // because then the full sized poll will be returned (limit)
        // BUT AW has a bug, when the 'from' and 'to' is really near, and there are no action inside that interval
        // the API fails to return anything instead of returning an empty array in the response
        let querry = 'https://api.alienworlds.io/v1/alienworlds/mines?landowner=aulxo.wam' +
            '&sort=desc' +
            '&limit=2000';

        if (lastPolledGlobSeq == Number.MAX_VALUE) {
            // we don't know where we are - use date
            querry += '&to=' + to.toISOString();
        } else {
            // we are polling repeatedly - use global sequence to not to have dupes
            querry += '&global_sequence_to=' + lastPolledGlobSeq;
        }
        console.log(querry);

        await fetch(querry)
            .then(response => response.json())
            .then(json => {
                if (json && json.results && json.results.length > 0) {

                    retVal = retVal.concat(json.results);
                    lastPolledGlobSeq = json.results[json.results.length - 1].global_sequence;

                    if (new Date(json.results[json.results.length - 1].block_timestamp) < from) {
                        doPollMore = false;
                    }
                } else {
                    resultField.textContent = "Alien Wolds API returned wrong answer.\nTry a few seconds later (reload - F5)";
                    return null;
                }
            }).catch(error => {
                resultField.textContent = "ERROR: " + error;
                return null
            });
    }

    return retVal;
}