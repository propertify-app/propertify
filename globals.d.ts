export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingStep?: "user" | "company" | "complete";
    };
  }

  interface UserPublicMetadata {
    onboardingStep?: "user" | "company" | "complete";
  }

}