import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { Milestone, FeasibilityResult } from "./types";

export interface UserProject {
  id: string;
  userId: string;
  name: string;
  idea: string;
  audience: string;
  country: string;
  constraints: string;
  feasibilityScore: number;
  feasibilityAdvice: string;
  competitors: string[];
  painPoints: string[];
  milestones: Milestone[];
  activeMilestoneIndex: number;
  devilAdvocate: string[];
  createdAt: any;
  updatedAt: any;
}

// Save a brand new project and its generated roadmap to Firestore
export async function saveProject(
  userId: string,
  name: string,
  idea: string,
  audience: string,
  country: string,
  constraints: string,
  analysis: FeasibilityResult
): Promise<string> {
  const projectsCol = collection(db, "projects");
  const docRef = await addDoc(projectsCol, {
    userId,
    name,
    idea,
    audience,
    country,
    constraints,
    feasibilityScore: analysis.score,
    feasibilityAdvice: analysis.advice,
    competitors: analysis.competitors,
    painPoints: analysis.painPoints,
    milestones: analysis.roadmap,
    devilAdvocate: analysis.devilAdvocate,
    activeMilestoneIndex: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Fetch all projects for a specific user
export async function getUserProjects(userId: string): Promise<UserProject[]> {
  const projectsCol = collection(db, "projects");
  const q = query(
    projectsCol,
    where("userId", "==", userId),
    orderBy("updatedAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : null,
      updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : null,
    } as UserProject;
  });
}

// Fetch a single project by its ID
export async function getProject(projectId: string): Promise<UserProject | null> {
  const docRef = doc(db, "projects", projectId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : null,
    updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : null,
  } as UserProject;
}

// Update the progress stage of a project in Firestore
export async function updateProjectMilestone(
  projectId: string,
  activeMilestoneIndex: number
): Promise<void> {
  const docRef = doc(db, "projects", projectId);
  await updateDoc(docRef, {
    activeMilestoneIndex,
    updatedAt: serverTimestamp(),
  });
}

// Delete a project from Firestore
export async function deleteProject(projectId: string): Promise<void> {
  const docRef = doc(db, "projects", projectId);
  await deleteDoc(docRef);
}
