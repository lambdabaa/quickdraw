#!/usr/bin/env python3

from http.client import HTTPSConnection
from PIL import Image
import json
import numpy as np
import os
import urllib

def fetch_gapi(path, cname='www'):
    client = HTTPSConnection('%s.googleapis.com' % cname)
    client.request('GET', path)
    return client.getresponse()

def ensure_download_directory_exists(path):
    if not os.path.exists(path):
        os.makedirs(path)

def list_numpy_objects():
    print('Listing bitmap collections...')
    res = fetch_gapi('/storage/v1/b/quickdraw_dataset/o?prefix=full/numpy_bitmap')
    payload = json.loads(res.read())
    print('Found %d sets!' % len(payload['items']))
    return list(map(lambda item: item['name'], payload['items']))

def format_object_name(object_name):
    return '/'.join(map(urllib.parse.quote, object_name.split('/')))

def fetch_and_convert(object_name, folder='.'):
    print('Fetching drawings named %s...' % object_name)
    filename = object_name.split('/')[-1]
    path = '%s/%s' % (folder, filename)
    if not os.path.exists(path):
        print('Fetching %s...' % object_name)
        res = fetch_gapi(
            '%s/%s' % ('/storage/v1/b/quickdraw_dataset',
            format_object_name(object_name)),
            cname='storage')
        payload = res.read()
        with open(path, 'wb') as f:
            f.write(payload)
    nparray = np.load(path)
    print('Found %d samples...' % len(nparray))
    for idx, item in enumerate(nparray):
        reshaped = np.reshape(item, (28, 28))
        img = Image.fromarray(reshaped)
        img.save(path.replace('.npy', '-%d.jpg' % idx))

def main():
    folder = './images'
    ensure_download_directory_exists(folder)
    object_names = list_numpy_objects()
    for object_name in object_names:
        fetch_and_convert(object_name, folder=folder)

if __name__ == '__main__':
    main()
