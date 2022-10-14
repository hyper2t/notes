// 'use strict';



// const Prism = require ("./js/prism.js")
// import Prism from 'prismjs';
// lessc styles.less styles.css



var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = target => __defProp(target, "__esModule", {
  value: true,
});
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all) __defProp(target, name, {
    get: all[name],
    enumerable: true,
  });
};
var __reExport = (target, module2, desc) => {
  if ((module2 && typeof module2 === "object") || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default") __defProp(target, key, {
        get: () => module2[key],
        enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable,
      });
  }
  return target;
};
var __toModule = module2 => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {
    get: () => module2.default,
    enumerable: true,
  } : {
    value: module2,
    enumerable: true,
  })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = value => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = value => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = x => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// main.ts
__export(exports, {
  default: () => MyPlugin,
});


var obs = __toModule(require("obsidian"));

var PLUGIN_SETTINGS = {
  codeTheme: "origin",
  codeFileType: "js|javascript\ncpp,h|c",
};


const CODE_THEMES = {
  ORIGIN: "origin",
  COY: 'cop',
  DARK: 'dark',
  FUNKY: 'funky',
  OKAIDIA: 'okaidia',
  SOLARIZEDLIGHT: 'solarizedlight',
  TOMORROW: 'tomorrow',
  TWILIGHT: 'twilight',
  CUSTOM: 'custom'
};


var dynamicLoading = {
  css: function (path) {
    if (!path || path.length === 0) {
      throw new Error('argument "path" is required !');
    }
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = path;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    head.appendChild(link);
  },
}

var addBodyClass = function (file_ext, theme) {
  let body = document.body;
  body.classList.add("yll-" + file_ext);
  body.classList.add("yll-code");
  body.classList.add("yll-code-" + theme)

}

var removeBodyClass = function (file_ext, theme) {
  let body = document.body;
  body.classList.remove("yll-" + file_ext);
  body.classList.remove("yll-code");
  body.classList.remove("yll-code-" + theme)
}




var MyPlugin = class extends obs.Plugin {


  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      this.addSettingTab(new PLUGIN_PANEL(this.app, this));

      const basepath = this.app.vault.adapter.basePath;
      const node_modules = basepath + "/.obsidian/plugins/obsidian-open-all-type-file-and-highlight/node_modules/"
      const Prism = require(node_modules + "prismjs/prism.js");
      const loadLanguages = require(node_modules + 'prismjs/components/');
      let CODE_LANGS_CONFIG = {};
      let CODE_EXT = []
      let code_list = this.settings['codeFileType'].split("\n");
      for (let i = 0; i < code_list.length; i++) {
        let code_item = code_list[i].split("|");
        let code_type = code_item[0];
        let code_ext = code_item[1].split(",");
        loadLanguages(CODE_LANGS_CONFIG[code_type]);
        for (let j = 0; j < code_ext.length; j++) {
          CODE_LANGS_CONFIG[code_ext[j]] = code_type;
          CODE_EXT.push(code_ext[j]);
        }
      }
      // dynamicLoading.css(node_modules + "prismjs/themes/prism-" + CODE_THEMES[this.settings['codeTheme']] + ".css");


      this.registerExtensions(CODE_EXT, "markdown");

      this.registerMarkdownPostProcessor(async (element, context) => {

        // let src_content = document.querySelectorAll(".cm-line");
        let file_ext = this.app.workspace.activeLeaf.app.workspace.activeLeaf.view.file.extension;

        // let preview = document.querySelector(".markdown-preview-section");

        // let res = ""
        // for(let i = 0; i < src_content.length; i++){
        //   let code = src_content[i].innerText;
        //   let html = Prism.highlight(code, Prism.languages.python);
        //   res += html;
        // }

        // let node = document.createElement("div");
        // node.className = "cm-s-yll";
        // node.innerHTML = res;
        // context.containerEl.innerHTML = res;
        
  

        // var src_content = document.querySelectorAll(".cm-line");

        if (file_ext != "md") {

          let ct = element.textContent.split("\n");
          let res = "";
          for (let i = 0; i < ct.length; i++) {
            let code = ct[i];
            if(code===""){
              res +=`<div class="yll-highlight-line yll-blank"></div>`
            }else{
      
              let html = Prism.highlight(code, Prism.languages[CODE_LANGS_CONFIG[file_ext]]);
              res += `<div class="yll-highlight-line">${html}</div>`
            }

          }
          element.innerHTML = res
        }
        // containerEl.childNodes[1].innerHTML = "11111";
      });


      this.app.workspace.on("active-leaf-change", () => {

        let file_ext = this.app.workspace.activeLeaf.app.workspace.lastOpenFiles[0].split(".").last();

        if (file_ext != "md") {
          removeBodyClass(file_ext, CODE_THEMES[this.settings['codeTheme']])
        }
      });



      this.app.workspace.on("file-open", () => {

        let file_ext = this.app.workspace.activeLeaf.app.workspace.activeLeaf.view.file.extension;
        if (file_ext != "md") {
          addBodyClass(file_ext, CODE_THEMES[this.settings['codeTheme']])
        }
      });

    });
  }
  onunload() {}

  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, PLUGIN_SETTINGS, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
};


// 设置面板
var PLUGIN_PANEL = class extends obs.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const {
      containerEl
    } = this;


    let code_theme_cache = this.plugin.settings["codeTheme"];


    containerEl.empty();
    containerEl.createEl("h2", {
      text: "自定义插件设置",
      cls: "ttt"
    });


    new obs.Setting(containerEl)
      .setName("Code Theme")
      .addDropdown((dropdown) => __awaiter(this, void 0, void 0, function* () {

        for (const key in CODE_THEMES) {
          dropdown.addOption(key, CODE_THEMES[key]);
        }

        dropdown.setValue(this.plugin.settings["codeTheme"]);
        dropdown.onChange((option) => __awaiter(this, void 0, void 0, function* () {

          let file_ext = this.app.workspace.activeLeaf.app.workspace.activeLeaf.app.workspace.activeLeaf.view.file.extension;

          this.plugin.settings["codeTheme"] = option;


          if (file_ext != "md") {
            document.body.classList.replace("yll-code-" + CODE_THEMES[code_theme_cache], "yll-code-" + CODE_THEMES[option]);
          }
          code_theme_cache = option


          yield this.plugin.saveSettings();
        }));
      }));

    var st2 = new obs.Setting(containerEl);

    st2.setName("File Type")
      .setClass("yll-code-file-type")
      .addTextArea(text => text.setValue(this.plugin.settings["codeFileType"])
        .onChange(value => __async(this, null, function* () {
          this.plugin.settings["codeFileType"] = value;
          yield this.plugin.saveSettings();
        })));
  }
};