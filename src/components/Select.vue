<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <!-- 触发按钮 -->
    <button
        @click="toggleDropdown"
        class="flex items-center space-x-1 px-[10px] py-[2px] bg-darkLight rounded border border-primary text-sm"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
    >
      <span>{{ selectedLabel }}</span>
      <i class="fas fa-chevron-down text-xs"></i>
    </button>

    <!-- 下拉列表 -->
    <ul
        v-show="isOpen"
        class="absolute right-0 mt-1 bg-darkLight border w-auto border-primary rounded shadow-lg z-10 max-h-48 overflow-auto"
        role="listbox"
        tabindex="-1"
        @keydown.escape.prevent="closeDropdown"
    >
      <li
          v-for="(option, index) in options"
          :key="option.value"
          class="px-[10px] py-1 text-sm cursor-pointer hover:bg-primary hover:text-dark"
          :class="{ 'bg-primary text-dark': option.value === modelValue }"
          role="option"
          @click="selectOption(option)"
          @keydown.enter.prevent="selectOption(option)"
          tabindex="0"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const dropdownRef = ref(null);

// 选中项显示文本
const selectedLabel = computed(() => {
  const found = props.options.find(opt => opt.value === props.modelValue);
  return found ? found.label : '1天';
});

// 切换下拉显示
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// 关闭下拉
const closeDropdown = () => {
  isOpen.value = false;
};

// 选择选项
const selectOption = (option) => {
  emit('update:modelValue', option.value);
  closeDropdown();
};

// 点击外部关闭
const onClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
});
</script>
