import { create } from 'zustand';

const useStore = create((set, get) => ({
  searchResultList: [],
  selectedDiseaseList: [],
  setSearchResultList: (list) => set({ searchResultList: list }),
  removeItemFromSearchResultList: (item) => set((state) => ({
    searchResultList: state.searchResultList.filter(disease => disease.orphacode !== item.orphacode),
  })),
  setSelectedDiseaseList: (list) => set({ selectedDiseaseList: list }),
  removeItemFromSelectedDiseaseList: (item) => set((state) => ({
    selectedDiseaseList: state.selectedDiseaseList.filter(disease => disease.orphacode !== item.orphacode),
  })),
  transferToSelected: (disease) => {
    let { selectedDiseaseList, searchResultList } = get();

    // Check if the disease is already in selectedDiseaseList
    const diseaseExists = selectedDiseaseList.some(item => item.orphacode === disease.orphacode);

    if (!diseaseExists) {
      // Add to selectedDiseaseList only if it doesn't exist, in order to avoid duplicates
      set({ selectedDiseaseList: [...selectedDiseaseList, disease] });
    }
    // Remove from searchResultList
    set({ searchResultList: searchResultList.filter(item => item.orphacode !== disease.orphacode) });
  },
}));

export default useStore;
