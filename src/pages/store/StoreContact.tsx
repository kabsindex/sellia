import { StoreAccount } from './StoreAccount';

/** Le contact fait partie du profil boutique (onglet « À propos »). */
export function StoreContact() {
  return <StoreAccount initialTab="apropos" />;
}
