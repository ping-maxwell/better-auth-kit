export const APP_INVITE_ERROR_CODES = {
	USER_IS_ALREADY_A_MEMBER_OF_THIS_APPLICATION:
		"User is already a member of this application",
	USER_WAS_ALREADY_INVITED_TO_THIS_APPLICATION:
		"User was already invited to this application",
	INVITER_IS_NO_LONGER_A_MEMBER_OF_THIS_APPLICATION:
		"Inviter is no longer a member of this application",
	APP_INVITATION_NOT_FOUND: "App invitation not found",
	YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_APP_INVITATION:
		"You are not allowed to cancel this app invitation",
	YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_APPLICATION:
		"You are not allowed to invite users to this application",
	THIS_APP_INVITATION_CANT_BE_REJECTED: "This app invitation can't be rejected",
	EMAIL_DOMAIN_IS_NOT_IN_WHITELIST: "Email domain is not in whitelist",
} as const;

export const BASE_ERROR_CODES = {
	USER_NOT_FOUND: "User not found",
	FAILED_TO_CREATE_USER: "Failed to create user",
	FAILED_TO_CREATE_SESSION: "Failed to create session",
	FAILED_TO_UPDATE_USER: "Failed to update user",
	FAILED_TO_GET_SESSION: "Failed to get session",
	INVALID_PASSWORD: "Invalid password",
	INVALID_EMAIL: "Invalid email",
	INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
	SOCIAL_ACCOUNT_ALREADY_LINKED: "Social account already linked",
	PROVIDER_NOT_FOUND: "Provider not found",
	INVALID_TOKEN: "invalid token",
	ID_TOKEN_NOT_SUPPORTED: "id_token not supported",
	FAILED_TO_GET_USER_INFO: "Failed to get user info",
	USER_EMAIL_NOT_FOUND: "User email not found",
	EMAIL_NOT_VERIFIED: "Email not verified",
	PASSWORD_TOO_SHORT: "Password too short",
	PASSWORD_TOO_LONG: "Password too long",
	USER_ALREADY_EXISTS: "User already exists",
	EMAIL_CAN_NOT_BE_UPDATED: "Email can not be updated",
	CREDENTIAL_ACCOUNT_NOT_FOUND: "Credential account not found",
	SESSION_EXPIRED: "Session expired. Re-authenticate to perform this action.",
	FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't unlink your last account",
	ACCOUNT_NOT_FOUND: "Account not found",
	USER_ALREADY_HAS_PASSWORD:
		"User already has a password. Provide that to delete the account.",
};
