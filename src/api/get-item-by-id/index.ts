import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import mongoose from "mongoose";
import { initializeConfiguration } from "../config";
import { TodoItemModel } from "../models/todoItem";

const getListById: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    await initializeConfiguration();

    const list = await TodoItemModel.findOne({
      _id: req.params.itemId,
      listId: req.params.listId,
    })
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
