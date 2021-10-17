import { IEditorAdapter, IPlainTextOperation } from '@hackerrank/firepad';

class HeadlessAdapter implements IEditorAdapter {
  protected _content: string;

  constructor() {
    this._content = '';
  }
  on(): void {
    return;
  }
  off(): void {
    return;
  }
  registerUndo(): void {
    return;
  }
  registerRedo(): void {
    return;
  }
  deregisterUndo(): void {
    return;
  }
  deregisterRedo(): void {
    return;
  }
  getCursor(): ICursor | null {
    return null;
  }
  setCursor(): void {
    return;
  }
  setOtherCursor(): IDisposable {
    return {
      dispose: () => {
        return;
      },
    };
  }
  getText(): string {
    return this._content;
  }
  setText(text: string): void {
    this._content = text;
  }
  setInitiated(): void {
    return;
  }
  applyOperation(operation: IPlainTextOperation): void {
    if (!operation.isNoop()) {
      return;
    }
    this._content = operation.apply(this._content);
  }
  invertOperation(operation: IPlainTextOperation): IPlainTextOperation {
    return operation.invert(this._content);
  }
  dispose(): void {
    return;
  }
}

export default HeadlessAdapter;
