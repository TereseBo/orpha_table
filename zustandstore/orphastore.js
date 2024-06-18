import {create} from 'zustand';

const useStore = create((set, get) => ({
  searchResultList: [],
  selectedDiseaseList: [],
  setSearchResultList: (list) => set({ searchResultList: list }),
  removeItemFromSearchResultList: (item) => set((state) => ({
    searchResultList: state.searchResultList.filter(disease => disease.orphacode !== item.orphacode),
  })),
  setSelectedDiseaseList: (list) => set({ selectedDiseaseList: list }),
  addItemToSelectedDiseaseList: (item) => set((state) => ({
    selectedDiseaseList: [...state.selectedDiseaseList, item],
  })),
  removeItemFromSelectedDiseaseList: (item) => set((state) => ({
    selectedDiseaseList: state.selectedDiseaseList.filter(disease => disease.orphacode !== item.orphacode),
  })),
  transferToSelected: (disease) => {
    console.log('IN TRANSFER TO SELECTED')
    console.log(disease);
    let { selectedDiseaseList, searchResultList } = get();
    set(() => ({ selectedDiseaseList: [...selectedDiseaseList, disease] }));
    set(() => ({ searchResultList: searchResultList.filter(disease => disease.orphacode !== disease.orphacode) }));
  },
}));

export default useStore;
