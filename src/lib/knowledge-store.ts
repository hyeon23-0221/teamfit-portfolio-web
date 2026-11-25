import { initialCreatorProfile, initialProjects, initialFAQs, CreatorProfile, Project, FAQ } from './portfolio-data';

// Server-side knowledge storage state (in-memory + Supabase sync)
interface KnowledgeData {
  profile: CreatorProfile;
  projects: Project[];
  faqs: FAQ[];
}

const memoryStore: KnowledgeData = {
  profile: { ...initialCreatorProfile },
  projects: [...initialProjects],
  faqs: [...initialFAQs],
};

export function getKnowledgeData(): KnowledgeData {
  return memoryStore;
}

export function updateKnowledgeData(partial: Partial<KnowledgeData>): KnowledgeData {
  if (partial.profile) {
    memoryStore.profile = { ...memoryStore.profile, ...partial.profile };
  }
  if (partial.projects) {
    memoryStore.projects = [...partial.projects];
  }
  if (partial.faqs) {
    memoryStore.faqs = [...partial.faqs];
  }
  return memoryStore;
}
