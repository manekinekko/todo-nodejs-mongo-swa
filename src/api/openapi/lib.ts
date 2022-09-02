import { htmlTplString } from "./tpl";

function stringify(obj) {
  var placeholder = "____FUNCTIONPLACEHOLDER____";
  var fns = [];
  var json = JSON.stringify(
    obj,
    function (key, value) {
      if (typeof value === "function") {
        fns.push(value);
        return placeholder;
      }
      return value;
    },
    2
  );
  json = json.replace(new RegExp('"' + placeholder + '"', "g"), function (_) {
    return fns.shift();
  });
  return "let options = " + json + ";";
}

export function generateHTML(swaggerDoc: any, options: any) {
  var initOptions = {
    swaggerDoc: swaggerDoc || undefined,
    customOptions: options,
  };
  return htmlTplString.replace(
    "<% swaggerOptions %>",
    stringify(initOptions)
  );
}
