const zeroPad = (num, places) => String(num).padStart(places, '0')
firstrun = 1;
window.onload = function() {
    run();
  }


async function run() {
    let resultField = document.getElementById("resultField");
    resultField.textContent = "Loading...";
    tokenFloria = 0;
    tokenSap = 0;
    tokenNanore =0;
    tokenVersat =0;
    commission = 0;
    tokenTlm = 0;
    tokenGold = 0;
    tokenShell = 0;
    tokenSlime = 0;
    tokenHpPot = 0;
    tokenBone = 0;
    tokenPelt = 0;
    tokenRbtmeat = 0;
    tokenIrnwood = 0;
    tokenBam = 0;
    console.log(firstrun==1);

// THESE ARE DATES THAT YOU CAN CHANGE
    const from = new Date("2022-01-10T00:00:00.00Z");
    const to = new Date("2022-01-10T23:59:59.59Z");

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
            //commission = results[i].act.data.amount + commission; 
            if ((results[i].act.data.symbol == "FLORIA") && (results[i].act.data.from == "issuer.gr")) {
            tokenFloria = results[i].act.data.amount + tokenFloria; 
            }

            if ((results[i].act.data.symbol == "SAP") && (results[i].act.data.from == "issuer.gr")) {
            tokenSap = results[i].act.data.amount + tokenSap; 
            }

            if ((results[i].act.data.symbol == "NANORE") && (results[i].act.data.from == "issuer.gr")) {
                tokenNanore = results[i].act.data.amount + tokenNanore; 
                console.log(results[i].act.data.amount);
            }

            if ((results[i].act.data.symbol == "VERSAT") && (results[i].act.data.from == "issuer.gr")) {
                tokenVersat = results[i].act.data.amount + tokenVersat; 
            }

            if ((results[i].act.data.symbol == "TLM") && (results[i].act.data.from == "m.federation")) {
                tokenTlm = results[i].act.data.amount + tokenTlm; 
                }
            if ((results[i].act.data.symbol == "GOLD") && (results[i].act.data.from == "unapologetic")){
                tokenGold = results[i].act.data.amount + tokenGold; 
                }

            if ((results[i].act.data.symbol == "SHELL") && (results[i].act.data.from == "unapologetic")) {
                tokenShell = results[i].act.data.amount + tokenShell; 
               }

            if ((results[i].act.data.symbol == "HPPOT")  && (results[i].act.data.from == "unapologetic")) {
                tokenHpPot = results[i].act.data.amount + tokenHpPot; 
               }
            if ((results[i].act.data.symbol == "SLIME")  && (results[i].act.data.from == "unapologetic")) {
                tokenSlime = results[i].act.data.amount + tokenSlime; 
                }
            if ((results[i].act.data.symbol == "PELT")  && (results[i].act.data.from == "unapologetic")) {
                tokenPelt = results[i].act.data.amount + tokenPelt; 
               }

            if ((results[i].act.data.symbol == "IRNWOOD")  && (results[i].act.data.from == "unapologetic")) {
                tokenIrnwood = results[i].act.data.amount + tokenIrnwood; 
            }


            if ((results[i].act.data.symbol == "BONE")  && (results[i].act.data.from == "unapologetic")) {
                tokenBone = results[i].act.data.amount + tokenBone; 
            }

            if ((results[i].act.data.symbol == "RBTMEAT")  && (results[i].act.data.from == "unapologetic")) {
                tokenRbtmeat = results[i].act.data.amount + tokenRbtmeat; 
               }

            if ((results[i].act.data.symbol == "BAM")  && (results[i].act.data.from == "nftpandawofg")) {
                tokenBam = results[i].act.data.amount + tokenBam; 
            }









        }

        resultField.textContent =  "GreenRabbit Total Distribution:" + "\n" + "Total Floria: " + tokenFloria.toFixed(4) + "\n" + "Total SAP: " + tokenSap.toFixed(4) + 
        "\n" + "Total NANORE: " + tokenNanore.toFixed(4) + "\n" + "Total VERSAT: " + tokenVersat.toFixed(4) + "\n" + "\n" + "Alien Worlds Distribution:" + "\n" + 
        "Total TLM: " + tokenTlm.toFixed(4) + "\n" + "\n" + "Blockchain RPG Distribution:" + "\n" + "Total GOLD: " + tokenGold.toFixed(10) + "\n" + "Total Shell: " + tokenShell.toFixed(0)
        + "\n" + "Total HP Potion: " + tokenHpPot.toFixed(0) + "\n" + "Total Slime: " + tokenSlime.toFixed(0) + "\n" + "Total Ironwood: " + tokenIrnwood.toFixed(0) + 
        "\n" + "Total Rabbit Meat: " + tokenRbtmeat.toFixed(0) + "\n" + "Total Bone: " + tokenBone.toFixed(0) +  "\n" +  "Total Pelt: " + tokenPelt.toFixed(0) + "\n" 
        + "\n" + "NFT Panda:" + "\n" + "Total Bamboo: " + tokenBam.toFixed(4) ;

    }
}


async function downloadData(from, to) {

    let doPollMore = true;
    let lastPolledGlobSeq = Number.MAX_VALUE;
    let retVal = []; // here comes the json.results
    let page = 0;
    let pagecount = 0;

    while (doPollMore) {

        //API query CHANGE YOUR WALLET ADDRESS HERE!!----------------------------RIGHT BELOW HERE
        let querry = 'https://wax.eosphere.io/v2/history/get_actions?account=ooiyo.wam' +
        '&sort=desc' + '&after=' + from.toISOString() + '&before=' + to.toISOString() + 
        '&limit=1000' + "&page=" + page;
        
        console.log(querry);
        
        await fetch(querry)
            .then(response => response.json())
            .then(json => {
                if (json && json.actions && json.actions.length > 0) {

                    pagecount = Math.ceil((json.total.value/1000)-1);
                    console.log(pagecount); 
                    //total returned results
                    console.log(json.total.value);
                    //dumping actions into an array
                    retVal = retVal.concat(json.actions);
                    page = page+1;
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