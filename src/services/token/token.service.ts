import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import FinnotechError from '../../common/error';
import { GRANT_TYPE } from '../../constants/scopes';

class TokenService {
	private readonly _clientSecret: string;
	private readonly _nid: string;
	readonly clientId: string;

	private readonly _getAccessToken: Function | undefined;
	private readonly _getRefreshToken: Function | undefined;
	private readonly _setTokens: Function | undefined;

	private readonly _httpService: AxiosInstance;

	constructor(
		data: {
			clientId: string;
			clientSecret: string;
			nid: string;
			getAccessTokenFunction: Function;
			getRefreshTokenFunction: Function;
			setTokensFunction: Function;
		},
		httpService: AxiosInstance
	) {
		this.clientId = data.clientId;
		this._clientSecret = data.clientSecret;
		this._nid = data.nid;
		this._getAccessToken = data.getAccessTokenFunction;
		this._getRefreshToken = data.getRefreshTokenFunction;
		this._setTokens = data.setTokensFunction;
		this._httpService = httpService;
	}

	/**
	 * **Internal Method** for getting service access token
	 * @param scopeName scope name
	 * @returns result of initiated `getAccessToken` function
	 */
	async getAccessToken(scopeName: string): Promise<string> {
		if (!this._getAccessToken) {
			throw new FinnotechError(
				'getAccessToken',
				'getAccessToken function is not defined'
			);
		}
		if (this._getAccessToken.constructor.name === 'AsyncFunction') {
			return await this._getAccessToken(scopeName);
		}
		return this._getAccessToken(scopeName);
	}

	/**
	 * **Internal Method** for getting service refresh token
	 * @param scopeName scope name
	 * @returns result of initiated `getRefreshToken` function
	 */
	async getRefreshToken(scopeName: string): Promise<string> {
		if (!this._getRefreshToken) {
			throw new FinnotechError(
				'getRefreshToken',
				'getRefreshToken function is not defined'
			);
		}
		if (this._getRefreshToken.constructor.name === 'AsyncFunction') {
			return await this._getRefreshToken(scopeName);
		}
		return this._getRefreshToken(scopeName);
	}

	/**
	 * **Internal Method** for set service token
	 * @param tokenData setTokens props
	 */
	async setTokens(tokenData: {
		accessToken: string;
		refreshToken: string;
		lifeTime: number;
		scopes: string[];
		tokenType: GRANT_TYPE;
	}): Promise<void> {
		if (!this._setTokens) {
			throw new FinnotechError(
				'setTokens',
				'setTokens function is not defined'
			);
		}
		if (this._setTokens.constructor.name === 'AsyncFunction') {
			return await this._setTokens(tokenData);
		}
		return this._setTokens(tokenData);
	}

	/**
	 * For refresh client-credentials token for requested scope by their scope name. 
	 * _This function automatically call in case of `invalid token`_.
	 * **This function will finally call `setTokens` function**. [document page](https://devbeta.finnotech.ir/boomrang-get-clientCredential-token.html?utm_medium=npm-package)
	 * @param scopeName List of scope names. Final token information will be for these scopes
	 */
	async getClientCredentialsRefreshToken(scopeName: string): Promise<void> {
		const scopeRefreshToken = await this.getRefreshToken(scopeName);

		const authHeader =
			'Basic ' +
			Buffer.from(`${this.clientId}:${this._clientSecret}`).toString(
				'base64'
			);

		const requestData = {
			grant_type: 'refresh_token',
			token_type: 'CLIENT-CREDENTIAL',
			refresh_token: scopeRefreshToken,
		};

		try {
			const finnotechResponse = await this._httpService.post(
				'/dev/v2/oauth2/token',
				requestData,
				{
					headers: {
						Authorization: authHeader,
					},
				}
			);

			const {
				value,
				refreshToken,
				lifeTime,
				scopes,
			}: {
				value: string;
				refreshToken: string;
				lifeTime: number;
				scopes: string[];
			} = finnotechResponse.data.result;

			await this.setTokens({
				accessToken: value,
				refreshToken,
				lifeTime,
				scopes,
				tokenType: GRANT_TYPE.CLIENT_CREDENTIALS,
			});
		} catch (err) {
			const error = err as AxiosError;
			throw error;
		}
	}

	/**
	 * For getting client-credentials token for requested scopes by their scope names. 
	 * **This function will finally call `setTokens` function**. [document page](https://devbeta.finnotech.ir/boomrang-get-clientCredential-token.html?utm_medium=npm-package)
	 * @param scopes List of scope names. Final token information will be for these scopes
	 */
	async getClientCredentialToken(scopes: string[]): Promise<void> {
		if (scopes.length === 0) {
			throw new FinnotechError(
				'getClientCredentialToken',
				'scopes should not be empty'
			);
		}

		const authHeader =
			'Basic ' +
			Buffer.from(`${this.clientId}:${this._clientSecret}`).toString(
				'base64'
			);

		const requestData = {
			grant_type: 'client_credentials',
			nid: this._nid,
			scopes: scopes.join(','),
		};

		try {
			const finnotechResponse = await this._httpService.post(
				'/dev/v2/oauth2/token',
				requestData,
				{
					headers: {
						Authorization: authHeader,
					},
				}
			);

			const {
				value,
				refreshToken,
				lifeTime,
				scopes,
			}: {
				value: string;
				refreshToken: string;
				lifeTime: number;
				scopes: string[];
			} = finnotechResponse.data.result;

			await this.setTokens({
				accessToken: value,
				refreshToken,
				lifeTime,
				scopes,
				tokenType: GRANT_TYPE.CLIENT_CREDENTIALS,
			});
		} catch (err) {
			const error = err as AxiosError;
			throw error;
		}
	}
}

export default TokenService;
