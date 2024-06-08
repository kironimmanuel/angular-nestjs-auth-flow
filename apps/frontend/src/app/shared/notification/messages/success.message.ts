type SuccessCode = 'REGISTRATION' | 'PROFILE_UPDATE' | 'EMAIL_RESEND';

export const successMessage: Record<SuccessCode, string> = {
    REGISTRATION: 'You have successfully registered',
    PROFILE_UPDATE: 'You have successfully updated your profile',
    EMAIL_RESEND: 'Verification email has been sent',
};
