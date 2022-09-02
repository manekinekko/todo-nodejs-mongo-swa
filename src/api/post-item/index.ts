import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import mongoose from "mongoose";
import { initializeConfiguration } from "../config";
import { TodoItem, TodoItemModel } from "../models/todoItem";

const postList: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    await initializeConfiguration();

    const item: TodoItem = {
      ...req.body,
      listId: req.params.listId,
    };

    let newItem = new TodoItemModel(item);
    newItem = await newItem.save();

    context.res = {
      headers: {
        location: `${req.headers.protocol}://${req.headers.host}/lists/${req.params.listId}/${newItem.id}`,
      },
      status: 201,
      body: newItem,
    };
  } catch (err: any) {
    switch (err.constructor) {
      case mongoose.Error.CastError:
      case mongoose.Error.ValidationError:
        context.res = {
          status: 400,
          body: err.errors,
        };
        break;
      default:
        throw err;
    }
  }
};

export default postList;
