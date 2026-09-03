/**
 * SOFTVISION TECH — Configuración de Firebase
 * Conexión prioritaria con la infraestructura provista en firebase-applet-config.json
 * con respaldo en variables de entorno.
 */

import appletConfig from '../../firebase-applet-config.json';

const env = (import.meta as any).env || {};

export const firebaseConfig = {
  apiKey: appletConfig?.apiKey || env.VITE_FIREBASE_API_KEY || "",
  authDomain: appletConfig?.authDomain || env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: appletConfig?.projectId || env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: appletConfig?.storageBucket || env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: appletConfig?.messagingSenderId || env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: appletConfig?.appId || env.VITE_FIREBASE_APP_ID || "",
  firestoreDatabaseId: appletConfig?.firestoreDatabaseId || "(default)"
};

/**
 * Verifica si las credenciales de Firebase están configuradas y listas para su uso
 */
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.includes("ExampleKey")
  );
};

