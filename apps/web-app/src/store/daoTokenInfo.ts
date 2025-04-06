import { DaoTokenDetails } from "@/hooks/useDAODetail";
import { create } from "zustand";

type State = {
  tokenDetail: DaoTokenDetails | null;
};

type Actions = {
  setTokenDetail: (body: DaoTokenDetails | null) => void;
  reset: () => void;
};

const initialState: State = {
  tokenDetail: null,
};

const useDaoTokenInfoStore = create<State & Actions>()((set) => ({
  ...initialState,
  setTokenDetail: (body) =>
    set((state) => ({
      tokenDetail: (state.tokenDetail = body),
    })),
  reset: () => {
    set(initialState);
  },
}));

export default useDaoTokenInfoStore;
