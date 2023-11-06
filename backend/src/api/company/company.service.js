import axios from "axios";

import { Company } from "../../models";
import { NotFoundError } from "../../errors";
import { extractCompanyInfo } from "../../helpers";
import { getCurrentAccountAccessToken } from "../account/account.service";


export async function getById(companyId) {
    try {
        const response = await axios.get(`${process.env.AUTH_SERVER_API_URL}/company/detail/${companyId}`);
        return extractCompanyInfo(response.data.company);
    } catch (error) {
        if (error.response?.status === 400) throw new NotFoundError()
        throw error
    }
}


export async function update({ fullname, taxCode, website, fax, phone, address, email, bankName, accountNumber,
    contactPersonEmail, contactPersonPhone, contactPersonPosition, contactPerson, taxAuthorityId, companyId, accountId }) {

    const accessToken = await getCurrentAccountAccessToken(accountId);

    await Promise.all([
        axios.put(
            `${process.env.AUTH_SERVER_API_URL}/company/update/${companyId}`,
            {
                fullname, taxCode, website, fax, phone, address, email, bankName, accountNumber,
                contactPersonEmail, contactPersonPhone, contactPersonPosition, contactPerson
            },
            { headers: { Authorization: "Bearer " + accessToken } }
        ),
        Company.update({taxAuthorityId}, { where: {companyId} }),
    ])    
}
