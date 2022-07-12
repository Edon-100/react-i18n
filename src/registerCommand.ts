import * as vscode from "vscode";
import { registerTransformToI18n } from "./commands/transformToI18n";

export function registerCommand(ctx: vscode.ExtensionContext) {
  registerTransformToI18n(ctx);
}
