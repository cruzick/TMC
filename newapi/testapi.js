const zeroPad = (num, places) => String(num).padStart(places, '0')
firstrun = 1;
window.onload = function() {
    run();
  }


async function run() {
    let resultField = document.getElementById("resultField");
    resultField.textContent = "Loading...";
    
    commission = 0;
    console.log(firstrun==1);
    const from = new Date("2022-03-13T00:00:00.00Z");
    const to = new Date("2022-03-13T23:59:59.00Z");

    if(firstrun==1){
        firstrun=0;        
    } else {
        console.log(document.getElementById("dateBegin"));
        from.setDate(document.getElementById("dateBegin"));
        console.log(from);
        to.setDate(from.getDate(from +1));
    } 
    let results = await downloadData(from,to);

    const curr_event_lbl = document.getElementById("curr_event");
    curr_event_lbl.innerHTML = "Current Time-Span" +
                               from.toISOString().replace('T', ' ').substring(0, 19)  + " UTC" +
                               "  -  " +
                               to.toISOString().replace('T', ' ').substring(0, 19) + " UTC";

    // test for null
    if (results) {
        for (let i = 0; i < results.length; i++)   {        
            //adds up commission
            commission = results[i].act.data.amount + commission;
            //console.log(results[i].act.data.amount + " " + i + " " + results[i].timestamp);
        }

        resultField.textContent =  "Total Commission: " + commission.toFixed(4);

    }
}


async function downloadData(from, to) {

    let doPollMore = true;
    let lastPolledGlobSeq = Number.MAX_VALUE;
    let retVal = []; // here comes the json.results
    let page = 1;
    let pagecount = 0;

    while (doPollMore) {

        //API query
        let querry = 'https://api.waxsweden.org:443/v2/history/get_actions?account=lbjji.wam&transfer.from=m.federation&memo=ALIEN WORLDS - Mined Trilium Profit Share' + '&limit=1000' + "&page=" + page +        '&sort=desc' + '&after=' + from.toISOString() + '&before=' + to.toISOString();
        
        console.log(querry);
        
        await fetch(querry)
            .then(response => response.json())
            .then(json => {
                if (json && json.actions && json.actions.length > 0) {

                    pagecount = Math.ceil((json.total.value/1000) -1 );
                
                    retVal = retVal.concat(json.actions);
                    console.log(retVal)
                    page = page + 1;
                    if (json.total.value/1000 <1) {
                        doPollMore = false;
                    }
                    if (page==pagecount) {
                        doPollMore = false;
                    }
                    //Loop Killer (END OF RESULTS)
                    if (new Date(json.actions[json.actions.length - 1].timestamp + "Z") < from) {
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