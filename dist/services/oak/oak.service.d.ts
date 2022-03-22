import { AxiosInstance } from 'axios';
import TokenService from '../token/token.service';
import { IFinnotechCardBalanceResponse, IFinnotechCardStatementResponse, IFinnotechDepositToIbanResponse, IFinnotechIbanInquiryResponse } from './interfaces';
declare class OakService {
    private readonly tokenService;
    private readonly httpService;
    constructor(tokenService: TokenService, httpService: AxiosInstance);
    /**
     * For iban inquiry service. [document page](https://devbeta.finnotech.ir/oak-ibanInquiry.html?utm_medium=npm-package)
     * @param data required data for service call
     * @param trackId `Optional` tracking code. should be **unique** in every request
     * @returns service response body
     */
    ibanInquiry(data: {
        iban: string;
    }, trackId?: string): Promise<IFinnotechIbanInquiryResponse>;
    /**
     * For card balance service. [document page](https://devbeta.finnotech.ir/oak-card-balance.html?utm_medium=npm-package)
     * @param data required data for service call
     * @param trackId `Optional` tracking code. should be **unique** in every request
     * @returns service response body
     */
    cardBalance(data: {
        card: string;
    }, trackId?: string): Promise<IFinnotechCardBalanceResponse>;
    /**
     * For card statement service. [document page](https://devbeta.finnotech.ir/oak-card-statement.html?utm_medium=npm-package)
     * @param data required data for service call
     * @param trackId `Optional` tracking code. should be **unique** in every request
     * @returns service response body
     */
    cardStatement(data: {
        card: string;
        /**
         * Should be in `YYMMDD` jalaali format
         */
        fromDate?: string;
        /**
         * Should be in `YYMMDD` jalaali format
         */
        toDate?: string;
    }, trackId?: string): Promise<IFinnotechCardStatementResponse>;
    /**
     * For deposit to iban service. [document page](https://devbeta.finnotech.ir/oak-deposits-to-IBAN-get.html?utm_medium=npm-package)
     * @param data required data for service call
     * @param trackId `Optional` tracking code. should be **unique** in every request
     * @returns service response body
     */
    depositToIban(data: {
        deposit: string;
        /**
         * bank code from documentation
         */
        bank: string;
    }, trackId?: string): Promise<IFinnotechDepositToIbanResponse>;
}
export default OakService;
