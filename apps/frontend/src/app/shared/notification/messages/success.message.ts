type SuccessCode = 'REGISTRATION' | 'PROFILE_UPDATE' | 'EMAIL_RESEND' | 'PASSWORD_RESET' | 'PASSWORD_RESET_LINK';

export const successMessage: Record<SuccessCode, string> = {
    REGISTRATION: 'You have successfully registered',
    PROFILE_UPDATE: 'You have successfully updated your profile',
    EMAIL_RESEND: 'Verification email has been sent',
    PASSWORD_RESET_LINK: 'Password reset link has been sent',
    PASSWORD_RESET: 'Password has been successfully reset',
};
