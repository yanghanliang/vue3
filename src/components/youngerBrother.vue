<template>
  <div>弟弟</div>
  <div>{{ color }}</div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    const color = inject("color");

    return {
      color,
    };
  },
});
</script>
