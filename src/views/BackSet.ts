import {ref, watch} from "vue";
import {getPublicVariable, watchEvent, writeContract} from "../utils/base.ts";
import {Notify} from "../utils/Toast.ts";
import {formatEther, isAddress, parseEther} from "viem";
import {bigintToNumberSafe} from "../utils";

export const managementSet = () => {
    const newManagementAddress = ref("");
    const {data: managementAddress} = getPublicVariable('owner')
    const {write} = writeContract('transferOwnership');
    const setNewManagementAddress = async (validate: () => boolean) => {
        if (!validate()) return;
        await write([newManagementAddress.value]);
    }

    const managementRules = [
        {type: 'required', message: '请输入新管理员地址'},
        {
            type: 'custom',
            validator: (val: string) => isAddress(val),
            message: '请输入正确的地址'
        }
    ]

    watchEvent('OwnershipTransferred', (data) => {
        console.log(data);
        if (data[0].args.newOwner === newManagementAddress.value || data[0].args.newOwner === managementAddress.value) {
            Notify.success('管理员转让成功')
            newManagementAddress.value = ""
        } else {
            Notify.error('管理员转让失败')
        }
    })
    return {
        setNewManagementAddress,
        managementAddress,
        managementRules,
        newManagementAddress
    }
}

export const GADSet = () => {
    const newGDAAddress = ref("");
    const {data: GDAAddress} = getPublicVariable('gdaToken')
    const {write} = writeContract('setGDAAddress');
    const setNewGDAAddress = async (validate: () => boolean) => {
        if (!validate()) return;
        await write([newGDAAddress.value]);
    }

    const GDARules = [
        {type: 'required', message: '请输入GAD地址'},
        {
            type: 'custom',
            validator: (val: string) => isAddress(val),
            message: '请输入正确的GAD地址'
        }
    ]

    watchEvent('GDAAddressUpdated', (data) => {
        if (data[0].args.newGDA === newGDAAddress.value) {
            Notify.success('新GAD设置成功')
            GDAAddress.value = ""
        } else {
            Notify.error('新GAD设置失败')
        }
    })
    return {
        setNewGDAAddress,
        GDAAddress,
        GDARules,
        newGDAAddress
    }
}

export const USDTSet = () => {
    const newUSDTAddress = ref("");
    const {data: USDTAddress} = getPublicVariable('usdt')
    const {write} = writeContract('setUSDTAddress');
    const setNewUSDTAddress = async (validate: () => boolean) => {
        if (!validate()) return;
        await write([newUSDTAddress.value]);
    }

    const USDTRules = [
        {type: 'required', message: '请输入USDT地址'},
        {
            type: 'custom',
            validator: (val: string) => isAddress(val),
            message: '请输入正确的USDT地址'
        }
    ]

    watchEvent('USDTAddressUpdated', (data) => {
        if (data[0].args.newUSDT === newUSDTAddress.value) {
            Notify.success('新USDT设置成功')
            newUSDTAddress.value = ""
        } else {
            Notify.error('新USDT设置失败')
        }
    })
    return {
        setNewUSDTAddress,
        USDTAddress,
        USDTRules,
        newUSDTAddress
    }
}

export const merchantsSet = (management:string) => {
    const newMerchantsAddress = ref("");
    const {data: MerchantsAddress} = getPublicVariable('merchant')
    const {write} = writeContract('updateBasicConfig');
    const setNewMerchantsAddress = async (validate: () => boolean) => {
        if (!validate()) return;
        console.log(management,newMerchantsAddress.value)
        await write([management,newMerchantsAddress.value]);
    }

    const MerchantsRules = [
        {type: 'required', message: '请输入新的商户地址'},
        {
            type: 'custom',
            validator: (val: string) => isAddress(val),
            message: '请输入正确的商户地址'
        }
    ]

    watchEvent('AdminConfigUpdated', (data) => {
        Notify.success('新商户地址设置成功')
    })
    return {
        setNewMerchantsAddress,
        MerchantsAddress,
        MerchantsRules,
        newMerchantsAddress
    }
}


export const updatePresaleConfig = () => {
    const {data: _totalShares} = getPublicVariable('totalTokens') // 预售 GDA 代币总量
    const {data: _sharePrice} = getPublicVariable('sharePrice') // 单份份额价格（USDT，6 位小数）
    const {data: _startTime} = getPublicVariable('startTime') // 开始时间
    const {data: _endTime} = getPublicVariable('endTime') // 结束时间
    const {data: _dailyLimit} = getPublicVariable('dailyLimit') // 结束时间
    const {data: _addressLimit} = getPublicVariable('addressLimit') // 结束时间


    watch(_totalShares,(newVal)=>{
        totalTokens.value = formatEther(newVal || 0)
    })
    watch(_sharePrice,(newVal)=>{
        sharePrice.value = formatEther(newVal || 0)
    })
    watch(_startTime,(newVal)=>{
        start.value = formatDate(new Date(bigintToNumberSafe(newVal) * 1000))
    })
    watch(_endTime,(newVal)=>{
        end.value = formatDate(new Date(bigintToNumberSafe(newVal) * 1000))
    })
    watch(_dailyLimit,(newVal)=>{
        dailyLimit.value = newVal
    })
    watch(_addressLimit,(newVal)=>{
        addressLimit.value = newVal
    })

    const totalTokens = ref(0);
    const sharePrice = ref(0);
    const start = ref(0);
    const end = ref(0);
    const dailyLimit = ref(0);
    const addressLimit = ref(0);


    const {write} = writeContract('updatePresaleConfig');
    const setUpdatePresaleConfig = async () => {
        console.log([totalTokens.value,sharePrice.value,BigInt(Math.floor(new Date(start.value).getTime() / 1000)),BigInt(Math.floor(new Date(end.value).getTime() / 1000)),dailyLimit.value,addressLimit.value])
        await write([totalTokens.value,sharePrice.value,BigInt(Math.floor(new Date(start.value).getTime() / 1000)),BigInt(Math.floor(new Date(end.value).getTime() / 1000)),dailyLimit.value,addressLimit.value]);
    }


    watchEvent('AdminConfigUpdated', (data) => {
        console.log(data);
        Notify.success('新商户地址设置成功')
    })


    const rules = {
        totalTokens:[
            { type: 'required', message: '总量不能为空' },
            { type: 'min', value: 1, message: '不能小于1' },
        ],
        sharePrice:[
            { type: 'required', message: '单份价格不能为空' },
            { type: 'min', value: 1, message: '不能小于1' },
        ],
        dailyLimit:[
            { type: 'required', message: '单份价格不能为空' },
            { type: 'min', value: 1, message: '不能小于1' },
        ],
        addressLimit:[
            { type: 'required', message: '单份价格不能为空' },
            { type: 'min', value: 1, message: '不能小于1' },
        ],
        start:[
            { type: 'required', message: '开始时间不能为空' },
            {
                type: 'custom',
                validator: (val: string) => isAfterTomorrow(val),
                message: '开始时间必须大于今天'
            }
        ],
        end:[
            { type: 'required', message: '结束时间不能为空' },
            {
                type: 'custom',
                validator: (val: string) => {
                    console.log(start.value);
                   return isEndTimeAfterStart(start.value,val)
                },
                message: '结束时间必须大于开始时间'
            }
        ]
    }



    return {
        setUpdatePresaleConfig,
        totalTokens,
        sharePrice,
        start,
        end,
        dailyLimit,
        addressLimit,
        rules
    }
}


export const updateRewardConfig = () => {
    const {data: _multiplier} = getPublicVariable('rewardMultiplier') // 奖励倍数
    const {data: _releaseRate} = getPublicVariable('dailyReleaseRate') // 日释放比例
    const {data: _cycle} = getPublicVariable('releaseCycle') // 释放周期


    watch(_multiplier,(newVal)=>{
        multiplier.value = newVal
    })

    watch(_releaseRate,(newVal)=>{
        releaseRate.value = newVal
    })
    watch(_cycle,(newVal)=>{
        cycle.value = newVal
    })

    const multiplier = ref(0);
    const releaseRate = ref(0);
    const cycle = ref(0);


    const {write} = writeContract('updateRewardConfig');
    const setUpdateRewardConfig = async () => {
        await write([multiplier.value,releaseRate.value,cycle.value]);
    }


    watchEvent('AdminConfigUpdated', (data) => {
        Notify.success('GAD释放设置修改成功')
    })


    const rewardRules = {
        multiplier:[
            { type: 'required', message: '总量不能为空' },
            { type: 'min', value: 1, message: '不能小于1' },
        ],
        releaseRate:[
            { type: 'required', message: '单份价格不能为空' },
            { type: 'min', value: 1, message: '不能小于1' },
        ],
        cycle:[
            { type: 'required', message: '单份价格不能为空' },
            { type: 'min', value: 1, message: '不能小于1' },
        ],
    }



    return {
        setUpdateRewardConfig,
        rewardRules,
        multiplier,
        releaseRate,
        cycle
    }
}


export const GDAPool = () => {
    const addGDAAmount = ref("");
    const {data: gdaPool} = getPublicVariable('gdaPool')
    const {write} = writeContract('addToGDAPool');
    const addGDA = async (validate: () => boolean) => {
        if (!validate()) return;
        await write([parseEther(String(addGDAAmount.value))]);
    }

    const GDAPoolRules = [
        { type: 'required', message: '总量不能为空' },
        { type: 'min', value: 1, message: '不能小于1' },
    ]

    watchEvent('RewardPoolUpdated', () => {
        Notify.success('增加成功')
    })
    return {
        addGDA,
        gdaPool,
        GDAPoolRules,
        addGDAAmount
    }
}




function isAfterTomorrow(date: string | Date): boolean {
    const inputDate = new Date(date) // 用户输入的时间
    const now = new Date()

    // 获取“明天 0 点”的时间
    const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

    return inputDate.getTime() > tomorrowStart.getTime()
}

function isEndTimeAfterStart(start: string | Date, end: string | Date): boolean {
    return new Date(end).getTime() > new Date(start).getTime()
}

const formatDate = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0')
    const yyyy = date.getFullYear()
    const MM = pad(date.getMonth() + 1)
    const dd = pad(date.getDate())
    const hh = pad(date.getHours())
    const mm = pad(date.getMinutes())
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`
}
