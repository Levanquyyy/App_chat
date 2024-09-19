export const createAuthSlice = (set) => ({
  userInfo: undefined,
  selectedColor: "#000000", // Giá trị mặc định
  setSelectedColor: (color) => set({ selectedColor: color }),
  setUserInfo: (userInfo) => set({ userInfo }),
});
