import BoxContent from "@/components/BoxContent";

import { useState } from "react";
import DAOInfoStep, {
  CreateDAOInfoSchemaType,
} from "./CreateStep/DAOInfoStep/DAOInfoStep";
import DAOTokenInfo, {
  DAOTokenInfoSchemaType,
} from "./CreateStep/DAOTokenInfo/DAOTokenInfo";
import DAOListAddressStep, {
  DAOListAddressSchemaType,
} from "./CreateStep/DAOListAddressStep/DAOListAddressStep";
import { CreateDAOContractSchemaType } from "@/utils/Rules";
const DAOCreate = () => {
  const [step, setStep] = useState<number>(1);
  const [dataSubmit, setDataSubmit] = useState<CreateDAOContractSchemaType>({
    nameDAO: "",
    avatarFile: undefined,
    descriptionDao: "",
    listAddress: [],
    nameToken: "",
    requireVote: "",
    amount: "",
    symbol: "",
  });

  const handleUpdateStep = (
    step: number,
    data:
      | DAOTokenInfoSchemaType
      | DAOListAddressSchemaType
      | CreateDAOInfoSchemaType
      | undefined
  ) => {
    setStep(step);
    setDataSubmit((prev) => {
      if (!data) return prev;
      return {
        ...prev,
        ...data,
      };
    });

    console.log("dataSubmit", dataSubmit);
  };

  return (
    <div>
      <div className="text-[24px] flex items-center font-semibold">New DAO</div>
      <BoxContent extendClassName="rounded-[8px] py-4">
        <div>
          {step === 1 && <DAOInfoStep dataSubmit={dataSubmit} handleUpdateStep={handleUpdateStep} />}
          {step === 2 && (
            <DAOListAddressStep dataSubmit={dataSubmit} handleUpdateStep={handleUpdateStep} />
          )}
          {step === 3 && (
            <DAOTokenInfo
              dataSubmit={dataSubmit}
              handleUpdateStep={handleUpdateStep}
            />
          )}
        </div>
      </BoxContent>
    </div>
  );
};

export default DAOCreate;
