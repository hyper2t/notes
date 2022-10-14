var codeFileType = "txt|txt\njavascript|js,jsx\nc|cpp,h\npython|py"

let CODE_LANGS_CONFIG = {};
let CODE_EXT = []
let code_list = codeFileType.split("\n");
for (let i = 0; i < code_list.length; i++) {
    let code_item = code_list[i].split("|");
    let code_type = code_item[0];
    let code_ext = code_item[1].split(",");

    for (let j = 0; j < code_ext.length; j++) {
        console.log(code_ext[j])
        CODE_LANGS_CONFIG[code_ext[j]] = code_type;
        CODE_EXT.push(code_ext[j]);
    }
}
console.log(CODE_EXT)
// console.log('py'.split(","))