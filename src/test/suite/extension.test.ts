import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import { replaceStringCalculator } from "../../commands/transformToI18n/replaceStringCalculator";
import { generateCode, getSelectionType } from "../../utils/transformToI18n";
// import * as myExtension from '../../extension';

suite("getSelectionType", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("pureString", () => {
    const type = getSelectionType("'hello word'");
    const type2 = getSelectionType(`"hello word"`);
    assert.strictEqual(type, "pureString");
    assert.strictEqual(type2, "pureString");
  });
  test("stringWithParams", () => {
    const type = getSelectionType("`hello ${wordl}`");
    assert.strictEqual(type, "stringWithParams");
  });
  test("innerHTML", () => {
    const type = getSelectionType("hello world");
    assert.strictEqual(type, "innerHtml");
  });
});

suite("replace result", () => {
  test("pureString result start with single quote", () => {
    const text = "'hello world'";
    const type = getSelectionType(text);
    const { jsonKey, replaceString, jsonValue } =
      replaceStringCalculator[type](text);
    const key = generateCode(jsonValue);
    // replaceString like t('HELLO_WORL_5eb63', 'hello world')
    assert.strictEqual(replaceString, `t('${key}', 'hello world')`);
  });

  test("pureString result start with double quote", () => {
    const text = `"hello world"`;
    const type = getSelectionType(text);
    const { jsonKey, replaceString, jsonValue } =
      replaceStringCalculator[type](text);
    const key = generateCode(jsonValue);
    // replaceString like t('HELLO_WORL_5eb63', 'hello world')
    assert.strictEqual(replaceString, `t('${key}', 'hello world')`);
  });

  test("pureString result start with double quote", () => {
    const text = "`hello world`";
    const type = getSelectionType(text);
    const { jsonKey, replaceString, jsonValue } =
      replaceStringCalculator[type](text);
    const key = generateCode(jsonValue);
    // replaceString like t('HELLO_WORL_5eb63', 'hello world')
    assert.strictEqual(replaceString, `t('${key}', 'hello world')`);
  });

  test("stringWithParams result with param", () => {
    const text = "`hello world ${name}`";
    const type = getSelectionType(text);
    const { jsonKey, replaceString, jsonValue } =
      replaceStringCalculator[type](text);
    const key = generateCode(jsonValue);
    // replaceString like t('HELLO_WORL_80f4b',{defaultValue: 'hello world {{name}}', name})
    assert.strictEqual(
      replaceString,
      `t('${key}',{defaultValue: 'hello world {{name}}', name})`
    );
  });

  test("stringWithParams result with patams", () => {
    const text = "`hello ${name} world, ${age}`";
    const type = getSelectionType(text);
    const { jsonKey, replaceString, jsonValue } =
      replaceStringCalculator[type](text);
    const key = generateCode(jsonValue);
    // replaceString like t('HELLO_WORL_80f4b',{defaultValue: 'hello world {{name}}', name})
    assert.strictEqual(
      replaceString,
      `t('${key}',{defaultValue: 'hello {{name}} world, {{age}}', name,age})`
    );
  });
});
