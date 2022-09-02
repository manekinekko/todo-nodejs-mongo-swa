import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import mongoose from "mongoose";
import { initializeConfiguration } from "../config";
import { TodoListModel } from "../models/todoList";

const getListById: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    await initializeConfiguration();

    const list = await TodoListModel.findById(req.params.listId)
      .orFail()
      .exec();

    context.res = {
      body: list,
    };
  } catch (err: any) {
    switch (err.constructor) {
      case mongoose.Error.CastError:
      case mongoose.Error.DocumentNotFoundError:
        context.res = {
          status: 404,
        };
        break;
      default:
        context.res = {
          status: 500,
        };
        throw err;
    }
  }
};

export default getListById;
