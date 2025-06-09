import { getModelForClass, prop } from "@typegoose/typegoose";

export class OtpRequestParams{
    @prop({ required: true })
    public phoneNumber: string;
    
    @prop({ required: true })
    public countryCode: string;
    
}

export class VerifyOtpRequestParams{
    @prop({ required: true })
    public phoneNumber: string;
    
    @prop({ required: true })
    public countryCode: string;
    
    @prop({ required: true })
    public otp: string;

    @prop({ required: true })
    public requestId: string;
}

export class VerifyOtpResponse{
    @prop({ required: true })
    public success: boolean;

    @prop({ required: true })
    public at: string;

    @prop({ required: true })
    public rt: string;
}

export class OtpResponse {
    @prop({ required: true })
    public success: boolean;

    @prop({ required: true })
    public expiresAt: Date;
}


export class OtpSchema extends OtpRequestParams{
    @prop({ required: true })
    public otp: string;

    @prop({ required: true })
    public expiresAt: Date;

    @prop({ required: true })
    public requestId: string;
}

export const OtpModel = getModelForClass(OtpSchema);