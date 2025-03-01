import { PrismaClient,Prisma } from "@prisma/client"
import { ICandidate } from '../interfaces/interface.candidate';

const prisma = new PrismaClient();

export const getCustomerData = async (email:string | null,phoneNumber:string | null):Promise<ICandidate[]> => {
    try {
        let customerData:ICandidate[] = await prisma.contact.findMany({
            where:{
                OR:[
                    {
                        email
                    },
                    {
                        phoneNumber
                    }
                ]
            },
            orderBy:{
                id:'asc'
            }
        });
        if(customerData.length > 0)
        {
            let additionalDataById:ICandidate[];
            if(customerData[0].linkPrecedence == "secondary"){
                let primaryId:number|null = customerData[0].linkedId;
                additionalDataById = await prisma.contact.findMany({
                    where:{
                        OR:[
                            {
                                id:primaryId || 0 //ts not know this condition that i check if secondary so it tell linkedId id may come null
                            },
                            {
                                linkedId:primaryId
                            }
                        ]
                    },
                    orderBy:{
                        id:'asc'
                    }
                })
            }else{
                additionalDataById= await prisma.contact.findMany({
                    where:{
                        linkedId:customerData[0].id
                    },
                    orderBy:{
                        id:'asc'
                    }
                })
            }

            customerData.push(...additionalDataById);
        }  

        return customerData;
    } catch (error) {
        throw error;
    }
}

export const isNewCustomer = async(email:string | null,phoneNumber:string | null):Promise<boolean> =>{
    try {
        const customerData:Array<Prisma.ContactCreateInput> = await getCustomerData(email,phoneNumber);

        return customerData.length > 0 ? false : true;
    } catch (error) {
        throw error;
    }
}

export const checkIsPhoneNumOrEmailMatch = async (email:string | null,phoneNumber:string | null):Promise<ICandidate[]> => {
    try {
        const customerData:ICandidate[] = await getCustomerData(email,phoneNumber);

        let primaryId = customerData[0].id;

        //second condidtion
        customerData.map(async (data) => {
            if(primaryId !== data.id){
                data.linkedId = primaryId;
                data.linkPrecedence = 'secondary';
                await prisma.contact.update({
                    where:{
                        id:data.id
                    },
                    data:{
                        linkedId : primaryId,
                        linkPrecedence : 'secondary'
                    }
                });
            }
        })

        return customerData;
    } catch (error) {
        throw error;
    }
}

export const createNewCustomer = async(email:string | null,phoneNumber:string | null):Promise<ICandidate[]> => {
    try {
        let contactData: Prisma.ContactCreateInput;

        contactData = {
            phoneNumber,
            email,
        }

        const customer:ICandidate = await prisma.contact.create({ data:contactData });
        return Array.of(customer);
    } catch (error) {
        throw error
    }
}

export const deleteAllCustomer = async() => {
    try {
        let deleteC = prisma.contact.deleteMany();
        return deleteC;
    } catch (error) {
        throw error;
    }
}

export const isEmailOfCustomerExist = async (email: string | null): Promise<boolean> => {
    try {
        const customerData:ICandidate[] = await prisma.contact.findMany({
            where:{
                    email
            },
            orderBy:{
                createdAt:'asc'
            }
        });
        return customerData.length > 0 ? true:false ;
    } catch (error) {
        throw error;
    }
}

export const isPhoneNumberOfCustomerExist = async (phoneNumber: string | null): Promise<boolean> => {
    try {
        const customerData:ICandidate[] = await prisma.contact.findMany({
            where:{
                    phoneNumber
            },
            orderBy:{
                createdAt:'asc'
            }
        });
        return customerData.length > 0 ? true:false ;
    } catch (error) {
        throw error;
    }
}