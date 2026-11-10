import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

/**
 * Firebase 설정 (기존 커리어허브와 동일한 프로젝트 연결)
 * - 새로운 '사회복지현장의이해' 전용 DB로 분리하고 싶다면 아래 설정값만 교체하세요.
 */
export const firebaseConfig = {
    apiKey: "AIzaSyCOsWV1nWDagEtys4Hkkwxql5eEHRqFoC8",
    authDomain: "dauny-camping-car.firebaseapp.com",
    projectId: "dauny-camping-car",
    storageBucket: "dauny-camping-car.firebasestorage.app",
    messagingSenderId: "75684789349",
    appId: "1:75684789349:web:b9cfd9f130d310efc99a8c"
};

export const COLLECTIONS = {
    JOBS: "jobs",
    NEWS: "news"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

export async function ensureAnonymousAuth() {
    try {
        await signInAnonymously(auth);
        currentUser = auth.currentUser;
    } catch (error) {
        console.error("Firebase 익명 인증 오류:", error);
    }
    return currentUser;
}

export function getCurrentUserId() {
    return currentUser?.uid || "guest";
}

export function subscribeCollection(collectionName, onData, onError) {
    return onSnapshot(
        collection(db, collectionName),
        (snapshot) => {
            const items = [];
            snapshot.forEach((d) => items.push({ id: d.id, ...d.data() }));
            onData(items);
        },
        (error) => {
            console.error(`[${collectionName}] 실시간 구독 오류:`, error);
            if (onError) onError(error);
        }
    );
}

export async function createItem(collectionName, data) {
    const payload = {
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        authorId: data.authorId || getCurrentUserId()
    };
    return addDoc(collection(db, collectionName), payload);
}

export async function updateItem(collectionName, docId, data) {
    return updateDoc(doc(db, collectionName, docId), {
        ...data,
        updatedAt: new Date().toISOString()
    });
}

export async function deleteItemWithConfirm(collectionName, docId) {
    if (!confirm("정말로 삭제할까요?")) return false;
    try {
        await deleteDoc(doc(db, collectionName, docId));
        return true;
    } catch (error) {
        console.error("삭제 오류:", error);
        alert("삭제 중 오류가 발생했습니다: " + (error.message || error));
        return false;
    }
}
