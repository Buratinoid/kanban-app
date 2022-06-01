export class AuthorizationStatus {
  isSuccessful: boolean = false;
  errorCode?: string;
  errorText?: string;

  constructor(isSuccessful: boolean, errorCode?: string, errorText?: string) {
    this.isSuccessful = isSuccessful;
    this.errorCode = errorCode;
    this.errorText = errorText;
  }
}
