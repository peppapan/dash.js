/**
 * The copyright in this software is being made available under the BSD License,
 * included below. This software may be subject to other third party and contributor
 * rights, including patent rights, and no such rights are granted under this license.
 *
 * Copyright (c) 2013, Dash Industry Forum.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation and/or
 *  other materials provided with the distribution.
 *  * Neither the name of Dash Industry Forum nor the names of its
 *  contributors may be used to endorse or promote products derived from this software
 *  without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 *  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 *  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 */

var LowestBitrateRule;

// Rule that selects the lowest possible bitrate
function LowestBitrateRuleClass() {

    let factory = dashjs.FactoryMaker;
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let MetricsModel = factory.getSingletonFactoryByName('MetricsModel');
    let StreamController = factory.getSingletonFactoryByName('StreamController');
    let context = this.context;
    let instance;
    let a = 0;
    /**************************************************************************************** */
    var MPC_FUTURE_CHUNK_COUNT = 5;
    var VIDEO_BIT_RATE = [300, 750, 1200, 1850, 2850, 4300];//kb/s
    var BITRATE_REWARD = [1, 3, 5, 7, 10, 15];
    let M_IN_K = 1000.0;
    let QoE = 0;
    let ThrSTATE = [0, 0, 0, 0, 0];
    let TOTAL_VIDEO_CHUNKS = 48;

    let size_video = [[2354772, 2123065, 2177073, 2160877, 2233056, 1941625, 2157535, 2290172, 2055469, 2169201, 2173522, 2102452, 2209463, 2275376, 2005399, 2152483, 2289689, 2059512, 2220726, 2156729, 2039773, 2176469, 2221506, 2044075, 2186790, 2105231, 2395588, 1972048, 2134614, 2164140, 2113193, 2147852, 2191074, 2286761, 2307787, 2143948, 1919781, 2147467, 2133870, 2146120, 2108491, 2184571, 2121928, 2219102, 2124950, 2246506, 1961140, 2155012, 1433658],
    [1728879, 1431809, 1300868, 1520281, 1472558, 1224260, 1388403, 1638769, 1348011, 1429765, 1354548, 1519951, 1422919, 1578343, 1231445, 1471065, 1491626, 1358801, 1537156, 1336050, 1415116, 1468126, 1505760, 1323990, 1383735, 1480464, 1547572, 1141971, 1498470, 1561263, 1341201, 1497683, 1358081, 1587293, 1492672, 1439896, 1139291, 1499009, 1427478, 1402287, 1339500, 1527299, 1343002, 1587250, 1464921, 1483527, 1231456, 1364537, 889412],
    [1034108, 957685, 877771, 933276, 996749, 801058, 905515, 1060487, 852833, 913888, 939819, 917428, 946851, 1036454, 821631, 923170, 966699, 885714, 987708, 923755, 891604, 955231, 968026, 874175, 897976, 905935, 1076599, 758197, 972798, 975811, 873429, 954453, 885062, 1035329, 1026056, 943942, 728962, 938587, 908665, 930577, 858450, 1025005, 886255, 973972, 958994, 982064, 830730, 846370, 598850],
    [668286, 611087, 571051, 617681, 652874, 520315, 561791, 709534, 584846, 560821, 607410, 594078, 624282, 687371, 526950, 587876, 617242, 581493, 639204, 586839, 601738, 616206, 656471, 536667, 587236, 590335, 696376, 487160, 622896, 641447, 570392, 620283, 584349, 670129, 690253, 598727, 487812, 575591, 605884, 587506, 566904, 641452, 599477, 634861, 630203, 638661, 538612, 550906, 391450],
    [450283, 398865, 350812, 382355, 411561, 318564, 352642, 437162, 374758, 362795, 353220, 405134, 386351, 434409, 337059, 366214, 360831, 372963, 405596, 350713, 386472, 399894, 401853, 343800, 359903, 379700, 425781, 277716, 400396, 400508, 358218, 400322, 369834, 412837, 401088, 365161, 321064, 361565, 378327, 390680, 345516, 384505, 372093, 438281, 398987, 393804, 331053, 314107, 255954],
    [181801, 155580, 139857, 155432, 163442, 126289, 153295, 173849, 150710, 139105, 141840, 156148, 160746, 179801, 140051, 138313, 143509, 150616, 165384, 140881, 157671, 157812, 163927, 137654, 146754, 153938, 181901, 111155, 153605, 149029, 157421, 157488, 143881, 163444, 179328, 159914, 131610, 124011, 144254, 149991, 147968, 161857, 145210, 172312, 167025, 160064, 137507, 118421, 112270]]

    function get_chunk_size(quality, index) {
        if (index < 0 || index > 48)
            return 0
        return size_video[5 - quality][index];
    }

    function roll(a, b) {
        if (a === undefined) {
            a = [0, 0, 0, 0, 0];
        }
        a.splice(0, 1);
        a = [...a, b];
        return a
    }

    function copy(a) {
        return a.slice();
    }

    function predict(a) {
        let result = 0;
        let count = 0;
        for (const aa of a) {
            if (aa) {
                count++;
                result += 1 / aa;
            }
        }
        if (result === 0) {
            return 0;
        }
        return count / result;
    }

    function combo(max) {
        let result = [];
        for (let i = 0; i < max; i++) {
            for (let j = 0; j < max; j++) {
                for (let k = 0; k < max; k++) {
                    for (let l = 0; l < max; l++) {
                        for (let m = 0; m < max; m++) {
                            result.push([i, j, k, l, m]);
                        }
                    }
                }
            }
        }
        return result;
    }

    function search(input/** [][] */, future_chunk_length /** number */, lastquality /** number */, startBuffer /** */, last_index, future_bandwidth) {
        let max_reward = -100000000
        let best_combo = []
        for (const i of input) {
            let combo = i.slice(0, future_chunk_length);
            let curr_rebuffer_time = 0
            let curr_buffer = startBuffer
            let bitrate_sum = 0
            let smoothness_diffs = 0
            let last_quality = lastquality
            for (let position = 0; position < combo.length; position++) {
                let chunk_quality = combo[position]
                let index = last_index + position + 1
                let download_time = (get_chunk_size(chunk_quality, index) / 1000000) / future_bandwidth
                if (curr_buffer < download_time) {
                    curr_rebuffer_time += (download_time - curr_buffer);
                    curr_buffer = 0;
                } else {
                    curr_buffer -= download_time;
                }
                curr_buffer += 4;
                bitrate_sum += BITRATE_REWARD[chunk_quality]
                smoothness_diffs += Math.abs(BITRATE_REWARD[chunk_quality] - BITRATE_REWARD[last_quality])
                last_quality = chunk_quality
            }
            let reward = bitrate_sum - (8 * curr_rebuffer_time) - (smoothness_diffs)

            if (reward > max_reward) {
                max_reward = reward
                best_combo = combo
            }
        }
    if (best_combo.length) {
        return best_combo[0]
    } else {
        return undefined
    }
    }

    function MPC(lastquality, buffer, throughput, actualLength) {

        ThrSTATE = roll(ThrSTATE, throughput);
        let past_bandwidths = copy(ThrSTATE);
        let future_bandwidth = predict(past_bandwidths);
        let last_index = actualLength;
        let future_chunk_length = 5;
        if (TOTAL_VIDEO_CHUNKS - last_index < 4)
            future_chunk_length = TOTAL_VIDEO_CHUNKS - last_index;

        let quality = search(combo(6), future_chunk_length, lastquality, buffer, last_index, future_bandwidth);

        if (quality !== undefined) {
            // console.log("quality = " + quality)
            return quality;
        } else {
            // console.log("undefined");
            return 0;
        }
    }
    /****************************************************************************************/
    function setup() {
    }


    // Always use lowest bitrate
    function getMaxIndex(rulesContext) {
        // here you can get some informations aboit metrics for example, to implement the rule
        a++;
        // console.log("a="+a);
        let metricsModel = MetricsModel(context).getInstance();
        var mediaType = rulesContext.getMediaInfo().type;

        var metrics = metricsModel.getMetricsFor(mediaType, true);

        /***************************transmissionTime********************************/
        if (!metrics) {
            return null;
        }

        const httpList = metrics.HttpList;
        let currentHttpList = null;

        let httpListLastIndex;

        if (!httpList || httpList.length <= 0) {
            return null;
        }

        httpListLastIndex = httpList.length - 1;

        while (httpListLastIndex >= 0) {
            if (httpList[httpListLastIndex].responsecode) {
                currentHttpList = httpList[httpListLastIndex];
                break;
            }
            httpListLastIndex--;
        }
        let i = 0;
        let actualLength = 0;

        for (i = 0; i < httpList.length; i++) {
            if (httpList[i].type == 'MediaSegment') {
                actualLength++;
            }
        }
        let transmissionTime = (currentHttpList._tfinish.getTime() - currentHttpList.trequest.getTime()) / 1000;
        let chunkSzie = currentHttpList.trace.reduce((a, b) => a + b.b[0], 0);
        let throughput = chunkSzie / transmissionTime / 1000000.;//(MBps)
        let quality = currentHttpList._quality;
        let lastRequest = httpList.length;
        // console.log('quality'+quality);

        /******************************bufferLevel********************************/
        let bufferList = metrics.BufferLevel;
        let bufferListLastIndex = bufferList.length - 1;

        let buffer = bufferList[bufferListLastIndex].level / 1000;

        // const bufferState = metrics.BufferState;
        // if(bufferState[bufferState.length - 1].state=='bufferStalled'){
        //     buffer=0;
        //     console.log('lastRequest'+ lastRequest+"buffer=0")
        // }

        // let metric = getCurrent(metrics, MetricsConstants.BUFFER_LEVEL);

        // if (metric) {
        //     return Round10.round10(metric.level / 1000, -3);
        // }
        // A smarter (real) rule could need analyze playback metrics to take
        // bitrate switching decision. Printing metrics here as a reference
        // console.log("bufferListLastIndex="+bufferListLastIndex+"buffer level:"+buffer);
        // console.log(bufferList[bufferListLastIndex].t.getTime());
        // console.log("Time: " + new Date().getTime());
        /******************************quality**********************************/
        console.log(metrics)
        // Get current bitrate
        let streamController = StreamController(context).getInstance();
        let abrController = rulesContext.getAbrController();
        let current = abrController.getQualityFor(mediaType, streamController.getActiveStreamInfo().id);
        /***************************************************************************/
        // var xhr = new XMLHttpRequest();
        // xhr.open('POST', 'http://localhost:8333', false);
        // xhr.onreadystatechange = function() {
        //     if ( xhr.readyState == 4 && xhr.status == 200 ) {
        //         console.log('GOT RESPONSE:' + xhr.responseText + '---');
        //         // if ( xhr.responseText != 'REFRESH' ) {
        //         //     quality = parseInt(xhr.responseText, 10);
        //         // } else {
        //         //     document.location.reload(true);
        //         // }
        //     }
        // }
        // let data = {'lastquality': quality, 'buffer': buffer, 'bandwidthEst': throughput, 'lastRequest': actualLength};
        // xhr.send(JSON.stringify(data));
        /***************************************************************************/
        // quality=1;
        // If already in lowest bitrate, don't do anything
        quality = MPC(quality, buffer, throughput, actualLength);
        if (current == quality) {
            return SwitchRequest(context).create();
        }

        // Ask to switch to the lowest bitrate
        let switchRequest = SwitchRequest(context).create();
        switchRequest.quality = quality;

        console.log('lastRequest =', actualLength,"chunkSzie =",chunkSzie,"transmissionTime =",transmissionTime,"throughput =",throughput,"quality = ",switchRequest.quality);

        switchRequest.reason = 'Always switching to the lowest bitrate';
        // switchRequest.priority = SwitchRequest.PRIORITY.STRONG;
        return switchRequest;
    }

    instance = {
        getMaxIndex: getMaxIndex
    };

    setup();

    return instance;
}

LowestBitrateRuleClass.__dashjs_factory_name = 'LowestBitrateRule';
LowestBitrateRule = dashjs.FactoryMaker.getClassFactory(LowestBitrateRuleClass);
