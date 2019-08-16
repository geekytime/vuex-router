<template >
  <div v-if="showPage" class="page-wrapper"
    :class="pageClass" @animationend="onAnimationEnd">
    <slot></slot>
  </div>
</template>

<script>
export default {
  computed: {
    pageClass () {
      const transitionClass = this.$store.getters["router/transitionForPage"](this.name)
      return transitionClass
    },
    showPage () {
      const isCurrent = this.$store.getters["router/currentPage"] === this.name
      const isLast = this.$store.getters["router/lastPage"] === this.name
      const isTransition = this.$store.state.router.transition
      return isCurrent || (isLast && isTransition)
    }
  },
  methods: {
    loadScrollTop () {
      const scrollTop = this.$store.getters["router/scrollTopForPage"](this.name)
      this.$nextTick(function() {
        this.$el.scrollTop = scrollTop
      })
    },
    onAnimationEnd (event) {
      this.$store.dispatch("router/transitionEnd")
    },
    saveScrollTop () {
      const values = {
        name: this.name,
        scrollTop: this.$el.scrollTop
      }
      this.$store.commit("router/saveScrollTop", values)
    }
  },
  props: ["name"],
  watch: {
    showPage: function(newVal, oldVal) {
      if (!oldVal && newVal){
        this.loadScrollTop()
      } else if (oldVal && !newVal){
        this.saveScrollTop()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./animations/slide.less";

.pages {
  .page-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    left: 0px;
    top: 0px;

    &.hidden {
      visibility: hidden;
    }
  }
}
</style>
