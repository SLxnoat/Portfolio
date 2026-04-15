import { create } from 'zustand';
import { portfolioService } from '../services/portfolioService';

const usePortfolioStore = create((set, get) => ({
  profile: null,
  projects: [],
  skills: [],
  experience: [],
  education: [],
  isLoading: true,
  error: null,

  fetchData: async () => {
    set({ isLoading: true });
    try {
      const [profile, projects, skills, experience, education] = await Promise.all([
        portfolioService.getProfile(),
        portfolioService.getAll('projects'),
        portfolioService.getAll('skills'),
        portfolioService.getAll('experience'),
        portfolioService.getAll('education')
      ]);

      set({ 
        profile, 
        projects, 
        skills, 
        experience, 
        education, 
        isLoading: false 
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateProfile: async (data) => {
    const updated = await portfolioService.updateProfile(data);
    set({ profile: updated });
  },

  addProject: async (project) => {
    await portfolioService.add('projects', project);
    const projects = await portfolioService.getAll('projects');
    set({ projects });
  },

  updateProject: async (project) => {
    await portfolioService.update('projects', project);
    const projects = await portfolioService.getAll('projects');
    set({ projects });
  },

  deleteProject: async (id) => {
    await portfolioService.delete('projects', id);
    const projects = await portfolioService.getAll('projects');
    set({ projects });
  }
  // Add other actions as needed (skills, experience, etc.)
}));

export default usePortfolioStore;
