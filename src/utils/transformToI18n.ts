import * as crypto from "crypto";
import { upperCase, snakeCase } from "lodash";
import { selectionType } from "../types";

export const generateCode = (text: string) => {
  const hash = crypto.createHash("md5").update(text).digest("hex");
  return text
    ? `${upperCase(snakeCase(text.slice(0, 10)))}_${hash.slice(0, 5)}`.replace(
        /\s/g,
        "_"
      )
    : text;
};

export const getSelectionType = (selection: string): selectionType => {
  if (selection.startsWith("'") || selection.startsWith('"')) {
    return "pureString";
  }
  if (
    !selection.startsWith("'") &&
    !selection.startsWith('"') &&
    !selection.startsWith("`")
  ) {
    return "innerHtml";
  }
  if (selection.startsWith("`")) {
    return "stringWithParams";
  }
  return "pureString";
};

export const transformParamsToKeyString = (text: string): string => {
  let str,
    keyString = "";
  var regex = /{{(.+?)}}/g;
  const res = text.match(/{{(.+?)}}/); // 用于判断是否有 {{name}} 的变量
  if (res?.length) {
    // 如果有则逐个处理,把 key 起来
    while ((str = regex.exec(text))) {
      const key = str[1];
      keyString += `${key},`;
    }
    keyString = keyString.substr(0, keyString.length - 1);
    return keyString;
  } else {
    return "";
  }
};
