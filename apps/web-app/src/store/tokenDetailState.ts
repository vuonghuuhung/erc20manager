import { TokenDetails } from "@/hooks/useTokenDetails";
import { create } from "zustand";

type State = {
  tokenDetail: TokenDetails | null;
};

type Actions = {
  setTokenDetail: (body: TokenDetails | null) => void;
  reset: () => void;
};

const initialState: State = {
    tokenDetail: null
};

const useTokenDetailStore = create<State & Actions>()((set) => ({
  ...initialState,
  setTokenDetail: (body) =>
    set((state) => ({
      tokenDetail: (state.tokenDetail = body),
    })),
  reset: () => {
    set(initialState);
  },
}));

export default useTokenDetailStore;
