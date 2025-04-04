/**
 * Author: Bhawesh Chandra Bhanu
 * Date: 2025-04-01
 * Description: Controller for Request For Inspection RFI-Services System
 * License: MIT
 */
import { prisma } from "../config/prismaClient.js";
import { STATUS_CODES } from "../constants/statusCodeConstants.js";
import { RESPONSE_MESSAGES } from "../constants/responseMessages.js";
import { getAgencyUserUccListService } from "../services/rfiCreationService.js";
import { errorResponse } from "../helpers/errorHelper.js";


/**
 * Method : GET
 * Params : @token
 * Description : @agencyUserUccList is use to get all UCC list assigned or mapped to the Agency user.
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

/**
 * Method : GET
 * Params : @token
 * Description : @getRfiCategory is use to get all Category for Inspection Detail in RFI Inspection 
 *               Creation.
*/
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

/**
 * Method : GET
 * Params : @token
 * Description : @getRfiCatSubCattemLayer is use to get all Category for Inspection Detail in RFI Inspection 
 *               Creation.
*/

export const getRfiCatSubCattemLayer = async (req, res) => {
  try {
        const inspectionDetails = await getInspectionDetails(req, res);
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: inspectionDetails
        });

  }catch(err){
    res.status(err.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message
  });

  }

}



export const getRfiSubCategory = async (req, res) => {

  const categoryId = req.query?.cat;
  console.log("bhawesh>>>>>>>>>>>", categoryId)

  const subcategories = await prisma.rfi_catsubcat_itemlayer_association.findMany({
    where: {
      category_id: categoryId,
    },
    select: {
      subcategory_id: true,
      rfi_subcategories: {
        select: {
          subcategory_name: true,
        },
      },
    },
  });

  return res.status(STATUS_CODES.OK).json({
    success: true,
    status: STATUS_CODES.OK,
    message: 'Subcategory records retrieved successfully',
    data: {subcategories}
  });


}




export const getChainageDetails = async (req, res) => {
  try {

  }catch(error){

  }

}
