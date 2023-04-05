const http = require('http');

var i;
var thrAvg=0;
async function doRequest(options, count) {
    return new Promise((resolve, reject) => {
      let req = http.get(options);
      var t1 = new Date().getTime();//ms
      req.on('response', res => {
        // console.log('response: ', count);
        let data = [];
        
        const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
        // console.log('Status Code:', res.statusCode);
        // console.log('Date in Response header:', headerDate);

        res.on('data', chunk => {
            data.push(chunk);
        });

        res.on('end', () => {
            // console.log('Response ended: ');
            var file = 16597841;//B
            var t2 = new Date().getTime();
            var interval = (t2 - t1);
            var thr = file / (interval * 1000);//B/s
            thrAvg = (thrAvg + thr)/(count + 1);
            console.log("thr = " + thr);
            resolve(true);
        });
      });
  
      req.on('error', err => {
        console.log('Error: ', err.message);
        reject(err);
      });
  
      req.end();
    }); 
  }

async function test (){
    for (i = 0; i < 100; i++) {
        // console.log('request: ', i);
        await doRequest('http://10.177.64.117:8080/test-file', i);
        // http.get('http://10.177.64.117:8080/test-file', async res => {
        //     let data = [];
        //     var t1 = new Date().getTime();//ms
        //     const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
        //     console.log('Status Code:', res.statusCode);
        //     console.log('Date in Response header:', headerDate);
    
        //     res.on('data', chunk => {
        //         data.push(chunk);
        //     });
    
        //     res.on('end', () => {
        //         console.log('Response ended: ');
        //         var file = 16597841;//B
        //         var t2 = new Date().getTime();
        //         var interval = (t2 - t1);
        //         var thr = file / (interval * 1000);//B/s
        //         console.log("thr = " + thr);
        //     });
        // }).on('error', err => {
        //     console.log('Error: ', err.message);
        // });
    }
}

test();

