import { selectionType } from "../../types";
import {
  generateCode,
  transformParamsToKeyString,
} from "../../utils/transformToI18n";

/* key: 翻译json文件的key, value: 替换的string, jsonValue: 翻译 json 文件的 value */
export const replaceStringCalculator: Record<
  selectionType,
  (str: string) => { jsonKey: string; replaceString: string; jsonValue: string }
> = {
  pureString: (selection: string) => {
    let formatedString = selection.replace(/['"]+/g, "");
    const translationKey = generateCode(formatedString);
    return {
      jsonKey: translationKey,
      jsonValue: formatedString,
      replaceString: `t('${translationKey}', '${formatedString}')`,
    };
  },
  stringWithParams: (selection: string) => {
    let replaceString = "";
    let formatedString = selection.replace(/`/g, ""); // 去除两边的 `
    formatedString = formatedString.replace(/\$/g, "");
    formatedString = formatedString.replace(/{/g, "{{");
    formatedString = formatedString.replace(/}/g, "}}");
    const translationKey = generateCode(formatedString);
    const keys = transformParamsToKeyString(formatedString);
    if (keys.length) {
      replaceString = `t('${translationKey}',{defaultValue: '${formatedString}', ${keys}})`;
    } else {
      replaceString = `t('${translationKey}', '${formatedString}')`;
    }
    return {
      jsonKey: translationKey,
      replaceString,
      jsonValue: formatedString,
    };
  },
  innerHtml: (selection: string) => {
    let replaceString = "";
    let formatedString = selection.replace(/{/g, "{{");
    formatedString = formatedString.replace(/}/g, "}}");
    formatedString = formatedString.replace(/\t/gm, "").trim();
    formatedString = formatedString.replace(/\n/gm, "");
    const translationKey = generateCode(formatedString);
    const keys = transformParamsToKeyString(formatedString);
    if (keys.length) {
      replaceString = `t('${translationKey}',{defaultValue: '${formatedString}', ${keys}})`;
    } else {
      replaceString = `t('${translationKey}', '${formatedString}')`;
    }
    return {
      jsonKey: translationKey,
      replaceString,
      jsonValue: formatedString,
    };
  },
};
