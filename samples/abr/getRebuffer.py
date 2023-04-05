

f = open("result.txt")               # 返回一个文件对象 
line = f.readline()               # 调用文件的 readline()方法
rebuffer181 = 0
rebuffer182 = 0
rebuffer183 = 0
rebuffer008 = 0

while line: 

    # print(line, end = '')

    if 'ip=181' in line:
        tmp = line.split('rebuffer=')
        rebuffer181 += int(tmp[1])
    elif 'ip=182' in line:
        tmp = line.split('rebuffer=')
        rebuffer182 += int(tmp[1])
    elif 'ip=183' in line:
        tmp = line.split('rebuffer=')
        rebuffer183 += int(tmp[1])
    elif 'ip=008' in line:
        tmp = line.split('rebuffer=')
        rebuffer008 += int(tmp[1])

    line = f.readline() 
 
f.close()  

print("rebuffer181 :" + str(rebuffer181) + '\n')
print("rebuffer182 :" + str(rebuffer182) + '\n')
print("rebuffer183 :" + str(rebuffer183) + '\n')
print("rebuffer008 :" + str(rebuffer008) + '\n')
print("sum :" + str(rebuffer181+rebuffer182+rebuffer183+rebuffer008) + '\n')