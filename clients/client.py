#!/usr/bin/env python3
# -*- coding: utf-8 -*-

URL = "http://175.126.77.146:3001"
USER = "101.202.62.60"
PASSWORD = "wl2q5jll"
INTERVAL = 60 # Update interval


import socket
import time
import json
import collections
import psutil
import requests
import argparse
import os

def login(url, username, password):
    headers = {
        'Content-Type': 'application/json',
    }
    data = {
        'host': username,
        'password': password,
    }
    response = requests.post(url+"/api/connect/login", headers=headers, json=data)
    if response.status_code == 201:
        return response.json()['accessToken'], response.json()['refreshToken']
    else:
        print(response.status_code, response.text)
        return None
    
def refresh(url, token):
    headers = {
        'Content-Type': 'application/json',
    }
    data = {
        'refreshToken': token,
    }
    response = requests.post(url+"/api/connect/refresh-tokens", headers=headers, json=data)
    if response.status_code == 201:
        return response.json()['accessToken'], response.json()['refreshToken']
    else:
        print(response.status_code, response.text)
        return None

def get_uptime():
    return int(time.time() - psutil.boot_time())

def get_memory():
    Mem = psutil.virtual_memory()
    MemUsed = Mem.total - (Mem.cached + Mem.free)
    return int(Mem.total/1024.0), int(MemUsed/1024.0)

def get_swap():
    Mem = psutil.swap_memory()
    return int(Mem.total/1024.0), int(Mem.used/1024.0)

def get_hdd():
    valid_fs = ["ext4", "ext3", "ext2", "reiserfs", "jfs", "btrfs", "fuseblk", "zfs", "simfs", "ntfs", "fat32", "exfat", "xfs"]
    disks = {}
    size = 0
    used = 0
    for disk in psutil.disk_partitions():
        if disk.device not in disks and disk.fstype.lower() in valid_fs:
            disks[disk.device] = disk.mountpoint
    for disk in disks.values():
        usage = psutil.disk_usage(disk)
        size += usage.total
        used += usage.used
    return int(size/1024.0/1024.0), int(used/1024.0/1024.0)

def get_load():
    try:
        return os.getloadavg()[0]
    except:
        return -1.0

def get_cpu():
    return psutil.cpu_percent(interval=INTERVAL)

class Traffic:
    def __init__(self):
        self.rx = collections.deque(maxlen=10)
        self.tx = collections.deque(maxlen=10)
    def get(self):
        avgrx = 0; avgtx = 0
        for name, stats in psutil.net_io_counters(pernic=True).items():
            if name == "lo" or "tun" in name:
                continue
            avgrx += stats.bytes_recv
            avgtx += stats.bytes_sent

        self.rx.append(avgrx)
        self.tx.append(avgtx)
        avgrx = 0; avgtx = 0

        l = len(self.rx)
        for x in range(l - 1):
            avgrx += self.rx[x+1] - self.rx[x]
            avgtx += self.tx[x+1] - self.tx[x]

        avgrx = int(avgrx / l / INTERVAL)
        avgtx = int(avgtx / l / INTERVAL)

        return avgrx, avgtx

def get_network(ip_version):
    if ip_version == 4:
        HOST = "ipv4.google.com"
    elif ip_version == 6:
        HOST = "ipv6.google.com"
    try:
        s = socket.create_connection((HOST, 80), 2)
        return True
    except:
        return False

if __name__ == '__main__':
    # argparse settings
    parser = argparse.ArgumentParser()
    parser.add_argument("-s", "--server", help="Server URL", type=str)
    parser.add_argument("-u", "--user", help="Username", type=str)
    parser.add_argument("-p", "--password", help="Password", type=str)
    parser.add_argument("-i", "--interval", help="Update interval", type=int)
    args = parser.parse_args()
    if args.server:
        URL = args.server
    if args.user:
        USER = args.user
    if args.password:
        PASSWORD = args.password
    if args.interval:
        INTERVAL = args.interval

    # http settings
    requests.packages.urllib3.disable_warnings()
    requests.adapters.DEFAULT_RETRIES = 3

    # login
    token = login(URL, USER, PASSWORD)
    if not token:
        print("Login failed")
        exit()

    print(token)
    
    while True:
        try:
            traffic = Traffic()
            traffic.get()
            while True:
                timer = 0
                CPU = get_cpu()
                NetRx, NetTx = traffic.get()
                Uptime = get_uptime()
                Load = get_load()
                MemoryTotal, MemoryUsed = get_memory()
                SwapTotal, SwapUsed = get_swap()
                HDDTotal, HDDUsed = get_hdd()

                array = {}
                if not timer:
                    timer = 10
                else:
                    timer -= 1*INTERVAL

                array['uptime'] = Uptime
                array['load'] = Load
                array['memory_total'] = MemoryTotal
                array['memory_used'] = MemoryUsed
                array['swap_total'] = SwapTotal
                array['swap_used'] = SwapUsed
                array['hdd_total'] = HDDTotal
                array['hdd_used'] = HDDUsed
                array['cpu'] = CPU
                array['network_rx'] = NetRx
                array['network_tx'] = NetTx
                array['custom'] = ""

                print(array)

                headers = {
                    'Content-Type': 'application/json',
                }
                headers['Authorization'] = 'Bearer ' + token[0]

                response = requests.post(URL+"/api/datas", headers=headers, json=array)
                if response.status_code == 201:
                    print(response.text)
                else:
                    print(response.status_code, response.text, "Refresh token")
                    token = refresh(URL, token[1])
                    print("token: ", token)
                    if not token:
                        print("Refresh failed")
                        exit()
                    headers['Authorization'] = 'Bearer ' + token[0]
                    response = requests.post(URL+"/api/datas", headers=headers, json=array)
                    if response.status_code == 201:
                        print(response.text)
                    else:
                        print(response.status_code, response.text)
                        print("Update failed")
                        exit()
        except KeyboardInterrupt:
            raise
        except Exception as e:
            print("Caught Exception:", e)
            time.sleep(3)

