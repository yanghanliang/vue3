import { ref, onMounted, onUnmounted } from 'vue'
/* 
收集用户鼠标点击的页面坐标
*/
interface Ref<T> {
  value: T;
}

interface Pos {
  x: Ref<number>;
  y: Ref<number>;
}

export default function useMousePosition (): Pos {
  // 初始化坐标数据
  const x: Ref<number> = ref(-1)
  const y: Ref<number> = ref(-1)

  // 用于收集点击事件坐标的函数
  const updatePosition = (e: MouseEvent) => {
    x.value = e.pageX
    y.value = e.pageY

    console.log(e,'e')
  }

  // 挂载后绑定点击监听
  onMounted(() => {
    document.addEventListener('click', updatePosition)
  })

  // 卸载前解绑点击监听
  onUnmounted(() => {
    document.removeEventListener('click', updatePosition)
  })

  return {x, y}
}