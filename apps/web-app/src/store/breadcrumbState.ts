import { create } from "zustand";

interface Breadcrumb {
  name: string;
  path: string;
}
type State = {
  listBreadcrumb: Breadcrumb[];
};

type Actions = {
  setListBreadcrumb: (body: Breadcrumb[]) => void;
  reset: () => void;
};

const initialState: State = {
  listBreadcrumb: [],
};

const useGetBreadcrumb = create<State & Actions>()((set) => ({
  ...initialState,
  setListBreadcrumb: (body) =>
    set((state) => ({
      listBreadcrumb: (state.listBreadcrumb = body),
    })),
  reset: () => {
    set(initialState);
  },
}));

export default useGetBreadcrumb;
