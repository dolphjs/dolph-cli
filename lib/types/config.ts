export type DefaultConfig = {
  language: language;
  generateFolder: Boolean;
  paradigm: paradigm;
  database: dbs;
};

type dbs = "mongo" | "mysql" | "postgresql" | "other";

type paradigm = "oop" | "functional";

type language = "ts" | "js";
