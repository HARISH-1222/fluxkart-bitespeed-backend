import { $Enums } from '@prisma/client';


export interface IRequestBody{
    email:string | null,
    phoneNumber:string | null
} 

export interface IOutput{
    primaryContatctId: number,
    emails: string[],
    phoneNumbers: string[],
    secondaryContactIds: number[]
}

export interface ICandidate {
    id: number; 
    phoneNumber: string | null; 
    email: string | null; 
    linkedId: number | null; 
    linkPrecedence: $Enums.Precedence;
    createdAt: Date; 
    updatedAt: Date; 
    deletedAt: Date | null
}