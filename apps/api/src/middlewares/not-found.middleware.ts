import type { NextFunction, Request, Response } from "express";
import { GalatHttp } from "../utils/http-error.js";

export function penangan_rute_tidak_ditemukan(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  next(
    new GalatHttp(
      404,
      "RUTE_TIDAK_DITEMUKAN",
      `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`,
    ),
  );
}
