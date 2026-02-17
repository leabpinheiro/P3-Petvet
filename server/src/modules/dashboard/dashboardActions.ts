import type { RequestHandler } from "express";
import dashboardRepository from "./dashboardRepository";

const browseOwnerDashboard: RequestHandler = async (req, res, next) => {
  try {
    const ownerId = req.auth?.userId;

    if (!ownerId) {
      res.sendStatus(401);
      return;
    }

    const dashboard = await dashboardRepository.getDashboardOwner(
      Number(ownerId),
    );

    res.status(200).json(dashboard);
  } catch (error) {
    next(error);
  }
};

const browseVetDashboard: RequestHandler = async (req, res, next) => {
  try {
    const vetId = req.auth?.userId;

    if (!vetId) {
      res.sendStatus(401);
      return;
    }

    const dashboard = await dashboardRepository.getDashboardVet(Number(vetId));

    res.status(200).json(dashboard);
  } catch (error) {
    next(error);
  }
};

export default { browseOwnerDashboard, browseVetDashboard };
