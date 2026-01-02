type CreateUndertakedJobParams = {
  workerId: string;
  jobId: string;
  status: "accepted" | "in_progress" | "completed" | "canceled";
  requesterEvalScore: number | null;
  acceptedAt: string;
  canceledAt: string | null;
  finishedAt: string | null;
}

type UpdateUndertakedJobParams = {
  status: "accepted" | "in_progress" | "completed" | "canceled";
  requesterEvalScore: number | null;
  acceptedAt: string;
  canceledAt: string | null;
  finishedAt: string | null;
}

type GetUndertakedJobByIdParams = {
  id: string;
}

type DeleteUndertakedJobByIdParams = {
  id: string;
}

export type { CreateUndertakedJobParams, UpdateUndertakedJobParams, GetUndertakedJobByIdParams, DeleteUndertakedJobByIdParams };
