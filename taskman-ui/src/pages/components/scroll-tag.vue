<template>
  <div class="taskman-scroll-column" @mouseenter="handleMouseEnter($event)" @mouseleave="handleMouseLeave($event)">
    <div v-for="(i, index) in list" :key="index" class="tag">
      {{ i }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleMouseEnter (e) {
      e.target.style.overflowY = 'scroll'
    },
    handleMouseLeave (e) {
      e.target.style.overflowY = 'hidden'
    }
  }
}
</script>

<style lang="scss" scoped>
.taskman-scroll-column {
  max-height: 72px;
  padding-right: 3px;
  padding: 6px 0;
  .tag {
    width: fit-content;
    padding: 2px 5px;
    background: #f7f7f7;
    border: 1px solid #e8eaec;
    border-radius: 3px;
    font-size: 12px;
    &:not(:last-child) {
      margin-bottom: 5px;
    }
  }
}
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 16px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 16px;
}
</style>
