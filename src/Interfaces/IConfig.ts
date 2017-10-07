import IAlias from "./IAlias";

export default interface IConfig {
  templatePath: string;
  parameters?: { [key: string]: any };
  alias?: {
    [key: string]: IAlias
  }
};
