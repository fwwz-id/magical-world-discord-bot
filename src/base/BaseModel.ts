import { LogicalException } from "@exception/index";

export default abstract class BaseModel {
  protected abstract _model: unknown;

  get model() {
    if (!this._model) {
      throw new LogicalException("Model is not implemented");
    }

    return this._model;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract create(...args: any): unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract update(...args: any): unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract delete(...args: any): unknown;
}
