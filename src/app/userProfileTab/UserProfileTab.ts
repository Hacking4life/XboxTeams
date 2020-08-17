import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/userProfileTab/index.html")
@PreventIframe("/userProfileTab/config.html")
@PreventIframe("/userProfileTab/remove.html")
export class UserProfileTab {
}
