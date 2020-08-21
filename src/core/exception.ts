export class ServiceException extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super();
    
    this.status = status;
    this.message = message;
  }

  public static build(status: number, message: string) {
    return new ServiceException(status, message);
  }
};
