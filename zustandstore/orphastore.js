import {create} from 'zustand';

const useStore = create((set) => ({
  searchResultList: [],
  selectedDiseaseList: [],
  setSearchResultList: (list) => set({ searchResultList: list }),
  removeItemFromSearchResultList: (item) => set((state) => ({
    searchResultListList: state.searchResultList.filter(disease => disease !== item),
  })),
  setSelectedDiseaseList: (list) => set({ selectedDiseaseList: list }),
  addItemToSelectedDiseaseList: (item) => set((state) => ({
    selectedDiseaseListt: [...state.searchResultList, item],
  })),
  removeItemFromSelectedDiseaseList: (item) => set((state) => ({
    selectedDiseaseList: state.selectedDiseaseList.filter(disease => disease !== item),
  })),
}));

export default useStore;
