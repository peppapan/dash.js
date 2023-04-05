#!/usr/bin/env python
# -- coding: utf-8 --**
from http.server import BaseHTTPRequestHandler,HTTPServer
import socketserver
import base64
import urllib
import sys
import os
import json
import time
os.environ['CUDA_VISIBLE_DEVICES']=''

import numpy as np
import time
import itertools

RunTIME = 0

def make_request_handler():

    class Request_Handler(BaseHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
        
            
            BaseHTTPRequestHandler.__init__(self, *args, **kwargs)

        def do_POST(self):
            content_length = int(self.headers['Content-Length'])
            post_data = json.loads(self.rfile.read(content_length))
            print(post_data)
            global RunTIME

            if RunTIME == 0 and os.path.exists('data.json'):
                os.remove('data.json')
                print("test")
                temp={}
                temp[0] = post_data
                with open('data.json','w') as f:
                    json.dump(temp, f)
            else:
                with open('data.json','r') as f:
                    data = json.load(f)
                    data[len(data)] = post_data
                    
                with open('data.json','w') as f:
                    json.dump(data, f)

            RunTIME += 1
            send_data = str(1)
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.send_header('Content-Length', len(send_data))
            self.send_header('Access-Control-Allow-Origin', "*")
            self.end_headers()
            self.wfile.write(send_data.encode())


        def do_GET(self):
            print >> sys.stderr, 'GOT REQ'
            self.send_response(200)
            #self.send_header('Cache-Control', 'Cache-Control: no-cache, no-store, must-revalidate max-age=0')
            self.send_header('Cache-Control', 'max-age=3000')
            self.send_header('Content-Length', 20)
            self.end_headers()
            self.wfile.write("console.log('here');")

        def log_message(self, format, *args):
            return

    return Request_Handler


def run(server_class=HTTPServer, port=8333):

        # interface to abr_rl server
    handler_class = make_request_handler()

    server_address = ('localhost', port)
    httpd = server_class(server_address, handler_class)
    print('Listening on port ' + str(port))
    httpd.serve_forever()


def main():
    run()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("Keyboard interrupted.")
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)

