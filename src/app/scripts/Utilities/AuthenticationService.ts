import { AuthToken} from "./Model/AuthToken";
import * as https from "https";
import * as querystring from "querystring";



export class AuthenticationService
{
    private userToken: AuthToken;
//     public  GetTokenFromFile() : AuthToken
//     {
//        // this.main();
//        var token :AuthToken ={ userXUID : "",
//         userHash:"",
//         XSTSToken :"",
//         expiresOn:""}
//         var data : any  ={
//             userXUID: '2535469913557889',
//             userHash: '8271955153861541345',
//             XSTSToken: 'eyJlbmMiOiJBMTI4Q0JDK0hTMjU2IiwiYWxnIjoiUlNBLU9BRVAiLCJjdHkiOiJKV1QiLCJ6aXAiOiJERUYiLCJ4NXQiOiIxZlVBejExYmtpWklFaE5KSVZnSDFTdTVzX2cifQ.Ov1-F7uuLaRxIhUh6sLtRK4RpX6JlL1Qd0jLSO0BujGJ8r01cVnB4Hbpg7JJcG6TbCBvu4CHjYQJbOSanho3HVUjz5eH9sEAXoxpCp-BzSpSBTqBMbQH6G_a9YaJhyslVKMOKwUfPFJ2aQRROdQWztyjI15HaLEqBq9i0rpt558.7RocCDSg41hna1QVe6BVBA.MKpxjHQYfoPI6-J0b7M_3R8vSpzPl5iklmO1oiywfF-m6Hww0dGbE4WCUayV7shMzqB1cSpBReE71UL2qp5B_n7iW_S2BLPLvV9oOYpHmUnZG5llJvu4g2MKmNtN79Opkmp2E4S4rJhfziSz0udqOPw3GZ4H6Cr7DnrgRmTYZXkbxajie3TKmADFWmPUEzDlRC1sOWsmjxloHIypM6_MLejLQAGIY-xtUhl3PNzZJDQUS2SNWEF4j2nYwWuIroPYWuCNVvWmigsu0BuLOpKR7vTDuC801Z7ZbojDXGYKKWXDYjMKmWHpysGQhZz6hBTSI21ND9szM6bevhRtVSVqqO1oVO4f3VIsWc_TauTxoyl3y2D4dOo6hfzAsAtAObLQcLN8qfRta4oGeGMEntGWweO4ooonYjh3ieJnwMmWlU-7YcKYqX0twCVAZBFtp0WBkL2Un8yd4RjQD0UEfweI3yHUBDpZ0Cu82eCsvFmaZ-JRsR0LYAvqucxAxvce1dPhK07mVPj3T7C3mHYDKk6juX7rmCoF7oL6sNKBwLOsuhnE08EmNTYhyS98qjxzl0hv_asDLfiifOEhyXQyyN5YcK73I5ZYfvgpeP6HHkKmIbuOX2JpFqQUtMEtE4_2DeOXR_C28-ZMZr5-tASooub1li4bzGFYKJp-5GgScPHK22XUEe-j-ILS5kPZiAWZA7Ef8mlEnjwTVK0zvUQJxiCwvoxvpDsNypJqO3OqKpuvbAARS-plKQnzjV8RkEj1Hq3F26xDYJFDikA4vztTyzlbvUxKev-nIyRocz9Zj0mLTuzFeKTZAMFxH7uIR22RSYu_hIfZLtRWErdkv6CxL2JTMHlYYk8KY9m2DOEpoDQq2pLiF1J-VMjFy611v9DZWfQM-SvA5lpqaJjj07ioR4yUFS0wEWY_awyNnkAy8Ic32tA-7ZheadT1_8o5-Q1Xyo3eXlfH-vfQwFjHpq76GB4zkpX_WAQt47kZJvjBv51xhh8Z0CWu7uEKsWeR7C4alA9juROK0VX5IqLYrCvf3W1h2EjRGWGJJ6mNb3rNOL3iUV11ZSn4Ue-J4LqUYILdpWTWSB7UqlrkPpdO92VcefAOGb_935lpXEOnHRXBnBvmo2XQBr7oampi4VkAYJCRhiUxf7U52jG1VHcg15Jayo868ggpM2e7uZOrn0uaZcNxzUVkdqJY9ug7pLsnIpKHqcNw9oq-N5CnN-5l0q0PmAZlMk3W1ur94eSw9cqdsVg9CQTa7kLeBBt7ltE93AuIxvkFBxpRklnqnCgjXVJSvhSWMi7dIJMS1jIXYEjcuxKpB0SyPitvomEl4-UgRcidU3xHw-DhfhBvBJGBjWYupht1NGude11-exSRrGoSl21DMtLqHX_r8E5xjAYmnxe_39f6.r4vKJST-yp5ofHuns_DPDTzXjq-25v467SmfP83Ff90',
//             expiresOn: '2020-07-27T23:36:06.2297231Z'
//           }
//        return token  = JSON.parse(JSON.stringify(data));
// }

public get UserToken(): AuthToken {
    return this.userToken;
  }

  public set UserToken(value: AuthToken) {
    this.userToken = value;
  }

  public async getUserToken(
    username: string,
    password: string
  ): Promise<AuthToken> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };
    const token: AuthToken = await fetch(
      "https://xboxliveauthenticatorservice.azurewebsites.net/login",
      requestOptions
    ).then((response) => response.json());
    return token;
  }
}