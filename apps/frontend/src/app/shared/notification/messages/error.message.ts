type ErrorCode =
    | 'INVALID_CREDENTIALS'
    | 'EMAIL_NOT_VERIFIED'
    | 'USER_NOT_FOUND'
    | 'USER_ALREADY_EXISTS'
    | 'UNAUTHORIZED'
    | 'INVALID_TOKEN'
    | 'GENERIC'
    | 'EXPIRED_TOKEN'
    | 'INVALID_VERIFICATION_TOKEN'
    | 'UNIQUE_USER_VALUE_CONSTRAINT';

export const errorMessage: Record<ErrorCode, string> = {
    INVALID_CREDENTIALS: 'Invalid credentials. Please try again.',
    INVALID_VERIFICATION_TOKEN: 'The verification token provided is invalid. Please try again with a valid token.',
    USER_NOT_FOUND: 'User not found. Please check your details and try again.',
    USER_ALREADY_EXISTS: 'A user with this email already exists. Please use a different email.',
    EMAIL_NOT_VERIFIED: 'Your email is not verified. Please check your inbox for a verification link.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    INVALID_TOKEN: 'The token provided is invalid. Please try again with a valid token.',
    GENERIC: 'Something went wrong. Please try again later.',
    EXPIRED_TOKEN: 'The token provided has expired. Please try again with a valid token.',
    UNIQUE_USER_VALUE_CONSTRAINT: 'A user with this email already exists. Please use a different email.',
};
