import { create } from 'zustand'

export const useUI = create((set)=>({
  sidebarOpen: true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  openSidebar: () => set({ sidebarOpen: true }),
   selectedResource: null,
  setSelectedResource: (key) => set({ selectedResource: key }),
  clearSelectedResource: () => set({ selectedResource: null })
}))