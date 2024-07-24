import { Request, Response } from 'express';
import * as contactModel from '../model/model.contact'
import { ICandidate,IOutput,IRequestBody } from '../interfaces/interface.candidate';

export const getContactList = async (req:Request,res:Response) => {
  try {
    let {email,phoneNumber}:IRequestBody = req.body;

    if(!email && !phoneNumber) throw new Error("Either email or phoneNumber needed");

    phoneNumber = phoneNumber ? phoneNumber.toString() : null;

    let candidateDetails:ICandidate[];

    // check if email or phoneNumber is already there
    const isNewCustomer:boolean = await contactModel.isNewCustomer(email,phoneNumber);

    if(isNewCustomer){
        candidateDetails = await contactModel.createNewCustomer(email,phoneNumber);
    }else if(email && phoneNumber){
        const isEmailContains:boolean = await contactModel.isEmailOfCustomerExist(email);
        const isPhoneNumberContains:boolean = await contactModel.isPhoneNumberOfCustomerExist(phoneNumber);

        if(!(isEmailContains && isPhoneNumberContains)){
            //Fist task
            await contactModel.createNewCustomer(email,phoneNumber);
        }
        
        //second task
        candidateDetails = await contactModel.checkIsPhoneNumOrEmailMatch(email,phoneNumber);
    }else{
      candidateDetails = await contactModel.checkIsPhoneNumOrEmailMatch(email,phoneNumber);
    }


    let outputData:IOutput = {
        primaryContatctId: candidateDetails[0].id,
        emails: [],
        phoneNumbers: [],
        secondaryContactIds: []
    }

    candidateDetails.map((data)=>{
        if(data.email){
            outputData.emails.push(data.email)
        }

        if(data.phoneNumber){
            outputData.phoneNumbers.push(data.phoneNumber)
        }

        if(data.linkPrecedence == 'secondary'){
            outputData.secondaryContactIds.push(data.id)
        }

    })
    
    res.status(200).json(
        {
            "status":"success",
            "contact":{outputData}
        }
    );   
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Handle known Error type
      res.status(500).json({
        status: "Failed",
        Error: error.message,
      });
    } else {
      // Handle unknown error type
      res.status(500).json({
        status: "Failed",
        Error: "An unknown error occurred",
      });
    }
  }
}

//For Testing
export const insertController = async(req:Request,res:Response) => {
  try {
    let {email,phoneNumber}:IRequestBody = req.body;
    
    phoneNumber = phoneNumber ? phoneNumber.toString() : null;

    // let isNewCustomer
    let candidateDetails:ICandidate[];

    // check if email or phoneNumber is already there
    // const isNewCustomer:boolean = await contactModel.isNewCustomer(email,phoneNumber);
    
    candidateDetails = await contactModel.createNewCustomer(email,phoneNumber);
    
    res.status(200).json(
        {
            "status":"success",
            "contact":{candidateDetails}
        }
    );   
  } catch (error) {
    res.status(500).json(
      {
          "status":"Failed",
          "Error":error
      }
    ); 
  }
}

export const deleteController = async(req:Request,res:Response) => {
  try {
    await contactModel.deleteAllCustomer();
    
    res.status(200).json(
        {
            "status":"success deleted",
        }
    );   
  } catch (error) {
    res.status(500).json(
      {
          "status":"Failed",
          "Error":error
      }
    ); 
  }
}