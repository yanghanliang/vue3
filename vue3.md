### 核心原理 比较Vue2与Vue3的响应式(重要)

#### vue2的响应式
核心:
  对象: 通过defineProperty对对象的已有属性值的读取和修改进行劫持(监视/拦截)
  数组: 通过`重写`数组更新数组一系列更新元素的方法来实现元素修改的劫持

```js
Object.defineProperty(data, 'count', {
  get () {}, 
  set () {}
})
```
+ 问题
  + 对象直接新添加的属性或删除已有属性, 界面不会自动更新
  + 直接通过下标替换元素或更新length, 界面不会自动更新 arr[1] = {}

#### Vue3的响应式
  + 核心:
    + 通过Proxy(代理): 拦截对data任意属性的任意(13种)操作, 包括属性值的读写, 属性的添加, 属性的删除等...
    + 通过 Reflect(反射): 动态对被代理对象的相应属性进行特定的操作
    文档:
  `https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/ReferenceGlobal_Objects/Proxy`
  `https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect`

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proxy 与 Reflect</title>
</head>
<body>
  <script>
    
    const user = {
      name: "John",
      age: 12
    };

    /* 
    proxyUser是代理对象, user是被代理对象
    后面所有的操作都是通过代理对象来操作被代理对象内部属性
    */
    const proxyUser = new Proxy(user, {

      get(target, prop) {
        console.log('劫持get()', prop)
        return Reflect.get(target, prop)
      },

      set(target, prop, val) {
        console.log('劫持set()', prop, val)
        return Reflect.set(target, prop, val); // (2)
      },

      deleteProperty (target, prop) {
        console.log('劫持delete属性', prop)
        return Reflect.deleteProperty(target, prop)
      }
    });
    // 读取属性值
    console.log(proxyUser===user)
    console.log(proxyUser.name, proxyUser.age)
    // 设置属性值
    proxyUser.name = 'bob'
    proxyUser.age = 13
    console.log(user)
    // 添加属性
    proxyUser.sex = '男'
    console.log(user)
    // 删除属性
    delete proxyUser.sex
    console.log(user)
  </script>
</body>
</html>
```

---


### setup
+ setup执行的时机
  + 在beforeCreate之前执行(一次), 此时组件对象还没有创建
  + this是undefined, 不能通过this来访问data/computed/methods / props
  + 其实所有的composition API相关回调函数中也都不可以
+ setup的返回值
  + 一般都返回一个对象: 为模板提供数据, 也就是模板中可以直接使用此对象中的所有属性/方法
  + 返回对象中的属性会与data函数返回对象的属性合并成为组件对象的属性
  + 返回对象中的方法会与methods中的方法合并成功组件对象的方法,如果有重名, setup优先
+ setup的参数
  + setup(props, context) / setup(props, {attrs, slots, emit})
  + props: 包含props配置声明且传入了的所有属性的对象
  + attrs: 包含没有在props配置中声明的属性的对象, 相当于 this.$attrs, 其实就是自定义属性
  + slots: 包含所有传入的插槽内容的对象, 相当于 this.$slots
  + emit: 用来分发自定义事件的函数, 相当于 this.$emit

> 注意:
  一般不要将setup和data或methods混合使用: methods中可以访问setup提供的属性和方法, 但在setup方法中不能访问data和methods,因为setup中没有this
  setup不能是一个async函数: 因为返回值不再是return的对象, 而是promise, 模板看不到return对象中的属性数据

```html
<template>
  <h1>{{ count }} 123</h1>
  <h2>{{ obj.name }}</h2>
  <h2>{{ obj.popel.sex }}</h2>
  <h2>{{ obj.popel.arr }}</h2>
  <h2>{{ obj.popel.arr[0] }}</h2>
  <button @click="updateCount">更新12</button>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  name: "App",
  // 在beforeCreate之前执行(一次), 此时组件对象还没有创建
  setup() {
    let count = ref(0); // 基本数据类型
    // reactive 复杂类型
    let obj = reactive<any>({ // <any> 为了添加属性时编译报错 
      name: 'abc',
      popel: {
        age: 20,
        sex: '男',
        arr: [
          {
            test: 1
          }
        ]
      }
    })
    let updateCount = function () {
      count.value++;
      obj.popel.arr[0].uu = 'ba'
    };

    return {
      obj,
      count,
      updateCount,
    };
  },
});
</script>
```

---

```html
<template>
  <h2>App</h2>
  fistName: <input v-model="user.firstName"/><br>
  lastName: <input v-model="user.lastName"/><br>
  fullName1: <input v-model="fullName1"/><br>
  fullName2: <input v-model="fullName2"><br>
  fullName3: <input v-model="fullName3"><br>

</template>

<script lang="ts">
/*
计算属性与监视
1. computed函数: 
  与computed配置功能一致
  只有getter
  有getter和setter
2. watch函数
  与watch配置功能一致
  监视指定的一个或多个响应式数据, 一旦数据变化, 就自动执行监视回调
  默认初始时不执行回调, 但可以通过配置immediate为true, 来指定初始时立即执行第一次
  通过配置deep为true, 来指定深度监视
3. watchEffect函数
  不用直接指定要监视的数据, 回调函数中使用的哪些响应式数据就监视哪些响应式数据
  默认初始时就会执行第一次, 从而可以收集需要监视的数据
  监视数据发生变化时回调
*/

import {
  reactive,
  ref,
  computed,
  watch,
  watchEffect
} from 'vue'

export default {

  setup () {
    const user = reactive({
      firstName: 'A',
      lastName: 'B'
    })

    // 只有getter的计算属性
    const fullName1 = computed(() => {
      console.log('fullName1')
      return user.firstName + '-' + user.lastName
    })

    // 有getter与setter的计算属性
    const fullName2 = computed({
      get () {
        console.log('fullName2 get')
        return user.firstName + '-' + user.lastName
      },

      set (value: string) {
        console.log('fullName2 set')
        const names = value.split('-')
        user.firstName = names[0]
        user.lastName = names[1]
      }
    })

    const fullName3 = ref('')

    /* 
    watchEffect: 监视所有回调中使用的数据
    */
    /* 
    watchEffect(() => {
      console.log('watchEffect')
      fullName3.value = user.firstName + '-' + user.lastName
    }) 
    */

    /* 
    使用watch的2个特性:
      深度监视
      初始化立即执行
    */
    watch(user, () => {
      fullName3.value = user.firstName + '-' + user.lastName
    }, {
      immediate: true,  // 是否初始化立即执行一次, 默认是false
      deep: true, // 是否是深度监视, 默认是false
    })

    /* 
    watch一个数据
      默认在数据发生改变时执行回调
    */
    watch(fullName3, (value) => {
      console.log('watch')
      const names = value.split('-')
      user.firstName = names[0]
      user.lastName = names[1]
    })

    /* 
    watch多个数据: 
      使用数组来指定
      如果是ref对象, 直接指定
      如果是reactive对象中的属性,  必须通过函数来指定
    */
    watch([() => user.firstName, () => user.lastName, fullName3], (values) => {
      console.log('监视多个数据', values)
    })

    return {
      user,
      fullName1,
      fullName2,
      fullName3
    }
  }
}
</script>
```

#### 声明周期

beforeCreate -> 使用 setup()

created -> 使用 setup()

beforeMount -> onBeforeMount

mounted -> onMounted

beforeUpdate -> onBeforeUpdate

updated -> onUpdated

beforeUnmount -> onBeforeUnmount

unmounted -> onUnmounted

errorCaptured -> onErrorCaptured

renderTracked -> onRenderTracked

renderTriggered -> onRenderTriggered

activated -> onActivated

deactivated -> onDeactivated

---

#### toRefs (深拷贝)

`toRefs`可以将 `reactive` 中的对象 解构成 `ref` 对象，如果单纯解构 `reactive` 对象的话，数据会丢失双向绑定

```ts

setup () {
    const state = reactive({
      foo: 'a',
      bar: 'b',
    })

    const stateAsRefs = toRefs(state)

    return {
      // ...state,
      ...stateAsRefs,
    }
  },
}

```

---


#### ref (浅拷贝)
利用ref函数获取组件中的标签元素
功能需求: 让输入框自动获取焦点

```html
<template>
  <h2>App</h2>
  <input type="text">---
  <input type="text" ref="inputRef">
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
/* 
ref获取元素: 利用ref函数获取组件中的标签元素
功能需求: 让输入框自动获取焦点
*/
export default {
  setup() {
    const inputRef = ref<HTMLElement|null>(null)

    onMounted(() => {
      inputRef.value && inputRef.value.focus()
    })

    return {
      inputRef
    }
  },
}
</script>
```

---

#### shallowReactive 与 shallowRef
shallowReactive : 只处理了对象内最外层属性的响应式(也就是浅响应式)

shallowRef: 只处理了value的响应式, 不进行对象的reactive处理

什么时候用浅响应式呢?

一般情况下使用ref和reactive即可
如果有一个对象数据, 结构比较深, 但变化时只是外层属性变化 ===> shallowReactive
如果有一个对象数据, 后面会产生新的对象来替换 ===> shallowRef

##### readonly 与 shallowReadonly
readonly:
深度只读数据
获取一个对象 (响应式或纯对象) 或 ref 并返回原始代理的只读代理。
只读代理是深层的：访问的任何嵌套 property 也是只读的。
shallowReadonly
浅只读数据
创建一个代理，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换
应用场景:
在某些特定情况下, 我们可能不希望对数据进行更新的操作, 那就可以包装生成一个只读代理对象来读取数据, 而不能修改或删除


##### toRaw 与 markRaw

+ toRaw
  + 返回由 reactive 或 readonly 方法转换成响应式代理的普通对象。
  + 这是一个还原方法，可用于临时读取，访问不会被代理/跟踪，写入时也不会触发界面更新。
+ markRaw
  + 标记一个对象，使其永远不会转换为代理。返回对象本身
  + 应用场景:
    + 有些值不应被设置为响应式的，例如复杂的第三方类实例或 Vue 组件对象。
    + 当渲染具有不可变数据源的大列表时，跳过代理转换可以提高性能。

```ts
setup () {
  const state = reactive<any>({
    name: 'tom',
    age: 25,
  })

  const testToRaw = () => {
    const user = toRaw(state)
    user.age++  // 界面不会更新

  }

  const testMarkRaw = () => {
    const likes = ['a', 'b']
    // state.likes = likes
    state.likes = markRaw(likes) // likes数组就不再是响应式的了
    setTimeout(() => {
      state.likes[0] += '--'
    }, 1000)
  }

  return {
    state,
    testToRaw,
    testMarkRaw,
  }
}
```

---

#### customRef

+ 创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制

>需求: 使用 customRef 实现 debounce 的示例

```html
<template>
  <h2>App</h2>
  <input v-model="keyword" placeholder="搜索关键字"/>
  <p>{{keyword}}</p>
</template>

<script lang="ts">
/*
customRef:
  创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制

需求: 
  使用 customRef 实现 debounce 的示例
*/

import {
  ref,
  customRef
} from 'vue'

export default {

  setup () {
    const keyword = useDebouncedRef('', 500)
    console.log(keyword)
    return {
      keyword
    }
  },
}

/* 
实现函数防抖的自定义ref
*/
function useDebouncedRef<T>(value: T, delay = 200) {
  let timeout: number
  return customRef((track, trigger) => {
    return {
      get() {
        // 告诉Vue追踪数据
        track()
        return value
      },
      set(newValue: T) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          // 告诉Vue去触发界面更新
          trigger()
        }, delay)
      }
    }
  })
}

</script>
```


---

#### provide 与 inject
provide和inject提供依赖注入，功能类似 2.x 的provide/inject
实现跨层级组件(祖孙)间通信


+ 父组件
````html

<template>
  <h1>父组件</h1>
  <p>当前颜色: {{color}}</p>
  <button @click="color='red'">红</button>
  <button @click="color='yellow'">黄</button>
  <button @click="color='blue'">蓝</button>
  
  <hr>
  <Son />
</template>

<script lang="ts">
import { provide, ref } from 'vue'
/* 
- provide` 和 `inject` 提供依赖注入，功能类似 2.x 的 `provide/inject
- 实现跨层级组件(祖孙)间通信,这种方式不能用于兄弟组件
*/

import Son from './Son.vue'
export default {
  name: 'ProvideInject',
  components: {
    Son
  },
  setup() {
    
    const color = ref('red')

    provide('color', color)

    return {
      color
    }
  }
}
</script>

```

+ 子组件

```html

<template>
  <div>
    <h2>子组件</h2>
    <hr>
    <GrandSon />
  </div>
</template>

<script lang="ts">
import GrandSon from './GrandSon.vue'
export default {
  components: {
    GrandSon
  },
}
</script>

```

+ 孙子组件

```html

<template>
  <h3 :style="{color}">孙子组件: {{color}}</h3>
  
</template>

<script lang="ts">
import { inject } from 'vue'
export default {
  setup() {
    const color = inject('color')

    return {
      color
    }
  }
}
</script>

```

---


#### 响应式数据的判断

+ isRef: 检查一个值是否为一个 ref 对象
+ isReactive: 检查一个对象是否是由 reactive 创建的响应式代理
+ isReadonly: 检查一个对象是否是由 readonly 创建的只读代理
+ isProxy: 检查一个对象是否是由 reactive 或者 readonly 方法创建的代理


#### Teleport(瞬移)
Teleport 提供了一种干净的方法, 让组件的html在父组件界面外的特定标签(很可能是body)下插入显示

```html

<template>
  <button @click="modalOpen = true">
      Open full screen modal! (With teleport!)
  </button>

  <teleport to="body">
    <div v-if="modalOpen" class="modal">
      <div>
        I'm a teleported modal! 
        (My parent is "body")
        <button @click="modalOpen = false">
          Close
        </button>
      </div>
    </div>
  </teleport>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'modal-button',
  setup () {
    const modalOpen = ref(false)
    return {
      modalOpen
    }
  }
}
</script>
```


##### Suspense

> 它们允许我们的应用程序在等待异步组件时渲染一些后备内容，可以让我们创建一个平滑的用户体验

父组件
```html
<template>
  <Suspense>
    <template v-slot:default>
      <AsyncComp/>
      <!-- <AsyncAddress/> -->
    </template>

    <template v-slot:fallback>
      <h1>LOADING...</h1>
    </template>
  </Suspense>
</template>

<script lang="ts">
/* 
异步组件 + Suspense组件
*/
// import AsyncComp from './AsyncComp.vue'
import AsyncAddress from './AsyncAddress.vue'
import { defineAsyncComponent } from 'vue'
// vue3中的异步组件导入方式
const AsyncComp = defineAsyncComponent(() => import('./AsyncComp.vue'))
export default {
  setup() {
    return {
     
    }
  },

  components: {
    AsyncComp,
    AsyncAddress
  }
}
</script>

```

子组件
```html
<template>
  <h2>AsyncComp22</h2>
  <p>{{msg}}</p>
</template>

<script lang="ts">
import axios from 'axios'

export default {
  name: 'AsyncComp',
  setup () {
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve({
    //       msg: 'abc'
    //     })
    //   }, 2000)
    // })

    // 也可以这么写
    // return axios.get('/url').then((res) => {
    //   return {
    //     data: res.data
    //   }
    // })
    // 也可以这么写
    // const res = await axios.get('url')
    // return {
    //   data: res.data
    // }
    
    return {
      msg: 'abc'
    }
  }
}
</script>

```

