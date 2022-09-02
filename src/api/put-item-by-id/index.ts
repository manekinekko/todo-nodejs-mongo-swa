import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import mongoose from "mongoose";
import { initializeConfiguration } from "../config";
import { TodoItem, TodoItemModel } from "../models/todoItem";

const putListById: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    await initializeConfiguration();

    const item: TodoItem = {
      ...req.body,
      id: req.params.itemId,
      listId: req.params.listId,
    };

    await TodoItemModel.validate(item);
    const updated = await TodoItemModel.findOneAndUpdate(
      { _id: item.id },
      item,
      { new: true }
    )
      .orFail()
      .exec();

    context.res = {
      body: updated,
    };
  } catch (err: any) {
    switch (err.constructor) {
      case mongoose.Error.ValidationError:
        context.res = {
          status: 400,
          body: err.errors,
        };
        break;
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

export default putListById;
