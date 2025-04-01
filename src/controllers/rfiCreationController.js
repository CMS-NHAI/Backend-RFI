import { prisma } from "../config/prismaClient.js";
import { STATUS_CODES } from "../constants/statusCodeConstants.js";
import { RESPONSE_MESSAGES } from "../constants/responseMessages.js";
import { getAgencyUserUccListService } from "../services/rfiCreationService.js";
import { errorResponse } from "../helpers/errorHelper.js";


/**
 * Method : GET
 * Params : @token
 * Description : @uccListViaUser is use to get ucc list as per the user.
*/

export const agencyUserUccList = async (req, res) => {

  try {

      const agencyUccAllList = await getAgencyUserUccListService(req, res);

      res.status(STATUS_CODES.OK).json({
          success: RESPONSE_MESSAGES.SUCCESS.status,
          status: STATUS_CODES.OK,
          message: RESPONSE_MESSAGES.SUCCESS.UCC_LIST,
          data: agencyUccAllList,
      });

  } catch (error) {
      return await errorResponse(req, res, error);
  }
}





export const getRfiCategory = async (req, res) => {
    try {
      const category = await prisma.rfi_category.findMany({
        select: {
          id: true,
          category_name: true
        },
        orderBy: {
            category_name: 'asc'
        }
      });
  
      // If no records found
      if (!category || category.length === 0) {
        return res.status(STATUS_CODES.OK).json({
          success: false,
          status: STATUS_CODES.OK,
          message: 'No Category records found',
          data: []
        });
      }
  
      return res.status(STATUS_CODES.OK).json({
        success: true,
        status: STATUS_CODES.OK,
        message: 'Category records retrieved successfully',
        data: { category }
      });
  
    } catch (error) {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal server error',
        data: []
      });
    }
  };
