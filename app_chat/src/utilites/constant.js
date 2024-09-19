export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const SIGNIN_ROUTE = `${AUTH_ROUTES}/signin`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_USER_INFO = `${AUTH_ROUTES}/update-user-info`;
export const UPLOAD_AVATAR = `${AUTH_ROUTES}/upload-avatar`;
export const LOGOUT = `${AUTH_ROUTES}/logout`;

export const CONTACT_ROUTES = "api/contacts";
export const SEARCH_CONTACT = `${CONTACT_ROUTES}/search`;
export const GET_CONTACT_FOR_DM_LIST = `${CONTACT_ROUTES}/getContactForDMList`;
export const GET_ALL_CONTACTS = `${CONTACT_ROUTES}/get-all-contacts`;

export const MESSAGE_ROUTES = "api/messages";
export const GET_All_MESSAGES = `${MESSAGE_ROUTES}/get-messages`;
export const UPLOAD_FILE = `${MESSAGE_ROUTES}/upload-file`;

export const CHANNEL_ROUTES = "api/channel";
export const CREATE_CHANNEL = `${CHANNEL_ROUTES}/create-channel`;
export const GET_CHANNELS = `${CHANNEL_ROUTES}/get-channels`;
export const GET_CHANNEL_MESSAGE = `${CHANNEL_ROUTES}/get-channel-message`;
