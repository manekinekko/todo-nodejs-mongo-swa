import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import mongoose from "mongoose";
import { initializeConfiguration } from "../config";
import { TodoList, TodoListModel } from "../models/todoList";

const putListById: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    await initializeConfiguration();

    const list: TodoList = {
      ...req.body,
      id: req.params.listId,
    };

    await TodoListModel.validate(list);
    const updated = await TodoListModel.findOneAndUpdate(
      { _id: list.id },
      list,
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
