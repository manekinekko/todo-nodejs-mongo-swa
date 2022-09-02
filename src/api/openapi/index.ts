import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { existsSync, readFileSync } from "fs";
import yaml from "yamljs";

import { generateHTML } from "./lib";

import * as swaggerUi from "swagger-ui-dist";

const openApi: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  let mimetype = "text/html";
  let fileContent = "";
  const filename = req.params.filename;
  if (filename) {
    const swaggerUiDistPath = swaggerUi.getAbsoluteFSPath();
    const filepath = swaggerUiDistPath + "/" + filename;
    if (!existsSync(filepath)) {
      context.res = {
        status: 404,
      };
      return;
    }

    fileContent = readFileSync(filepath).toString("utf8");

    if (filename.endsWith(".css")) {
      mimetype = "text/css";
    } else if (filename.endsWith(".js")) {
      mimetype = "application/javascript";
    } else if (filename.endsWith(".png")) {
      mimetype = "image/png";
    }
  } else {
    const swaggerDocument = yaml.load("openapi.yaml");
    fileContent = generateHTML(swaggerDocument, {});
  }

  context.res = {
    headers: {
      "content-type": `${mimetype}; charset=utf-8`,
    },
    body: fileContent,
  };
};

export default openApi;
