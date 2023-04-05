import json
import matplotlib.pyplot as plt
import numpy as np

data = {"lastquality": 5, "buffer": 29.899855000000002, "bandwidthEst": 92.138, "lastRequest": 27}
temp = {}
temp[0] = data

# with open('data.json','w') as f:
#     json.dump(temp, f)
bandwidthEst = []
bitrateReq = []
indexReq = []
fair = []
lastQuality = 0
VIDEO_BIT_RATE = [300, 750, 1200, 1850, 2850, 4300]
QoE = 0
with open('data.json','r') as f:
    data = json.load(f)
    # print(data)
    count = 1
    for i in range(1,len(data)+1,1):
        # print("  "+str(data[str(i-1)]['lastRequest'])+"  "+str(count))
        # print(str(count))

        if str(count) == str(data[str(i-1)]['lastRequest']):
            bandwidthEst.append(data[str(i-1)]['bandwidthEst'])
            bitrateReq.append(data[str(i-1)]['lastquality'])
            indexReq.append(data[str(i-1)]['lastRequest'])
            fair.append(0.25)
            count = count + 1
            tmp = data[str(i-1)]['lastquality']
            QoE = QoE + (VIDEO_BIT_RATE[tmp] - abs(VIDEO_BIT_RATE[tmp] - VIDEO_BIT_RATE[lastQuality]))
            lastQuality = tmp
            if count == 48:
                break
    # data = json.dumps(data)
print(count)
print("QoE" + str(QoE/1000.))
# with open('data.json','w') as f:
#     json.dump(data, f)


fig = plt.figure(figsize=(10,5))
# ax = plt.gca()#获取边框

ax1 = fig.add_subplot(111)
lns1 = ax1.plot(indexReq, bandwidthEst, c='brown',label='1-thr', linewidth=2, marker = 'o')
lns2 = ax1.plot(indexReq, fair, c='red',label='fair', linewidth=1)
ax1.set_ylabel('estimated throughput (MBps)', fontsize=20,fontweight='roman')

ax2 = ax1.twinx()
lns3 = ax2.plot(indexReq, bitrateReq, c='royalblue',label='1-bit',linewidth=2, marker = 'D' )
ax2.set_ylabel('requested bitrate', fontsize=20,fontweight='roman')
ax2.set_xlabel('Chunk', fontsize=20,fontweight='roman')

lns = lns1+lns2+lns3
labs = [l.get_label() for l in lns]
ax1.legend(lns, labs, loc=0)
# plt.plot(x, y_CUBIC, c='olivedrab',label='CUBIC',         linewidth=2, marker = 's' )
# plt.plot(x, y_Orca, c='goldenrod',label='Orca',         linewidth=2, marker = '*' )
# plt.plot(x, y_Vivace, c='mediumpurple',label='Vivace',         linewidth=2, marker = 'v' )
# plt.plot(x, y_Vegas, c='chocolate',label='Vegas',         linewidth=2, marker = '^' )


# plt.xlabel('Chunk', fontsize=25,fontweight='roman')
# plt.ylabel('Link Utilization (%)', fontsize=25,fontweight='roman')
# plt.yticks( fontsize=25,fontweight='roman')#设置大小及加粗
# plt.xticks( fontsize=25,fontweight='roman')

# ax.spines['right'].set_color('black')
# ax.spines['top'].set_color('black')
# ax.spines['left'].set_color('black')
# ax.spines['bottom'].set_color('black')

# ax.spines['right'].set_linewidth(1)
# ax.spines['top'].set_linewidth(1)
# ax.spines['left'].set_linewidth(1)
# ax.spines['bottom'].set_linewidth(1)

font1 = {'weight' : 'roman',
'size'   : 18,
}
plt.tight_layout()
# plt.legend(prop=font1)
plt.grid() 

# plt.xlim(20,150)
plt.savefig('result.pdf')