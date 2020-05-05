require('./style.scss');

class SubjectEditorPlugin {
  constructor (props) {
    this.props = props;
    this.Map = {
      1: '单选题',
      2: '多选题',
      3: '填空题',
      4: '附件上传'
    }
    this.subjects = {};
    this.init();
  };

  init () {
    this.appendHTML(document.querySelector(this.props.el), '<div class="subject-editor-container"><div class="subject-btn-wrap add-subject-wrap-hook"><button class="ant-btn add-subject-btn">添加题库</button></div></div>');

    if (this.props.initData) {
      this.props.initData = Object.prototype.toString.call(this.props.initData).indexOf("String") > -1 ? JSON.parse(this.props.initData) : this.props.initData;
      this.props.initData.forEach((item, index) => {
        this.addSubject();
        let subjectDOM = document.querySelectorAll(`.subject-wrap`)[index];
        subjectDOM.querySelector('.subject-edit-mode .subject-title-input').value = item.title;
        subjectDOM.querySelector('.subject-edit-mode .subject-type-selector').value = item.type;
        if (+item.type == 1 || +item.type == 2) {
          subjectDOM.querySelector(`.multiple-choice-edit-wrap`).style.display = 'block';
          subjectDOM.querySelector(`.required-wrap`).style.display = 'none';
        } else {
          subjectDOM.querySelector(`.multiple-choice-edit-wrap`).style.display = 'none';
          subjectDOM.querySelector(`.required-wrap`).style.display = 'flex';
        }
        subjectDOM.querySelector('.subject-edit-mode .multiple-choice-item-wrap').innerHTML = "";
        for (let i = 0; i < item.options.length; i++) {
          let str = `<div class="multiple-choice-item">
          <input type="text" class="ant-input" value="${item.options[i]}"/>
          <div class="btns-wrap tc">
            <img src="${require('./images/icon_tianjia.png').default}" alt="添加" class="add-choice-item-btn" />
            <img src="${require('./images/icon_jianshao.png').default}" alt="减少" class="remove-choice-item-btn" />
            <img src="${require('./images/icon_shangyi.png').default}" alt="上移" class="up-choice-item-btn" />
            <img src="${require('./images/icon_xiayi.png').default}" alt="下移" class="down-choice-item-btn" />
          </div>
        </div>`;
          this.appendHTML(subjectDOM.querySelector('.subject-edit-mode .multiple-choice-item-wrap'), str);
        }

        let requiredRadio = subjectDOM.querySelectorAll(`.subject-edit-mode input[name='required']`);
        item.required ? (requiredRadio[0].checked = true) : (requiredRadio[1].checked = true);
        this.saveSubject(index);
      });
    }

    this.addEventListener();
  };

  appendHTML (el, html) {
    let divTemp = document.createElement("div");
    let nodes = null;
    let fragment = document.createDocumentFragment();
    divTemp.innerHTML = html;
    nodes = divTemp.childNodes;
    for (let i = 0; i < nodes.length; i++) {
      fragment.appendChild(nodes[i].cloneNode(true));
    }
    el.appendChild(fragment);
    // 内存回收
    nodes = null;
    fragment = null;
  };

  insertAfter (targetElement, html) {
    let divTemp = document.createElement("div");
    divTemp.innerHTML = html;
    const newElement = divTemp.querySelector("div");
    const parent = targetElement.parentNode;
    // 如果要插入的目标元素是其父元素的最后一个元素节点，直接插入该元素
    // 否则，在目标元素的下一个兄弟元素之前插入
    if (parent.lastChild == targetElement) {
      parent.appendChild(newElement);
    } else {
      parent.insertBefore(newElement, targetElement.nextSibling);
    }
  };

  addSubject (e, type) {
    const subjectIndex = Object.keys(this.subjects).length;
    this.subjects[subjectIndex] = {
      type: 1,
      required: false,
      title: '',
      options: []
    };
   
    const str = `<div class="subject-wrap subject${subjectIndex}" data-index="${subjectIndex}">
    <div class="subject-read-mode">
      <div class="subject-title">
        <span class="subject-title-main"><span>${subjectIndex + 1}</span></span>
        <span class="red subject-title-type"></span>
      </div>
      <div class="multiple-choice-wrap">
      </div>
      <div class="operate-wrap">
        <div class="insert-btn">
          <span class="insert-subject-btn">在此题后插入新题</span>
        </div>
        <div class="operate-btn">
          <button class="ant-btn edit-btn">编辑</button>
          <button class="ant-btn delete-btn">删除</button>
          <button class="ant-btn up-btn">上移</button>
          <button class="ant-btn down-btn">下移</button>
        </div>
      </div>
    </div>
    <div class="subject-edit-mode">
        <div class="subject-type">
          <div class="select">
            <label>题目类型：</label>
            <select class="subject-type-selector" >
              <option value="1">单选题</option>
              <option value="2">多选题</option>
              <option value="3">填空题</option>
              <option value="4">附件上传</option>
            </select>
          </div>
        </div>
        <div class="subject-title">
          <div>题目：</div>
          <input type="text" class="ant-input subject-title-input" />
        </div>
        <div class="multiple-choice-wrap multiple-choice-edit-wrap">
          <div class="multiple-choice-title">
            <span>选项文字</span>
            <span class="tc">选项顺序</span>
          </div>
          <div class="multiple-choice-item-wrap">
            <div class="multiple-choice-item">
              <input type="text" class="ant-input" />
              <div class="btns-wrap tc">
                <img src="${require('./images/icon_tianjia.png').default}" alt="添加" class="add-choice-item-btn" />
                <img src="${require('./images/icon_jianshao.png').default}" alt="减少" class="remove-choice-item-btn" />
                <img src="${require('./images/icon_shangyi.png').default}" alt="上移" class="up-choice-item-btn" />
                <img src="${require('./images/icon_xiayi.png').default}" alt="下移" class="down-choice-item-btn" />
              </div>
            </div>
          </div>
        </div>
        <div class="required-wrap">
          <div>是否必填：</div>
          <div class="checkbox-group">
            <div class="checkbox">
              <input type="radio" name="required" value=true>
              <label>是</label>
            </div>
            <div class="checkbox">
              <input type="radio" name="required" value=false checked>
              <label>否</label>
            </div>
          </div>
        </div>
        <div class="subject-btn-wrap">
          <button class="ant-btn ant-btn-primary edit-done-btn">编辑完成</button>
        </div>
      </div>
    </div>`;

    if (type == 'insert') {
      let targetElement = e.path[4];
      this.insertAfter(targetElement, str);
      this.resortSubject(targetElement.getAttribute('data-index'), 'insert');
    } else {
      this.appendHTML(document.querySelector('.subject-editor-container'), str);
    }
    
    document.querySelector('.add-subject-wrap-hook').style.display = 'none';
  };

  deleteSubject (e) {
    const subjectIndex = +(e.path[4].getAttribute('data-index'));
    document.querySelector(`.subject${subjectIndex}`).remove();
    delete this.subjects[subjectIndex];
    this.resortSubject(subjectIndex - 1, 'delete');
  };

  moveSubject (direction, e) {
    const currIndex = +(e.path[4].getAttribute("data-index"));
    let subjectsDOM = document.querySelectorAll('.subject-wrap');
    if (direction == 'up') {
      if (currIndex == 0) {
        return;
      }
      e.path[5].insertBefore(e.path[4], e.path[4].previousSibling);
      this.resortSubject(currIndex - 2);

      let tempSubjectData = this.subjects[currIndex];
      this.subjects[currIndex] = this.subjects[currIndex - 1];
      this.subjects[currIndex - 1] = tempSubjectData;

    } else {
      if (currIndex == subjectsDOM.length - 1) {
        return;
      }
      e.path[5].insertBefore(e.path[4].nextSibling, e.path[4]);
      this.resortSubject(currIndex - 1);

      let tempSubjectData = this.subjects[currIndex];
      this.subjects[currIndex] = this.subjects[currIndex + 1];
      this.subjects[currIndex + 1] = tempSubjectData;
    }
  };

  resortSubject (startIndex, type) {
    let subjectsDOM = document.querySelectorAll('.subject-wrap');
    for (let i = +startIndex + 1; i < subjectsDOM.length; i++) {
      const prevIndex = i - 1;
      subjectsDOM[i].setAttribute("class", `subject-wrap subject${prevIndex + 1}`);
      subjectsDOM[i].setAttribute("data-index", prevIndex + 1);
      subjectsDOM[i].querySelector('.subject-read-mode .subject-title .subject-title-main span').innerHTML = prevIndex + 2;

      if (type == 'delete') {
        this.subjects[+startIndex + 1] = this.subjects[+startIndex + 2];
        i != subjectsDOM.length && delete this.subjects[subjectsDOM.length];
      } else if (type == 'insert') {
        this.subjects[+startIndex + 2] = this.subjects[+startIndex + 1];
      }
    }
  };

  toggleSubjectMode (subjectIndex) {
    if (getComputedStyle(document.querySelector(`.subject${subjectIndex} .subject-read-mode`), null).getPropertyValue("display") == 'none') {
      document.querySelector(`.subject${subjectIndex} .subject-read-mode`).style.display = 'block';
      document.querySelector(`.subject${subjectIndex} .subject-edit-mode`).style.display = 'none';
    } else {
      document.querySelector(`.subject${subjectIndex} .subject-read-mode`).style.display = 'none';
      document.querySelector(`.subject${subjectIndex} .subject-edit-mode`).style.display = 'block';
    }
  };

  saveSubject (subjectIndex) {
    let options = [];
    const choiceItems = document.querySelectorAll(`.subject${subjectIndex} .multiple-choice-edit-wrap input`);
    document.querySelector(`.subject${subjectIndex} .multiple-choice-wrap`).innerHTML = "";
    this.subjects[subjectIndex] = {
      type: +document.querySelector(`.subject${subjectIndex} .subject-type-selector`).value,
      required: JSON.parse(document.querySelector(`.subject${subjectIndex} input[name='required']:checked`)?.value || 'false'),
      title: document.querySelector(`.subject${subjectIndex} .subject-title-input`).value,
      options: options
    };
    if (this.subjects[subjectIndex].type == 1 || this.subjects[subjectIndex].type == 2) {
      choiceItems.forEach((element, index) => {
        this.subjects[subjectIndex].options.push(element.value);
        this.appendHTML(document.querySelector(`.subject${subjectIndex} .multiple-choice-wrap`), `<div class="checkbox">
          <input type="radio" disabled>
          <label>${element.value}</label>
        </div>`);
      });
    }
    document.querySelector(`.subject${subjectIndex} .subject-title-main`).innerHTML = "";
    this.appendHTML(document.querySelector(`.subject${subjectIndex} .subject-title-main`), `<span>${subjectIndex + 1}</span>${this.subjects[subjectIndex].title}`);
    document.querySelector(`.subject${subjectIndex} .subject-title-type`).innerHTML = `[${this.Map[this.subjects[subjectIndex].type]}]`;
    this.subjects[subjectIndex].required && document.querySelector(`.subject${subjectIndex} .subject-title`).classList.add("required");
    this.toggleSubjectMode(subjectIndex);
  };

  moveChoiceItem (direction, e) {
    const previousElementSibling = e.path[2].previousElementSibling;
    const nextElementSibling = e.path[2].nextElementSibling;
    const context = direction == 'up' ? previousElementSibling : nextElementSibling;
    if (!context) {
      return;
    }
    const tempValue = e.path[2].querySelector('input').value;
    e.path[2].querySelector('input').value = context.querySelector('input').value;
    context.querySelector('input').value = tempValue;
  };

  addEventListener () {
    document.querySelector('.subject-editor-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('add-subject-btn')) {
        this.addSubject(e);
      }

      if (e.target.classList.contains('insert-subject-btn')) {
        const subjectIndex = +e.path[4].getAttribute('data-index');
        this.addSubject(e, (subjectIndex + 1) == Object.keys(this.subjects).length ? 'append' : 'insert');
      }

      if (e.target.classList.contains('edit-done-btn')) {
        this.saveSubject(+(e.path[3].getAttribute('data-index')));
      }

      if (e.target.classList.contains('edit-btn')) {
        this.toggleSubjectMode(e.path[4].getAttribute('data-index'));
      }

      if (e.target.classList.contains('delete-btn')) {
        this.deleteSubject(e);
      }

      if (e.target.classList.contains('up-btn')) {
        this.moveSubject('up', e);
      }

      if (e.target.classList.contains('down-btn')) {
        this.moveSubject('down', e);
      }

      if (e.target.classList.contains('add-choice-item-btn')) {
        const subjectIndex = e.path[6].getAttribute('data-index');
        let str = `<div class="multiple-choice-item">
          <input type="text" class="ant-input" />
          <div class="btns-wrap tc">
            <img src="${require('./images/icon_tianjia.png').default}" alt="添加" class="add-choice-item-btn" />
            <img src="${require('./images/icon_jianshao.png').default}" alt="减少" class="remove-choice-item-btn" />
            <img src="${require('./images/icon_shangyi.png').default}" alt="上移" class="up-choice-item-btn" />
            <img src="${require('./images/icon_xiayi.png').default}" alt="下移" class="down-choice-item-btn" />
          </div>
        </div>`;
        this.appendHTML(document.querySelector(`.subject${subjectIndex} .multiple-choice-item-wrap`), str);
      }

      if (e.target.classList.contains('remove-choice-item-btn')) {
        e.path[2].previousElementSibling && e.path[2].remove();
      }

      if (e.target.classList.contains('up-choice-item-btn')) {
        this.moveChoiceItem('up', e);
      }

      if (e.target.classList.contains('down-choice-item-btn')) {
        this.moveChoiceItem('down', e);
      }
    });

    document.querySelector('.subject-editor-container').addEventListener('change', (e) => {
      if (e.target.classList.contains('subject-type-selector')) {
        let subjectIndex = e.path[4].getAttribute('data-index');
        if (+e.target.value == 1 || +e.target.value == 2) {
          document.querySelector(`.subject${subjectIndex} .multiple-choice-edit-wrap`).style.display = 'block';
          document.querySelector(`.subject${subjectIndex} .required-wrap`).style.display = 'none';
        } else {
          document.querySelector(`.subject${subjectIndex} .multiple-choice-edit-wrap`).style.display = 'none';
          document.querySelector(`.subject${subjectIndex} .required-wrap`).style.display = 'flex';
        }
      }

    });
  };

  getSubjects () {
    let res = [];
    for (let key in this.subjects) {
      res.push(this.subjects[key]);
    }
    return res;
  }

}

module.exports = SubjectEditorPlugin;
