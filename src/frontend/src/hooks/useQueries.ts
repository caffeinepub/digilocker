import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Document } from "../backend.d";
import { useActor } from "./useActor";

export function useGetCallerDocuments() {
  const { actor, isFetching } = useActor();
  return useQuery<Document[]>({
    queryKey: ["callerDocuments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerDocuments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStats() {
  const { actor, isFetching } = useActor();
  return useQuery<{ totalDocs: bigint; totalUsers: bigint }>({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) return { totalDocs: BigInt(0), totalUsers: BigInt(0) };
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (doc: Document) => {
      if (!actor) throw new Error("Not connected");
      return actor.addDocument(doc);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useVerifyDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (docId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.verifyDocument(docId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerDocuments"] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: { name: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}
