import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EmpresaConfig {
  nombre: string;
  nif: string;
  direccion: string;
  codigoPostal: string;
  ciudad: string;
  telefono: string;
  email: string;
  logo?: string;
}

interface EmpresaStore {
  config: EmpresaConfig;
  updateConfig: (config: Partial<EmpresaConfig>) => void;
  setLogo: (logo: string) => void;
}

const defaultConfig: EmpresaConfig = {
  nombre: 'Tu Empresa S.L.',
  nif: 'B12345678',
  direccion: 'Calle Principal 123',
  codigoPostal: '28001',
  ciudad: 'Madrid',
  telefono: '912345678',
  email: 'info@tuempresa.com',
};

export const useEmpresaStore = create<EmpresaStore>()(
  persist(
    (set) => ({
      config: defaultConfig,
      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),
      setLogo: (logo) =>
        set((state) => ({
          config: { ...state.config, logo },
        })),
    }),
    {
      name: 'empresa-config',
    }
  )
);