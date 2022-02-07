# vue3

## 创建项目
```
vue create vue3
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


#### 编译报错

`Parsing error: Unexpected token`

接口没有加分号导致的

```ts
// 错误
interface Pos {
  x: Ref<number>
  y: Ref<number>
}

// 正确
interface Pos {
  x: Ref<number>;
  y: Ref<number>;
}

```
