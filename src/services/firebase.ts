/**
 * SOFTVISION TECH — Inicialización de Firebase & Capa de Persistencia Adaptativa
 * Conecta con Firebase Firestore/Auth si existen credenciales válidas,
 * o inicializa el almacén seguro reactivo local para demostración y evaluación inmediata.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig, isFirebaseConfigured } from '../config/firebaseConfig';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured()) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    // Si firestoreDatabaseId está configurado y no es "(default)", usarlo; sino getFirestore(app)
    if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)") {
      db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    } else {
      db = getFirestore(app);
    }
    
    auth = getAuth(app);
    console.info('[Firebase] Conexión establecida con Firestore & Auth con éxito.');
  } catch (error) {
    console.warn('[Firebase] No se pudo inicializar Firebase con databaseId custom, probando default:', error);
    try {
      if (app) {
        db = getFirestore(app);
        auth = getAuth(app);
      }
    } catch (fallbackErr) {
      console.warn('[Firebase] Fallback de inicialización local:', fallbackErr);
    }
  }
} else {
  console.info('[Firebase] Variables de entorno de Firebase no detectadas. Operando con motor reactivo persistente local.');
}

export { app, db, auth };

