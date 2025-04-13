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
import { CircleDashed, Users, Coins } from "lucide-react";
import { initialDAOCreate } from "@/constants/token";

const STEPS = [
  {
    id: 1,
    title: "Information",
    icon: CircleDashed,
  },
  {
    id: 2,
    title: "Configuration",
    icon: Users,
  },
  {
    id: 3,
    title: "Token Setup",
    icon: Coins,
  },
];



const DAOCreate = () => {
  const [step, setStep] = useState<number>(1);
  const [dataSubmit, setDataSubmit] = useState<CreateDAOContractSchemaType>(initialDAOCreate);

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
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-700/50 mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Create New DAO
        </h1>
        <p className="text-gray-400">
          Set up your Decentralized Autonomous Organization in a few simple
          steps
        </p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
        {/* Progress Steps */}
        <div className="border-b border-gray-700/50">
          <div className="flex items-center px-6 py-4">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1 justify-between last:flex-none">
                <div
                  className={`flex items-center ${step >= s.id ? "text-blue-400" : "text-gray-500"}`}
                >
                  <div className="flex items-center justify-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step === s.id
                          ? "bg-blue-500/10 ring-2 ring-blue-400/20"
                          : step > s.id
                            ? "bg-blue-500/10"
                            : "bg-gray-800"
                      }`}
                    >
                      <s.icon className="w-4 h-4" />
                    </div>
                    <div className="ml-3 hidden md:block">
                      <p className="text-sm font-medium text-center">{s.title}</p>
                    </div>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${step > s.id ? "bg-blue-400" : "bg-gray-700"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {step === 1 && (
            <DAOInfoStep
              dataSubmit={dataSubmit}
              handleUpdateStep={handleUpdateStep}
            />
          )}
          {step === 2 && (
            <DAOListAddressStep
              dataSubmit={dataSubmit}
              handleUpdateStep={handleUpdateStep}
            />
          )}
          {step === 3 && (
            <DAOTokenInfo
              dataSubmit={dataSubmit}
              handleUpdateStep={handleUpdateStep}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DAOCreate;
