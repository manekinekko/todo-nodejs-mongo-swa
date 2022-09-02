import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import mongoose from "mongoose";
import { initializeConfiguration } from "../config";
import { TodoListModel } from "../models/todoList";

const postList: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    await initializeConfiguration();

    let list = new TodoListModel(req.body);
    list = await list.save();

    context.res = {
      headers: {
        location: `${req.headers.protocol}://${req.headers.host}/lists/${list.id}`,
      },
      status: 201,
      body: list,
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
