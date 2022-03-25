import calendar
import csv
import datetime
import json
import os
import random
import sys
import time
from pathlib import Path
from typing import Literal

import requests
import yaml




def main():
    wallet_actions = {}
    # Begin transaction loop
    aggregated_actions = []
    print(f"Starting")
    scans = 0
    retries = 0
    actions = []
   
    # NOTE: limit is 1000 to match standard ratelimits across API endpoints
    while True:
        #sets params for API Call
        params = {
            "landowner": "lbjji.wam",
            "after": "start",
            "before": "END_DATE",
            "limit": 1000,                    
        }

        actions_call = requests.get("https://api.alienworlds.io/v1/alienworlds/mines", params=params)
        try:
            new = json.loads(actions_call.content)
            new["actions"]
        except:
            if retries >= 3:
                print("Maximum retries reached.")
                exit(1)
            # print(actions_call.content)
            # print(actions_call.url)
            retries += 1
            print("ERROR DOWNLOADING DATA: , trying again")
            time.sleep(5)
            continue
        actions.extend(new["actions"])
        if len(new["actions"]) < params["limit"]:
            break
        start = new["actions"][-1]["timestamp"]
        # delay to respect variable ratelimits between endpoints
        time.sleep(5)
        continue
    filtered = []
    # remove duplicate actions
    for action in actions:
        if action not in filtered:
            filtered.append(action)
    if len(filtered)!=0:    
        print(f"actions found, ending at {filtered[-1]['timestamp']}")
        aggregated_actions.extend(filtered)
    else:
        print("No actions found between")
    aggregated_action_filter = {f"{a['trx_id']}_{a['action_ordinal']}":a for a in sorted(aggregated_actions,key=lambda x: x["timestamp"])}
    wallet_actions[0] = [aggregated_action_filter[trx] for trx in aggregated_action_filter]
    print("Action record fetch from blockchain complete. Exporting records now (if applicable)....")


  