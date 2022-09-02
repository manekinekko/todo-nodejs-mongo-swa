import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { initializeConfiguration } from "../config";
import { TodoListModel } from "../models/todoList";

const getLists: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    await initializeConfiguration();

    const query = TodoListModel.find();
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const top = req.query.top ? parseInt(req.query.top) : 20;
    const lists = await query.skip(skip).limit(top).exec();

    context.res = {
      body: lists,
    };
  } catch (err: any) {
    context.res = {
      status: 500,
      body: err.errors,
    };
    throw err;
  }
};

export default getLists;
