export type DefaultConfig = {
  language: language;
  generateFolder: Boolean;
  paradigm: paradigm;
  database: dbs;
  routing: routing;
  api: api;
};

type api = "graphql" | "rest";

type dbs = "mongo" | "mysql" | "postgresql" | "other";

type paradigm = "oop" | "functional";

type language = "ts" | "js";

type routing = "express" | "spring";
