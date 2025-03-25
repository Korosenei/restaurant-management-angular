export interface ChangePwdUser {
  userId: number;              
  lastPassword: string;        
  newPassword: string;         
  confirmNewPassword: string;  
  modifiedDate: string;        
}