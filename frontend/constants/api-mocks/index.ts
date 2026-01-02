import { 
  bookmarkJobs,
  jobAiRecommends,
  jobs,
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

// api-mocks直下のデータは全て呼び出せるように


/**
 * 現状のモックデータをロードしていない場合は、APIからデータを取得する
 */

const loadMockData = async (): Promise<void> => {
  // すでにLoadしたか確認
  if (localStorage.getItem("mockDataLoaded")) {
    return;
  }

  // モックデータをロード
  localStorage.setItem("mockDataLoaded", "true");
  localStorage.setItem("bookmarkJobs", JSON.stringify(bookmarkJobs));
  localStorage.setItem("jobAiRecommends", JSON.stringify(jobAiRecommends));
  localStorage.setItem("jobs", JSON.stringify(jobs));
  localStorage.setItem("jobSkills", JSON.stringify(jobSkills));
  localStorage.setItem("requirementSkills", JSON.stringify(requirementSkills));
  localStorage.setItem("skills", JSON.stringify(skills));
  localStorage.setItem("subsidies", JSON.stringify(subsidies));
  localStorage.setItem("transactionHistories", JSON.stringify(transactionHistories));
  localStorage.setItem("trustPassports", JSON.stringify(trustPassports));
  localStorage.setItem("undertakedJobs", JSON.stringify(undertakedJobs));
  localStorage.setItem("workers", JSON.stringify(workers));
  localStorage.setItem("workerSkills", JSON.stringify(workerSkills));

  // ロード完了
  localStorage.setItem("mockDataLoaded", "true");
};

export { loadMockData };
