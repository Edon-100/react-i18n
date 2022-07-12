import { getSelectionType } from "../../utils/transformToI18n";
import * as vs from "vscode";
import { posix } from "path";
import * as fs from "fs";
import { TRANSFORM_TO_I18N_COMMAND } from "../../utils/constants";
import { replaceStringCalculator } from "./replaceStringCalculator";

export function registerTransformToI18n(ctx: vs.ExtensionContext) {
  const disposable = vs.commands.registerCommand(
    TRANSFORM_TO_I18N_COMMAND,
    async () => {
      vs.window.showInformationMessage("transformToI18n running");
      let editor = vs.window.activeTextEditor;
      if (!editor) {
        return; // No open text editor
      }
      editor.edit(async (edit: vs.TextEditorEdit) => {
        for (let selection of editor?.selections ?? []) {
          const selectionText = editor?.document.getText(selection) || "";
          if (!selectionText) {
            return;
          }
          const selectionType = getSelectionType(selectionText);
          const { jsonKey, replaceString, jsonValue } =
            replaceStringCalculator[selectionType](selectionText);
          edit.replace(selection, replaceString);

          /* write data to json file */
          const folderUri = vs.workspace.workspaceFolders?.[0].uri;
          if (!folderUri) {
            return;
          }
          const fileName = `${
            vs.workspace.workspaceFolders?.[0].name ?? "prj"
          }-translation.json`;
          const fileUri = folderUri.with({
            path: posix.join(folderUri.path, fileName),
          });

          // if file exists, add data
          if (fs.existsSync(fileUri.path)) {
            const readData = await vs.workspace.fs.readFile(fileUri);
            const readStr = Buffer.from(readData).toString("utf8");
            const oldObj = JSON.parse(readStr);
            oldObj[jsonKey] = jsonValue;

            const writeStr = JSON.stringify(oldObj, null, 4);
            const writeData = Buffer.from(writeStr, "utf8");
            await vs.workspace.fs.writeFile(fileUri, writeData);
            // vs.window.showTextDocument(fileUri);
          } else {
            // if file not exists
            const data: any = {};
            data[jsonKey] = jsonValue;
            const writeStr = JSON.stringify(data, null, 4);
            const writeData = Buffer.from(writeStr, "utf8");
            await vs.workspace.fs.writeFile(fileUri, writeData);
          }
          /* ------------ */
          vs.window.showInformationMessage(`${jsonKey}:${jsonValue}`);
        }
      });
    }
  );
  ctx.subscriptions.push(disposable);
}
