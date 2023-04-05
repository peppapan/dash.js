import os
import sys
import signal
import subprocess
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
from pyvirtualdisplay import Display
from time import sleep

# TO RUN: download https://pypi.python.org/packages/source/s/selenium/selenium-2.39.0.tar.gz
# run sudo apt-get install python-setuptools
# run sudo apt-get install xvfb
# after untar, run sudo python setup.py install
# follow directions here: https://pypi.python.org/pypi/PyVirtualDisplay to install pyvirtualdisplay

# For chrome, need chrome driver: https://code.google.com/p/selenium/wiki/ChromeDriver
# chromedriver variable should be path to the chromedriver
# the default location for firefox is /usr/bin/firefox and chrome binary is /usr/bin/google-chrome
# if they are at those locations, don't need to specify


def timeout_handler(signum, frame):
	raise Exception("Timeout")

# abr_algo = sys.argv[2]
run_time = 200

abr_algo = 'fastMPC'
# generate url
url = 'file:///home/pwq/dashjs/samples/abr/custom-abr-rules.html'
	
# 	# to not display the page in browser
display = Display(visible=0, size=(800,600))
display.start()

# initialize chrome driver
options = webdriver.ChromeOptions()
options.add_argument('--headless')
# options.add_argument('--user-data-dir=' + chrome_user_dir)
# options.add_argument('--ignore-certificate-errors')
options.add_argument('--disk-cache-size=0')
options.add_argument('--disable-application-cache')
# options.add_argument("--dns-prefetch-disable")
s = Service(r'/home/pwq/chrome/chromedriver')
driver=webdriver.Chrome(service=s, options=options)

print("test")
# run chrome
# driver.set_page_load_timeout(100)
driver.get(url)
print("test")	
sleep(run_time)
driver.quit()
display.stop()
print('done')
	

