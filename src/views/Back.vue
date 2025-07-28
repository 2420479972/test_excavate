<template>
  <div class="flex flex-col h-screen">
  <Header></Header>
    <main class="pb-4 px-4 relative flex-1 overflow-auto">
      <h1 class="text-2xl font-bold text-primary neon-text mb-8">系统设置</h1>
      <div class="space-y-6">
        <div class="glass-effect p-4 rounded-lg">
          <h2 class="text-lg text-primary mb-4">基础配置</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">权限地址</label>
              <div class="space-y-2">
                <input class="input-field w-full px-3 py-2 rounded-button text-sm" placeholder="请输入权限地址"
                       type="text">
                <button class="w-full bg-primary text-dark py-2 rounded-button button-glow">确认修改</button>
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">商户地址</label>
              <div class="space-y-2">
                <input class="input-field w-full px-3 py-2 rounded-button text-sm" placeholder="请输入商户地址"
                       type="text">
                <button class="w-full bg-primary text-dark py-2 rounded-button button-glow">确认修改</button>
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
              <label class="block text-sm text-gray-400 mb-2">收益倍数</label>
              <div class="space-y-2">
                <input class="input-field w-full px-3 py-2 rounded-button text-sm" placeholder="请输入收益倍数"
                       type="number">
                <button class="w-full bg-primary text-dark py-2 rounded-button button-glow">确认修改</button>
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">控制产量</label>
              <div class="space-y-2">
                <input class="input-field w-full px-3 py-2 rounded-button text-sm" placeholder="请输入地址" type="text">
                <div class="flex gap-2">
                  <button class="flex-1 bg-green-500 text-dark py-2 rounded-button button-glow"
                          onclick="toggleProductionControl(this, 'open')">打开
                  </button>
                  <button class="flex-1 bg-gray-500 text-dark py-2 rounded-button"
                          onclick="toggleProductionControl(this, 'close')">关闭
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label class="text-sm text-gray-400 mb-2 flex justify-between items-center">
                <span>GDA收益矿池</span>
                <span class="text-secondary">35890000枚</span>
              </label>
              <div class="space-y-2">
                <input class="input-field w-full px-3 py-2 rounded-button text-sm" placeholder="请输入转入数量" type="number">
                <button class="w-full bg-primary text-dark py-2 rounded-button button-glow ">确认修改</button>
              </div>
              <label class=" text-sm text-gray-400 mt-4 mb-2 flex justify-between items-center">
                <span>GDA释放设置</span>
              </label>
              <div class="space-y-2">
                <input class="input-field w-full px-3 py-2 rounded-button text-sm" placeholder="请输入释放比例"
                       type="number">
                <input class="input-field w-full px-3 py-2 rounded-button text-sm" placeholder="请输入释放周期(天)"
                       type="number">
                <button class="w-full bg-primary text-dark py-2 rounded-button button-glow">确认修改</button>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-effect p-4 rounded-lg">
          <h2 class="text-lg text-primary mb-4">预售设置</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">代币总量</label>
              <input class="input-field w-full px-3 py-2 rounded-button text-sm" placeholder="请输入代币总量"
                     type="number">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">剩余数量</label>
              <input class="input-field w-full px-3 py-2 rounded-button text-sm" placeholder="请输入数量" type="number">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">单份价格</label>
              <input class="input-field w-full px-3 py-2 rounded-button text-sm" placeholder="请输入单份价格"
                     type="number">
            </div>
            <div class="col-span-2">
              <label class="block text-sm text-gray-400 mb-2">代币地址</label>
              <input class="input-field w-full px-3 py-2 rounded-button text-sm" placeholder="请输入代币地址"
                     type="text">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">开始时间</label>
              <input class="input-field w-full px-3 py-2 rounded-button text-sm text-gray-300" type="datetime-local">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">结束时间</label>
              <input class="input-field w-full px-3 py-2 rounded-button text-sm text-gray-300" type="datetime-local">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">已购总量</label>
              <input class="input-field w-full px-3 py-2 rounded-button text-sm" placeholder="请输入已购总量"
                     type="number">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">每日限购</label>
              <input class="input-field w-full px-3 py-2 rounded-button text-sm" placeholder="请输入每日限购"
                     type="number">
            </div>
            <div class="col-span-2">
              <label class="block text-sm text-gray-400 mb-2">地址限购</label>
              <input class="input-field w-full px-3 py-2 rounded-button text-sm" placeholder="请输入地址限购"
                     type="number">
            </div>
            <button class="col-span-2 bg-secondary text-white py-2 rounded-button button-glow mt-4">确认修改</button>
          </div>
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
  </div>
</template>

<script lang="ts" setup>
import "../assets/css/back.css"
import Header from "../components/Header.vue";
</script>

<style lang="scss" scoped>

</style>
