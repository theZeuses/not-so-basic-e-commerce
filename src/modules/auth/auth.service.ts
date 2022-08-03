import { ForbiddenException, InternalErrorException, UnauthorizedException, UnprocessableEntityException } from "@core/exceptions";
import { UserModel } from "@modules/user/model/user.model";
import { UserService } from "@modules/user/user.service";
import { AuthDto, RegisterDto } from "./dto";
import * as argon from 'argon2';
import { nanoid } from "nanoid";
import { Redis } from "ioredis";
import { generateBearerToken, generateRefreshToken } from "@common/helpers/jwtHelper";
import { BearerToken, RefreshToken } from "./interfaces";
import { Validator } from "@common/helpers/DtoValidator";

export class AuthService {
  bearerTokenLife: string;
  refreshTokenLife: string;
  expirySalt: number;

  constructor(
    private readonly userService: UserService,
    private readonly userModel: typeof UserModel,
    private readonly redisService: Redis
  ){
    this.bearerTokenLife = '30m';
    this.refreshTokenLife = '30d';
    this.expirySalt = (30 * 24 * 60 * 60);
  }

  async signIn(dto: AuthDto) {
    const validator = new Validator();
    await validator.validate(dto, AuthDto);
    
    const user = await this.checkAndGetUserByEmail(dto.email);
    await this.validateUser(user, dto.password);
    const sessionId = await this.generateSession(user);
    const fingerprint = await this.generateFingerprint();
    return {
      auth_token: await this.signTokens(user, sessionId, fingerprint),
      fingerprint
    }
  }

  async register(dto: RegisterDto) {
    const validator = new Validator();
    await validator.validate(dto, RegisterDto);
    
    const user = await this.userService.checkOneByEmail(dto.email);
    if(user) throw new UnprocessableEntityException('DUPLICATE_EMAIL');

    const inserted = await this.userModel.query().insertAndFetch(dto);
    const sessionId = await this.generateSession(inserted);
    const fingerprint = await this.generateFingerprint();
    return {
      auth_token: await this.signTokens(inserted, sessionId, fingerprint),
      fingerprint
    }
  }

  async refreshToken(dto: RefreshToken){
    try {
      const user = await this.userService.findOneById(dto.user_id.toString());
      const fingerprint = await this.generateFingerprint();
      return {
        auth_token: await this.signTokens(user, dto.session, fingerprint),
        fingerprint
      }
    }catch(err){    
      await this.deleteSession(dto.user_id.toString(), dto.session);
      throw new ForbiddenException('ACCESS_DENIED');
    }
  }

  async logout(dto: RefreshToken, sessionId: string){
    try{
      await this.deleteSession(dto.user_id.toString(), sessionId);
    }catch(err){
      throw new InternalErrorException('SOMETHING_WENT_WRONG');
    }
  }

  /**
   * sign bearer and refresh tokens
   * @date 2022-08-04
   * @param {any} user:UserModel
   * @param {any} session:string
   * @param {any} fingerprint:string
   * @returns {any}
   */
  async signTokens( 
    user: UserModel, session: string, fingerprint: string 
  ) : Promise<{ 
    bearer_token: string, 
    refresh_token: string, 
    expires_in: number
  }> {
    const expires_in = Date.now() + this.expirySalt;
    //define payloads
    const bearerPayload: BearerToken = {
      user_id: user.id,
      roles: [
        user.role
      ]
    };
    const refreshPayload: RefreshToken = {
      session,
      user_id: user.id,
      fingerprint: await argon.hash(fingerprint)
    }

    //generate a bearer token
    const bearerToken = generateBearerToken(bearerPayload, this.bearerTokenLife);

    //generate a refresh token
    const refreshToken = generateRefreshToken(refreshPayload, this.refreshTokenLife);

    return {
      bearer_token: bearerToken,
      refresh_token: refreshToken,
      expires_in
    };
  }

  /**
   * Get a user by email. Throws error if not found
   * @date 2022-08-04
   * @param {any} email:string
   * @returns {any}
   */
  async checkAndGetUserByEmail(email: string): Promise<UserModel> {
      // find the user by email
      const user = await this.userService.findOneByEmail(email);
      // if user does not exist throw exception
      if (!user)
        throw new UnauthorizedException(
          'INCORRECT_CREDENTIALS',
        );
      return user;
  }

  /**
   * Validate a user against given password
   * @date 2022-08-04
   * @param {any} user:UserModel
   * @param {any} password:string
   * @returns {any}
   */
  async validateUser(user: UserModel, password: string){
    // compare password
    const passwordMatches = await argon.verify(
      user.password,
      password,
    );
    // if password incorrect throw exception
    if (!passwordMatches)
      throw new UnauthorizedException(
        'INCORRECT_CREDENTIALS',
      );
    return true;
  }

  /**
   * Generate a logged in session window for a user
   * @date 2022-08-04
   * @param {any} user:UserModel
   * @returns {any}
   */
  async generateSession(user: UserModel){
    const sessionId = nanoid(10);
    await this.redisService.lpush(user.id.toString(), sessionId);
    return sessionId;
  }

  /**
   * Checks if a logged in session window valid
   * @date 2022-08-04
   * @param {any} user_id:string
   * @param {any} sessionId
   * @returns {any}
   */
  async isValidSession(user_id: string, sessionId){
    const list = await this.redisService.lrange(user_id, 0, -1);
    let valid = false;
    list.map(item => {
      if(item == sessionId) valid = true;
    })
    return valid;
  }

  /**
   * Delete a session of a user
   * @date 2022-08-04
   * @param {any} user_id:string
   * @param {any} sessionId
   * @returns {any}
   */
  async deleteSession(user_id: string, sessionId){
    return this.redisService.lrem(user_id, 1, sessionId);
  }

  /**
   * Generate a random fingerprint string
   * @date 2022-08-04
   * @returns {any}
   */
  async generateFingerprint(){
    return nanoid(10);
  }
}