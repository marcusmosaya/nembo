export class HistoryManager {
    constructor() {
        this._undoStack = [];
        this._redoStack = [];
    }
    execute(cmd) {
        cmd.execute();
        this._undoStack.push(cmd);
        this._redoStack = [];
    }
    topOfStack() {
        return this._undoStack[0];
    }
    undo() {
        const command = this._undoStack.pop();
        if (command) {
            command.undo();
            this._redoStack.push(command);
        }
        else {
            console.log("Nothing to undo.");
        }
    }
    redo() {
        const command = this._redoStack.pop();
        if (command) {
            command.execute();
            this._undoStack.push(command);
        }
        else {
            console.log("Nothing to redo.");
        }
    }
}
