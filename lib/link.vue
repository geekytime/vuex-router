<template>
  <a :href="href" @click="onClick"><slot></slot></a>
</template>

<script>
import isPlainLeftClick from "./is-plain-left-click.js"

export default {
  computed: {
    href () {
      return this.to
    }
  },
  methods: {
    onClick (event) {
      if (!isPlainLeftClick(event)){
        return
      }
      event.preventDefault()

      const payload = {
        path: this.to
      }
      if (this.replace){
        this.$store.dispatch("router/replace", payload)
      } else {
        this.$store.dispatch("router/push", payload)
      }
    }
  },
  props: ["to", "replace"]
}
</script>
