

const HASURA_GRAPHQL_ENGINE_HOSTNAME = "https://multitask-333.hasura.app";

const scheme = (proto: any) => {
    return window.location.protocol === "https:" ? `${proto}s` : proto;
};

export const GRAPHQL_URL = `${scheme(
    "http"
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;

export const REALTIME_GRAPHQL_URL = `${scheme(
    "ws"
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;

export const authClientId = "mSuwRiJYiebu6SPseMyiNc2McPCDYbon";
export const authDomain = "dev-uvnir9ko.us.auth0.com";
export const callbackUrl = `http://localhost:3000/callback`; 