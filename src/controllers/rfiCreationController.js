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

  /*
  const subcategories = await prisma.rfi_catsubcat_itemlayer_association.findMany({
    where: {
      category_id: Number(categoryId),
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

 /* const flatSubcategories = subcategories.map((sub) => ({
    subcategory_id: sub.subcategory_id,
    subcategory_name: sub.rfi_subcategories?.subcategory_name,
  })); 

  const flatSubcategories = Array.from(
    new Map(
      subcategories.map((sub) => [
        sub.subcategory_id, // key
        {
          subcategory_id: sub.subcategory_id,
          subcategory_name: sub.rfi_subcategories?.subcategory_name,
        }, // value
      ])
    ).values()
  );
  */
  const subcategories = await prisma.rfi_catsubcat_itemlayer_association.findMany({
    where: {
      category_id: Number(categoryId),
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
  
  // Flatten the results
  const flatSubcategoriesRaw = subcategories.map((sub) => ({
    subcategory_id: sub.subcategory_id,
    subcategory_name: sub.rfi_subcategories?.subcategory_name,
  }));
  
  // Use a Set to ensure uniqueness by both id and name
  const seen = new Set();
  const flatSubcategoriesUnique = flatSubcategoriesRaw.filter((sub) => {
    const key = `${sub.subcategory_id}-${sub.subcategory_name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  // Sort by subcategory_name
  flatSubcategoriesUnique.sort((a, b) =>
    a.subcategory_name.localeCompare(b.subcategory_name)
  );
  
  return res.status(STATUS_CODES.OK).json({
    success: true,
    status: STATUS_CODES.OK,
    message: 'Subcategory records retrieved successfully',
    data: {flatSubcategoriesUnique}
  });


}


export const getRfiItem = async (req, res) => {
  const categoryId = req.query?.cat;
  const subCategoryId = req.query?.subCat;
  console.log("Catogry>>>>>>", categoryId)
  console.log("SUBCatogry>>>>>>", subCategoryId)
  const results = await prisma.rfi_catsubcat_itemlayer_association.findMany({
    where: {
      category_id: Number(categoryId),
      subcategory_id: Number(subCategoryId),
    },
    select: {
      item_id: true,   
     rfi_item: {
        select: {
          
          item_name: true,
        },
      },
    },
    distinct: ['item_id'],
    orderBy: {
      rfi_item: {
        item_name: 'asc',
      },
    },
  });

  const flattenedResults = results.map(({ item_id, rfi_item }) => ({
    item_id,
    item_name: rfi_item?.item_name || null,
  }));

  return res.status(STATUS_CODES.OK).json({
    success: true,
    status: STATUS_CODES.OK,
    message: 'Inspection Item records retrieved successfully',
    data: {flattenedResults}
  });


}


export const getChainageDetails = async (req, res) => {
  try {

  }catch(error){

  }

}
