<template>
    <main class="py-4 px-4 relative flex-1 overflow-auto">
      <h1 class="text-2xl font-bold text-primary neon-text mb-4">系统设置</h1>
      <div class="space-y-6">
        <div class="glass-effect p-4 rounded-lg">
          <h2 class="text-lg text-primary mb-4">基础配置</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">当前管理员</label>
              <div class="space-y-2 mb-2">
                {{ formatAddress(managementAddress) }}
                <button class="ml-2 text-gray-400 hover:text-primary" @click="copyText(String(managementAddress))">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
              <label class="block text-sm text-gray-400 mb-2">新管理员地址</label>
              <div class="space-y-2">
                <ValidatedInput v-model="newManagementAddress"
                                :rules="managementRules as any"
                                placeholder="请输入新管理员地址">
                  <template #default="{validate}">
                    <button class="w-full bg-primary text-dark py-2 my-2 rounded-button button-glow"
                            @click="setNewManagementAddress(validate)">
                      确认修改
                    </button>
                  </template>
                </ValidatedInput>
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">当前GDA地址</label>
              <div class="space-y-2 mb-2">
                {{ formatAddress(GDAAddress) }}
                <button class="ml-2 text-gray-400 hover:text-primary" @click="copyText(String(GDAAddress))">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
              <label class="block text-sm text-gray-400 mb-2">新GDA地址</label>
              <div class="space-y-2">
                <ValidatedInput v-model="newGDAAddress"
                                :rules="GDARules as any"
                                placeholder="请输入新GDA地址">
                  <template #default="{validate}">
                    <button class="w-full bg-primary text-dark py-2 my-2 rounded-button button-glow"
                            @click="setNewGDAAddress(validate)">
                      确认修改
                    </button>
                  </template>
                </ValidatedInput>
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">当前USDT地址</label>
              <div class="space-y-2 mb-2">
                {{ formatAddress(USDTAddress) }}
                <button class="ml-2 text-gray-400 hover:text-primary" @click="copyText(String(USDTAddress))">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
              <label class="block text-sm text-gray-400 mb-2">新USDT地址</label>
              <div class="space-y-2">
                <ValidatedInput v-model="newUSDTAddress"
                                :rules="USDTRules as any"
                                placeholder="请输入新GDA地址">
                  <template #default="{validate}">
                    <button class="w-full bg-primary text-dark py-2 my-2 rounded-button button-glow"
                            @click="setNewUSDTAddress(validate)">
                      确认修改
                    </button>
                  </template>
                </ValidatedInput>
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">当前商户地址</label>
              <div class="space-y-2 mb-2">
                {{ formatAddress(MerchantsAddress) }}
                <button class="ml-2 text-gray-400 hover:text-primary" @click="copyText(String(MerchantsAddress))">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
              <label class="block text-sm text-gray-400 mb-2">新商户地址</label>
              <div class="space-y-2">
                <ValidatedInput v-model="newMerchantsAddress"
                                :rules="MerchantsRules as any"
                                placeholder="请输入新商户地址">
                  <template #default="{validate}">
                    <button class="w-full bg-primary text-dark py-2 my-2 rounded-button button-glow"
                            @click="setNewMerchantsAddress(validate)">
                      确认修改
                    </button>
                  </template>
                </ValidatedInput>
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">通知设置</label>
              <div class="space-y-2">
                <input class="input-field w-full px-3 py-2 rounded-button text-sm" placeholder="请输入通知内容"
                       type="text">
                <button class="w-full bg-primary text-dark py-2 rounded-button button-glow">确认修改</button>
              </div>
            </div>
          </div>
        </div>
        <div class="glass-effect p-4 rounded-lg">
          <h2 class="text-lg text-primary mb-4">收益配置</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">控制产量</label>
                <ValidatedInput v-model="userAddress"
                                :rules="userRules as any"
                                placeholder="请输入地址">
                  <template #default="{validate}">
                    <div class="flex gap-2 mt-2" v-if="userAddress">
                      <button class="flex-1 bg-gray-500 text-dark py-2 rounded-button button-glow"
                              :class="[{'bg-green-500':userPaused}]"
                              @click="toggleRewardStatus(validate, true)">停止
                      </button>
                      <button class="flex-1 bg-gray-500 text-dark py-2 rounded-button"
                              :class="[{'bg-green-500':!userPaused}]"
                              @click="toggleRewardStatus(validate, false)">启用
                      </button>
                    </div>
                  </template>
                </ValidatedInput>

            </div>
            <div>
              <label class="text-sm text-gray-400 mb-2 flex justify-between items-center">
                <span>GDA收益矿池</span>
                <span class="text-secondary">{{formatEther(String(gdaPool || 0))}}枚</span>
              </label>
              <label class="block text-sm text-gray-400 mb-2">提取GDA</label>
              <div class="space-y-2 mb-2">
                <ValidatedInput v-model="extractionGDAValue"
                                :rules="GDAPoolRules as any"
                                type="number"
                                placeholder="请输入提取数量">
                  <template #default="{validate}">
                    <button class="w-full bg-primary text-dark mt-2 py-2 rounded-button button-glow" @click="extractionGDA(validate)">确认修改</button>
                  </template>
                </ValidatedInput>
              </div>
              <div class="space-y-2">
                <label class="block text-sm text-gray-400 mb-2">转入GDA</label>
                <ValidatedInput v-model="addGDAAmount"
                                :rules="GDAPoolRules as any"
                                type="number"
                                placeholder="请输入转入数量">
                  <template #default="{validate}">
                    <button class="w-full bg-primary text-dark mt-2 py-2 rounded-button button-glow" @click="addGDA(validate)">确认修改</button>
                  </template>
                </ValidatedInput>
              </div>
              <label class=" text-sm text-gray-400 mt-4 mb-2 flex justify-between items-center">
                <span>GDA释放设置</span>
              </label>
              <ValidatedForm @success="setUpdateRewardConfig" class="space-y-2">
                <label class="block text-sm text-gray-400 mb-2">奖励倍数</label>
                <ValidatedInput v-model="multiplier"
                                :rules="rewardRules.multiplier as any"
                                placeholder="请输入奖励倍数">
                </ValidatedInput>
                <label class="block text-sm text-gray-400 mb-2">释放比例</label>
                <ValidatedInput v-model="releaseRate"
                                :rules="rewardRules.releaseRate as any"
                                placeholder="请输入释放比例">
                </ValidatedInput>
                <label class="block text-sm text-gray-400 mb-2">释放周期</label>
                <ValidatedInput v-model="cycle"
                                :rules="rewardRules.cycle as any"
                                placeholder="请输入释放周期(天)">
                </ValidatedInput>
                <button class="w-full bg-primary text-dark py-2 rounded-button button-glow">确认修改</button>
              </ValidatedForm>
            </div>
          </div>
        </div>



        <div class="glass-effect p-4 rounded-lg">
          <h2 class="text-lg text-primary mb-4">预售设置</h2>
          <ValidatedForm @success="setUpdatePresaleConfig">
            <template #default="{register}">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-400 mb-2">代币总量</label>
                  <ValidatedInput ref="totalTokensRef"
                                  v-model="totalTokens"
                                  :rules="rules.totalTokens"
                                  placeholder="请输入代币总量"
                                  type="number"
                                  v-bind="register(totalTokensRef)">
                  </ValidatedInput>
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-2">单份价格</label>
                  <ValidatedInput ref="sharePriceRef"
                                  v-model="sharePrice"
                                  :rules="rules.sharePrice"
                                  placeholder="请输入单份价格"
                                  type="number"
                                  v-bind="register(sharePriceRef)">
                  </ValidatedInput>
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-2">开始时间</label>
                  <ValidatedInput ref="startRef"
                                  v-model="start"
                                  :rules="rules.start"
                                  placeholder="请输入开始时间"
                                  type="datetime-local"
                                  v-bind="register(startRef)">
                  </ValidatedInput>
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-2">结束时间</label>
                  <ValidatedInput ref="endRef"
                                  v-model="end"
                                  :rules="rules.end"
                                  placeholder="请输入结束时间"
                                  type="datetime-local"
                                  v-bind="register(endRef)">
                  </ValidatedInput>
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-2">每日限购</label>
                  <ValidatedInput ref="dailyLimitRef"
                                  v-model="dailyLimit"
                                  :rules="rules.dailyLimit"
                                  placeholder="请输入每日限购"
                                  type="number"
                                  v-bind="register(dailyLimitRef)">
                  </ValidatedInput>
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-2">地址限购</label>
                  <ValidatedInput ref="addressLimitRef"
                                  v-model="addressLimit"
                                  :rules="rules.addressLimit"
                                  placeholder="请输入地址限购"
                                  type="number"
                                  v-bind="register(addressLimitRef)">
                  </ValidatedInput>
                </div>
                <button class="col-span-2 bg-secondary text-white py-2 rounded-button button-glow mt-4">确认修改
                </button>
              </div>
            </template>
          </ValidatedForm>
        </div>
      </div>
      <div class="glass-effect p-4 rounded-lg mt-6">
        <h2 class="text-lg text-primary mb-4">购买记录设置</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-400 mb-2">记录条数</label>
            <input class="input-field w-full px-3 py-2 rounded-button text-sm" placeholder="请输入需要生成的记录条数"
                   type="number">
          </div>
          <button class="w-full bg-secondary text-white py-2 rounded-button button-glow mt-4">确认生成记录</button>
        </div>
      </div>
    </main>
</template>

<script lang="ts" setup>
import "../assets/css/back.css"
import {ref, watch} from "vue";
import {copyToClipboard, formatAddress} from "../utils";
import {Notify} from "../utils/Toast.ts";
import {
  GADSet,
  GDAPool,
  managementSet,
  merchantsSet,
  updatePresaleConfig,
  updateRewardConfig,
  USDTSet
} from "./BackSet.ts";
import {getPublicVariable, watchEvent, writeContract} from "../utils/base.ts";
import ValidatedInput from "../components/ValidatedInput.vue";
import ValidatedForm from "../components/ValidatedForm.vue";
import {formatEther, isAddress, parseEther} from "viem";

const copyText = (text: string) => {
  copyToClipboard(text)
      .then(() => {
        Notify.success('复制成功')
      })
      .catch(err => {
        Notify.error('复制失败');
      });
}


const {setNewManagementAddress, managementAddress, newManagementAddress, managementRules} = managementSet();
const {
  setNewGDAAddress,
  GDAAddress,
  GDARules,
  newGDAAddress
} = GADSet();
const {
  setNewUSDTAddress,
  USDTAddress,
  USDTRules,
  newUSDTAddress
} = USDTSet()

const {
  setNewMerchantsAddress,
  MerchantsAddress,
  MerchantsRules,
  newMerchantsAddress
} = merchantsSet(managementAddress.value);

const totalTokensRef = ref();
const sharePriceRef = ref();
const startRef = ref();
const endRef = ref();
const dailyLimitRef = ref();
const addressLimitRef = ref();


const {
  totalTokens,
  sharePrice,
  start,
  end,
  dailyLimit,
  addressLimit,
  rules,
  setUpdatePresaleConfig
} = updatePresaleConfig();


const {
  setUpdateRewardConfig,
  rewardRules,
  multiplier,
  releaseRate,
  cycle
} = updateRewardConfig()

const {
  addGDA,
  gdaPool,
  GDAPoolRules,
  addGDAAmount
} = GDAPool();


const extractionGDAValue = ref();
const {write} = writeContract('withdrawGDAtoMerchant');

const extractionGDA = (validate:()=>boolean) => {
  if(gdaPool.value == 0){
    Notify.error('没有可提取的GDA')
    return
  }
  if (!validate()) return;
  if (extractionGDAValue.value > gdaPool.value) {
    Notify.error('最多只能提取'+gdaPool.value)
    return;
  }
  if(extractionGDAValue.value < 1){
    Notify.error('提取数量必须大于1个!')
    return
  }
  write([parseEther(String(extractionGDAValue.value))]);
}

watchEvent('GDAWithdrawnToMerchant', () => {
    Notify.success('提取成功')
})


const userRules = [
  {
    type: 'custom',
    validator: (val: string) => isAddress(val),
    message: '请输入正确的用户地址'
  },
  {
    type: 'custom',
    validator: (val: string) => {
      userPaused.value = false;
      setParams([val]);
      return true;
    }
  }
]
const userAddress = ref('');
const userPaused = ref(false);
const  {data,setParams} =getPublicVariable('pausedRewards');

watch(data,(newVal)=>{
  userPaused.value = newVal
})

const {write:setToggleRewardStatus} = writeContract('toggleRewardStatus');
const toggleRewardStatus =async ( validate:()=>boolean,value:boolean)=>{
  if (!validate()) return;
  await setToggleRewardStatus([userAddress.value,value])
}

watchEvent('RewardStatusToggled', () => {
  Notify.success('修改成功')
})

</script>

<style lang="scss" scoped>

</style>
