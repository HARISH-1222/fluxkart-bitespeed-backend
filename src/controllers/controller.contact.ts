import { Request, Response } from 'express';
import * as contactModel from '../model/model.contact'
import { ICandidate,IOutput } from '../interfaces/interface.candidate';

export const getContactList = async (req:Request,res:Response) => {
  try {
    const requestData = req.body;

    let candidateDetails:ICandidate[];

    // check if email or phoneNumber is already there
    const isNewCustomer:boolean = await contactModel.isNewCustomer(requestData.email,requestData.phoneNumber.toString());

    if(isNewCustomer){
        candidateDetails = await contactModel.createNewCustomer(requestData.email,requestData.phoneNumber.toString());
    }else{
        const isEmailContains:boolean = await contactModel.isEmailOfCustomerExist(requestData.email);
        const isPhoneNumberContains:boolean = await contactModel.isPhoneNumberOfCustomerExist(requestData.phoneNumber.toString());

        if(!(isEmailContains && isPhoneNumberContains)){
            //Fist task
            await contactModel.createNewCustomer(requestData.email,requestData.phoneNumber.toString());
        }

        
        //second task
        candidateDetails = await contactModel.checkIsPhoneNumOrEmailMatch(requestData.email,requestData.phoneNumber.toString());
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

        if(data.phoneNumber && data.linkPrecedence == 'secondary'){
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
  } catch (error) {
      res.status(500).json(
        {
            "status":"Failed",
            "Error":error
        }
      );   
  }
}

//For Testing
export const insertController = async(req:Request,res:Response) => {
  try {
    const requestData = req.body;

    // let isNewCustomer
    let candidateDetails:ICandidate[];

    // check if email or phoneNumber is already there
    // const isNewCustomer:boolean = await contactModel.isNewCustomer(requestData.email,requestData.phoneNumber.toString());
    
    candidateDetails = await contactModel.createNewCustomer(requestData.email,requestData.phoneNumber.toString());
    
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