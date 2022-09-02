import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import mongoose from "mongoose";
import { initializeConfiguration } from "../config";
import { TodoListModel } from "../models/todoList";

const deleteListById: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    await initializeConfiguration();

    await TodoListModel.findByIdAndDelete(req.params.listId, {})
      .orFail()
      .exec();

    context.res = {
      status: 204,
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
        throw err;
    }
  }
};

export default deleteListById;
