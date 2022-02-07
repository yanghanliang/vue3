<template>
  <span>哥哥</span>
  <!-- <div>{{ color }}</div> -->
  <!-- <button @click="color = 'pink'">哥哥改变了</button> -->
  <Younger-Brother />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import YoungerBrother from './youngerBrother.vue'
import { Hname } from '../typs/props'

export default defineComponent({
  name: "App",
  components: {
    YoungerBrother
  },
  props: {
    obj: {
      type: Object as () => Hname,
    }
  },
});
</script>
