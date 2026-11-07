import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { GalatHttp } from "../utils/http-error.js";

interface TargetValidasi {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

/**
 * Middleware validasi input HTTP berbasis skema Zod di batas masuk request.
 * Memastikan seluruh layer hilir (controller/service) hanya mengonsumsi nilai hasil parse Zod.
 */
export function validasi_request(skema: TargetValidasi) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (skema.query) {
      const hasil_kuery = skema.query.safeParse(req.query);
      if (!hasil_kuery.success) {
        next(new GalatHttp(400, "VALIDASI_KUERY_GAGAL", "Parameter query tidak valid."));
        return;
      }
      Object.defineProperty(req, "query", {
        value: hasil_kuery.data,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }

    if (skema.params) {
      const hasil_params = skema.params.safeParse(req.params);
      if (!hasil_params.success) {
        next(new GalatHttp(400, "VALIDASI_PARAMETER_GAGAL", "Parameter URL tidak valid."));
        return;
      }
      req.params = hasil_params.data as Record<string, string>;
    }

    if (skema.body) {
      const hasil_body = skema.body.safeParse(req.body);
      if (!hasil_body.success) {
        next(new GalatHttp(400, "VALIDASI_BODY_GAGAL", "Payload request tidak valid."));
        return;
      }
      req.body = hasil_body.data;
    }

    next();
  };
}
