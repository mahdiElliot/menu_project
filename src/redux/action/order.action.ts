import { Order } from "../../models/Order.model";
import { SAVE_ORDER, SaveOrderAction } from "../reducer/order.reducer";

export const saveOrder = (data: Order): SaveOrderAction => ({
  type: SAVE_ORDER,
  data,
});
