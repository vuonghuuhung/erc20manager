import BoxContent from "@/components/BoxContent";

import { useState } from "react";
import DAOInfoStep, { CreateDAOInfoSchemaType } from "./CreateStep/DAOInfoStep/DAOInfoStep";
import DAOTokenInfo, { DAOTokenInfoSchemaType } from "./CreateStep/DAOTokenInfo/DAOTokenInfo";
import DAOListAddressStep, { DAOListAddressSchemaType } from "./CreateStep/DAOListAddressStep/DAOListAddressStep";
import { CreateDAOContractSchemaType } from "@/utils/Rules";
const DAOCreate = () => {
  const [step, setStep] = useState<number>(2);
  const [dataSubmit, setDataSubmit] = useState<CreateDAOContractSchemaType>({
    nameDAO: "",
    avatar: "",
    descriptionDao: "",
    listAddress: [],
    nameToken: "",
    requireVote: "",
    amount: "",
    decimals: "",
    symbol: "",
  });
  
  const handleUpdateStep = (step: number, data: DAOTokenInfoSchemaType | DAOListAddressSchemaType | CreateDAOInfoSchemaType) => {
    setStep(step);
    setDataSubmit(prev => {
      return {
        ...prev,
        ...data
      }
    })
  }

  return (
    <div>
      <div className="text-[24px] flex items-center font-semibold">New DAO</div>
      <BoxContent extendClassName="rounded-[8px] py-4">
        <div>
          {/* {step === 1 && <DAOInfoStep handleUpdateStep={handleUpdateStep} />} */}
          {step === 2 && <DAOListAddressStep handleUpdateStep={handleUpdateStep} />}
          {step === 3 && <DAOTokenInfo dataSubmit={dataSubmit} />}
        </div>
      </BoxContent>
    </div>
  );
};

export default DAOCreate;
