export const generateOTP = () => {
    return  Math.floor(100000 + Math.random() * 900000);
 }
 export const generateOTPExpiry = (time)=>{
     return new Date(Date.now() + time );
 }