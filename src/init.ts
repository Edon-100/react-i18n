import * as vscode from "vscode";
import { registerCommand } from "./registerCommand";

export function init(ctx: vscode.ExtensionContext) {
  registerCommand(ctx);
}
