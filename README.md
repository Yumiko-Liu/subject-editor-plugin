# subject-editor-plugin

> 类似问卷星调查问卷的问题编辑器（包括单选题，多选题，填空题，附件上传）

> 示例：[https://yumiko-liu.github.io/subject-editor-plugin/](https://yumiko-liu.github.io/subject-editor-plugin/)

## 开始

浏览器环境：

```html
<script src="subject-editor-plugin.js"></script>
<script>
  var subjectEditor = new SubjectEditorPlugin({
    el: '#demo',
  });
</script>
```

通过 npm：

```bash
npm i subject-editor-plugin --save
```

```js
import SubjectEditorPlugin from 'subject-editor-plugin';
const subjectEditor = new SubjectEditorPlugin({
  el: '#demo',
});
```

## 方法

event name | description | parameter of callback
--- | --- | ---
getSubjects | 获取题目数据 | 

## 参数

option | description | type | default | e.g.
--- | --- | --- | --- | ---
el | 要挂载的dom选择器 | String | | "#demo"
initData | 初始题目数据 | Array | [] | [{ options: ["雪碧", "雷碧"], required: false, title: "你最爱的饮料?", type: 1 }]

> 关于 `type` ：1: 单选题  2: 多选题  3: 填空题  4: 附件上传 
