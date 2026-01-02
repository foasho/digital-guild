import {
  bookmarkJobs,
  jobAiRecommends,
  allJobs,
  jobSkills,
  requesters,
  requirementSkills,
  skills,
  subsidies,
  transactionHistories,
  trustPassports,
  undertakedJobs,
  workers,
  workerSkills,
} from "@/constants/mocks";

// API exports
export { BookmarkJobApi } from "./bookmarkJobApi";
export { JobApi } from "./jobApi";
export { JobAiRecommendApi } from "./jobAiRecommendApi";
export { JobSkillApi } from "./jobSkillApi";
export { RequesterApi } from "./requesterApi";
export { RequirementSkillApi } from "./requirementSkillApi";
export { SkillApi } from "./skillApi";
export { SubsidyApi } from "./subsidyApi";
export { TransactionHistoryApi } from "./transactionHistoryApi";
export { TrustPassportApi } from "./trustPassportApi";
export { UndertakedJobApi } from "./undertakedJobApi";
export { WorkerApi } from "./workerApi";
export { WorkerSkillApi } from "./workerSkillApi";

/**
 * モックデータをLocalStorageにロードする
 * アプリ起動時に1度だけ実行される
 */
const loadMockData = async (): Promise<void> => {
  // すでにLoadしたか確認
  if (localStorage.getItem("mockDataLoaded")) {
    console.log("Mock data already loaded");
    return;
  }

  // モックデータをロード
  localStorage.setItem("bookmarkJobs", JSON.stringify(bookmarkJobs));
  localStorage.setItem("jobAiRecommends", JSON.stringify(jobAiRecommends));
  localStorage.setItem("jobs", JSON.stringify(allJobs));
  localStorage.setItem("jobSkills", JSON.stringify(jobSkills));
  localStorage.setItem("requesters", JSON.stringify(requesters));
  localStorage.setItem("requirementSkills", JSON.stringify(requirementSkills));
  localStorage.setItem("skills", JSON.stringify(skills));
  localStorage.setItem("subsidies", JSON.stringify(subsidies));
  localStorage.setItem(
    "transactionHistories",
    JSON.stringify(transactionHistories)
  );
  localStorage.setItem("trustPassports", JSON.stringify(trustPassports));
  localStorage.setItem("undertakedJobs", JSON.stringify(undertakedJobs));
  localStorage.setItem("workers", JSON.stringify(workers));
  localStorage.setItem("workerSkills", JSON.stringify(workerSkills));

  // ロード完了フラグ
  localStorage.setItem("mockDataLoaded", "true");

  console.log("Mock data loaded");
};

/**
 * モックデータをリセットする（開発用）
 */
const resetMockData = async (): Promise<void> => {
  localStorage.removeItem("mockDataLoaded");
  localStorage.removeItem("bookmarkJobs");
  localStorage.removeItem("jobAiRecommends");
  localStorage.removeItem("jobs");
  localStorage.removeItem("jobSkills");
  localStorage.removeItem("requesters");
  localStorage.removeItem("requirementSkills");
  localStorage.removeItem("skills");
  localStorage.removeItem("subsidies");
  localStorage.removeItem("transactionHistories");
  localStorage.removeItem("trustPassports");
  localStorage.removeItem("undertakedJobs");
  localStorage.removeItem("workers");
  localStorage.removeItem("workerSkills");

  // 再ロード
  await loadMockData();
};

export { loadMockData, resetMockData };
