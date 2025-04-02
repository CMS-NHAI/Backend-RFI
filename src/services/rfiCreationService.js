import { prisma } from "../config/prismaClient.js";
import { RESPONSE_MESSAGES } from "../constants/responseMessages.js";
import { STATUS_CODES } from "../constants/statusCodeConstants.js";
import APIError from "../utils/apiError.js";

export const getAgencyUserUccListService = async (req, res) => {

    const userId = req.user?.user_id;

    if (!userId) {
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            RESPONSE_MESSAGES.ERROR.USER_ID_MISSING
        );
    }

    const userDetail = await prisma.ucc_user_mappings.findFirst({
        where: { user_id: userId },
    });

    if (!userDetail) {
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            RESPONSE_MESSAGES.ERROR.USER_NOT_FOUND
        );
    }

    const uccId = await prisma.ucc_user_mappings.findMany({
        where: { user_id: userId }, select: { ucc_id: true }
    });

    const uccIds = uccId.map(item => item.ucc_id);

    if (uccIds.length <= 0) {
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            RESPONSE_MESSAGES.ERROR.NO_UCC_FOUND
        );
    }

    const uccList = await prisma.ucc_master.findMany({
        where: {
            id: {
                in: uccIds,
            },
        }
    });

    if (!uccList) {
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            RESPONSE_MESSAGES.ERROR.NO_UCC_FOUND
        );
    }

    return uccList;

};


export const getInspectionDetails = async (req, res) => {
    const categoryId = req.query?.cat;
    const subCategoryId = req.query?.subcat;
    const itemId = req.query?.item;
    const layerId = req.query?.layer;

    if (!categoryId || !subCategoryId || !itemId || !layerId) {
        const categoryQueryResult = await prisma.rfi_category.findMany({
            select: {
              id: true,
              category_name: true
            },
            orderBy: {
                category_name: 'asc'
            }
          });
          return res.status(STATUS_CODES.OK).json({
            success: true,
            status: STATUS_CODES.OK,
            message: 'Category records retrieved successfully',
            data: { category }
          });
    }

    if (categoryId && subCategoryId){
        
    }



}