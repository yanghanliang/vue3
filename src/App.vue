<template>
  <h1>{{ count }} 123</h1>
  <h2>{{ obj.name }}</h2>
  <h2>{{ obj.popel.sex }}</h2>
  <h2>{{ obj.popel.arr }}</h2>
  <h2>{{ obj.popel.arr[0] }}</h2>
  <button @click="updateCount">更新12</button>
  <hr />
  <h2>{{ pObj }}</h2>
  <button @click="test">test</button>
  <hr />
  <h2>{{ x }}</h2>
  <h2>{{ y }}</h2>
  <hr />
  <template v-if="httpObj">
    <h2>姓名：{{ httpObj.name }}</h2>
    <h2>年龄：{{ httpObj.age }}</h2>
    <h2>性别：{{ httpObj.sex }}</h2>
  </template>
  <hr />
  <template v-if="httpArr">
    <div v-for="(item, index) in httpArr" :key="index">
      <h2>姓名：{{ item.name }}</h2>
      <h2>年龄：{{ item.age }}</h2>
      <h2>性别：{{ item.sex }}</h2>
    </div>
  </template>

  <hr>
  父组件的值：{{ color }}
   <button @click="color = 'pink'">改变了</button>
  <hr>
  <!-- <Younger-Brother /> -->
  <hr>
  <Brother />
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch, provide } from "vue";
import useMousePosition from "./hooks/useMousePosition";
import getData from "./hooks/getData";
import Brother from './components/brother.vue'
// import YoungerBrother from './components/youngerBrother.vue'


export default defineComponent({
  name: "App",
  components: {
    Brother,
    // YoungerBrother,
  },
  data(): any {
    return {
      pObj: {
        name: 123,
      },
    };
  },
  setup() {
    

    let { httpObj, httpArr } = getData()

    console.log(httpArr,'httpArr')

    let { x, y } = useMousePosition();
    console.log(x, y, "xy");

    let count = ref(0); // 基本数据类型
    // reactive 复杂类型
    let obj = reactive<any>({
      // <any> 为了添加属性时编译报错
      name: "abc",
      popel: {
        age: 20,
        sex: "男",
        arr: [
          {
            test: 1,
          },
        ],
      },
    });
    let updateCount = function () {
      count.value++;
      obj.popel.arr[0].uu = "ba";
    };

    const color = ref('red')
    provide('color', color)

    watch([() => obj, count], function (data) {
      console.log(data, "data");
    });

    return {
      x,
      y,
      obj,
      color,
      count,
      httpObj,
      httpArr,
      updateCount,
    };
  },
  methods: {
    test() {
      this.pObj.gg = 333;
      console.log(this.pObj, "this.pObj");
    },
  },
});
</script>
