import  "express";

declare module 'express' {
    export interface Request  {
        body: {
            //user: IUser
            password:string
        };
    }
}
