import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const handleSlackRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(StatusCodes.OK).json({ message: "OK" });
  } catch (error: any) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export default {
  handleSlackRequest,
};
