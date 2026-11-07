import { skema_input_navigator } from "@voxera/contracts";
import { validasi_request } from "../../middlewares/validate.middleware.js";

export const validasi_evaluasi_navigator = validasi_request({
  body: skema_input_navigator,
});
