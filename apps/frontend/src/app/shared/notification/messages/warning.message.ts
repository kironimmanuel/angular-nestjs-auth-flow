type WarningCode = 'NO_ACTIVE_SESSION' | 'SESSION_EXPIRED';

export const warningMessage: Record<WarningCode, string> = {
    NO_ACTIVE_SESSION: 'No active session found! Please login to continue.',
    SESSION_EXPIRED: 'Session expired!',
};
