import { create } from "zustand";

export interface transactionInfo {
  hash: `0x${string}`;
  functionName: string
  urlReCall?: string
}

type State = {
  listTransaction: transactionInfo[];
};

type Actions = {
  setListTransaction: (body: transactionInfo) => void;
  reset: () => void;
};

const initialState: State = {
  listTransaction: []
};

const useListTransactionStore = create<State & Actions>()((set) => ({
  ...initialState,
  setListTransaction: (body) =>
    set((state) => ({
      listTransaction: (state.listTransaction = [...state.listTransaction, body]),
    })),
  reset: () => {
    set(initialState);
  },
}));

export default useListTransactionStore;
